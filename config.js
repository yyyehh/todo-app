// 上線時要用環境變數設定，不要把真正的密鑰寫死在程式碼裡
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';

module.exports = { JWT_SECRET };