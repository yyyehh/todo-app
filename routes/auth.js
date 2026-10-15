const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ message: '帳號長度需要 3 到 20 字' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '密碼至少需要 6 個字' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: '這個帳號已經被使用' });
          }
          return res.status(500).json({ message: '資料庫錯誤' });
        }
        res.status(201).json({ id: this.lastID, username });
      }
    );
  } catch (e) {
    res.status(500).json({ message: '伺服器發生未預期的錯誤' });
  }
});

module.exports = router;