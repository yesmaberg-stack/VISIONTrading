const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email+password required' });
  const ph = await bcrypt.hash(password, 10);
  try {
    const r = await pool.query('INSERT INTO users (email, password_hash, name) VALUES ($1,$2,$3) RETURNING id, email, name', [email, ph, name]);
    res.json({ user: r.rows[0] });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const r = await pool.query('SELECT id, password_hash FROM users WHERE email=$1', [email]);
  if (r.rows.length===0) return res.status(400).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, r.rows[0].password_hash);
  if (!ok) return res.status(400).json({ error: 'invalid' });
  const token = jwt.sign({ sub: r.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};
