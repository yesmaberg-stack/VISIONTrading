const pool = require('../db/pool');

exports.getLedger = async (req, res) => {
  const r = await pool.query('SELECT l.*, w.currency FROM ledger l JOIN wallets w ON l.wallet_id = w.id WHERE w.user_id = $1 ORDER BY l.created_at DESC LIMIT 200', [req.user.id]);
  res.json({ ledger: r.rows });
};
