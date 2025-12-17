const pool = require('../db/pool');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
exports.uploadKYC = [
  upload.single('document'),
  async (req, res) => {
    const { user } = req;
    if (!req.file) return res.status(400).json({ error: 'file required' });
    // store simple record in users table metadata (in real life use separate table / storage)
    const r = await pool.query('UPDATE users SET kyc_status=$1 WHERE id=$2 RETURNING id, kyc_status', ['pending', user.id]);
    // store filename in ledger metadata as example (not ideal in prod)
    await pool.query('INSERT INTO ledger (wallet_id, type, amount_bigint, metadata) VALUES ($1,$2,$3,$4)', [null, 'kyc_upload', 0, { user_id: user.id, filename: req.file.filename }]);
    res.json({ status: 'uploaded', file: req.file.filename });
  }
];
