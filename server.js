const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config'); // 啟動時就檢查環境變數
const auth = require('./middleware/auth');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

const app = express();

// 部署在雲端時，請求會經過代理伺服器，要這行才能取得真正的使用者 IP（限流需要）
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));

// 計時 Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`);
  });
  next();
});

app.use(express.json());
app.use(express.static('public'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: '嘗試次數過多，請 15 分鐘後再試' }
});

const startedAt = new Date().toISOString();

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    startedAt,
    uptimeSeconds: Math.round(process.uptime())
  });
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/todos', auth, todosRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API 路徑不存在' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 400 ? '請求格式錯誤' : '伺服器發生未預期的錯誤'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('啟動失敗：', err.message);
    return;
  }
  console.log(`伺服器啟動於 http://localhost:${PORT}`);
});