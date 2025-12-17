const pool = require('../db/pool');

exports.tip = async (req, res) => {
  const { to_user, amount_bigint } = req.body;
  // Basic check and ledger entries (no real transfer safety checks)
  const r = await pool.query('INSERT INTO tips (from_user,to_user,amount_bigint) VALUES ($1,$2,$3) RETURNING *', [req.user.id, to_user, amount_bigint]);
  // Note: in production must debit and credit wallets with ledger entries and fees
  res.json({ tip: r.rows[0] });
};
