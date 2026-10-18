require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('缺少環境變數 JWT_SECRET，請建立 .env 檔案');
}

module.exports = { JWT_SECRET };