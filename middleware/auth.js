const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: '請先登入' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET); // 驗證成功，把使用者資料掛上去
    next();
  } catch (e) {
    res.status(401).json({ message: '登入已過期，請重新登入' });
  }
};