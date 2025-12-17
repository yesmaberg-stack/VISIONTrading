const pool = require('../db/pool');

// Ledger service: atomic debit/credit using DB transaction
async function createLedgerEntry(client, wallet_id, type, amount_bigint, metadata) {
  const q = 'INSERT INTO ledger (wallet_id, type, amount_bigint, metadata) VALUES ($1,$2,$3,$4) RETURNING *';
  const r = await client.query(q, [wallet_id, type, amount_bigint, metadata || {}]);
  return r.rows[0];
}

async function transferBetweenWallets(fromWalletId, toWalletId, amount_bigint) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check balances
    const f = await client.query('SELECT balance_bigint FROM wallets WHERE id=$1 FOR UPDATE', [fromWalletId]);
    if (f.rows.length === 0) throw new Error('from wallet not found');
    if (BigInt(f.rows[0].balance_bigint) < BigInt(amount_bigint)) throw new Error('insufficient funds');
    // Debit from
    await client.query('UPDATE wallets SET balance_bigint = balance_bigint - $1 WHERE id=$2', [amount_bigint, fromWalletId]);
    await createLedgerEntry(client, fromWalletId, 'transfer_debit', -Math.abs(Number(amount_bigint)), { toWalletId });
    // Credit to
    await client.query('UPDATE wallets SET balance_bigint = balance_bigint + $1 WHERE id=$2', [amount_bigint, toWalletId]);
    await createLedgerEntry(client, toWalletId, 'transfer_credit', Math.abs(Number(amount_bigint)), { fromWalletId });
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { createLedgerEntry, transferBetweenWallets };
