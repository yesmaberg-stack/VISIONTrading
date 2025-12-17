const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../db/pool');

const auth = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  const token = h.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const r = await pool.query('SELECT id, email, name, role FROM users WHERE id=$1', [payload.sub]);
    if (r.rows.length === 0) return res.status(401).json({ error: 'User not found' });
    req.user = r.rows[0];
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
