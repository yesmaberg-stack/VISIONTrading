const pool = require('../db/pool');

// Simple wallet creation and balance retrieval
exports.getWallets = async (req, res) => {
  const r = await pool.query('SELECT * FROM wallets WHERE user_id=$1', [req.user.id]);
  res.json({ wallets: r.rows });
};

exports.createWallet = async (req, res) => {
  const { currency } = req.body;
  const r = await pool.query('INSERT INTO wallets (user_id, currency) VALUES ($1,$2) RETURNING *', [req.user.id, currency || 'USD']);
  res.json({ wallet: r.rows[0] });
};
