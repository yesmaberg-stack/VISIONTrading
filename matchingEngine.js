const pool = require('../db/pool');

// Extremely simplified matching engine for limit orders (single asset)
// Matches incoming order against open orders at same price (FIFO)
async function matchOrder(order) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // find opposite side orders at same price
    const opposite = order.side === 'buy' ? 'sell' : 'buy';
    const q = 'SELECT * FROM orders WHERE side=$1 AND price_numeric=$2 AND status=$3 ORDER BY created_at ASC FOR UPDATE';
    const r = await client.query(q, [opposite, order.price_numeric, 'open']);
    let remaining = BigInt(order.amount_bigint);
    for (const row of r.rows) {
      if (remaining <= 0) break;
      const available = BigInt(row.amount_bigint);
      const take = remaining <= available ? remaining : available;
      // update matched order
      const newAvail = available - take;
      if (newAvail === 0n) {
        await client.query('UPDATE orders SET status=$1, updated_at=now() WHERE id=$2', ['filled', row.id]);
      } else {
        await client.query('UPDATE orders SET amount_bigint=$1, updated_at=now() WHERE id=$2', [String(newAvail), row.id]);
      }
      remaining -= take;
      // create ledger entries and trades table (if exists)
      await client.query('INSERT INTO ledger (wallet_id, type, amount_bigint, metadata) VALUES ($1,$2,$3,$4)', [row.user_id, 'trade', Number(-take), { counterparty: order.user_id, price: order.price_numeric }]);
      await client.query('INSERT INTO ledger (wallet_id, type, amount_bigint, metadata) VALUES ($1,$2,$3,$4)', [order.user_id, 'trade', Number(take), { counterparty: row.user_id, price: order.price_numeric }]);
    }
    // update incoming order status/remaining
    if (remaining === 0n) {
      await client.query('UPDATE orders SET status=$1, updated_at=now() WHERE id=$2', ['filled', order.id]);
    } else {
      await client.query('UPDATE orders SET amount_bigint=$1, updated_at=now() WHERE id=$2', [String(remaining), order.id]);
    }
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { matchOrder };
