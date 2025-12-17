const pool = require('../db/pool');
const matching = require('../services/matchingEngine');

// Very simplified order endpoint (no matching engine)
exports.createOrder = async (req, res) => {
  const { side, amount_bigint, price_numeric } = req.body;
  const r = await pool.query('INSERT INTO orders (user_id, side, amount_bigint, price_numeric) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.id, side, amount_bigint, price_numeric]);
  const order = r.rows[0];
  // try to match
  try { await matching.matchOrder(order); } catch(e){ console.error('matching error', e.message); }
  res.json({ order });
};

exports.listOrders = async (req, res) => {
  const r = await pool.query('SELECT * FROM orders WHERE user_id=$1', [req.user.id]);
  res.json({ orders: r.rows });
};
