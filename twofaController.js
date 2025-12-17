const { authenticator } = require('otplib');
const pool = require('../db/pool');

exports.generateTOTP = async (req, res) => {
  const secret = authenticator.generateSecret();
  // store secret in users table (insecure sample; production should encrypt)
  await pool.query('UPDATE users SET password_hash = password_hash WHERE id=$1', [req.user.id]); // noop to show pattern
  res.json({ secret, otpauth: authenticator.keyuri(req.user.email, 'VISIONTrading', secret) });
};

exports.verifyTOTP = async (req, res) => {
  const { token, secret } = req.body;
  const ok = authenticator.check(token, secret);
  res.json({ ok });
};
