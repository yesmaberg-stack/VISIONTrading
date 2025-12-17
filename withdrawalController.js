const pool = require('../db/pool');

// Request withdrawal -> create a pending withdrawal request in ledger as metadata
exports.requestWithdrawal = async (req, res) => {
  const { wallet_id, amount_bigint, address } = req.body;
  // In production, lock wallet, create pending ledger entry and await admin approval
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // check wallet owned by user
    const w = await client.query('SELECT * FROM wallets WHERE id=$1 AND user_id=$2 FOR UPDATE', [wallet_id, req.user.id]);
    if (w.rows.length === 0) throw new Error('wallet not found');
    if (BigInt(w.rows[0].balance_bigint) < BigInt(amount_bigint)) throw new Error('insufficient funds');
    // reserve funds (simple approach)
    await client.query('UPDATE wallets SET balance_bigint = balance_bigint - $1 WHERE id=$2', [amount_bigint, wallet_id]);
    await client.query('INSERT INTO ledger (wallet_id, type, amount_bigint, metadata) VALUES ($1,$2,$3,$4)', [wallet_id, 'withdrawal_pending', -Number(amount_bigint), { address }]);
    await client.query('COMMIT');
    res.json({ status: 'pending' });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
};

exports.adminApproveWithdrawal = async (req, res) => {
  const { ledger_id } = req.body;
  // For demo: mark as processed
  const r = await pool.query('UPDATE ledger SET metadata = metadata || $1 WHERE id=$2 RETURNING *', [JSON.stringify({ processed: true, processed_by: req.user.id }), ledger_id]);
  res.json({ updated: r.rows[0] });
};
