const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

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

router.post('/login', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });

    try {
      const ok = user && (await bcrypt.compare(password, user.password_hash));
      if (!ok) {
        // 帳號不存在和密碼錯誤用同一句話，不讓外人探測有哪些帳號
        return res.status(401).json({ message: '帳號或密碼錯誤' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, username: user.username });
    } catch (e) {
      res.status(500).json({ message: '伺服器發生未預期的錯誤' });
    }
  });
});

module.exports = router;