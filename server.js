const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./config');
const auth = require('./middleware/auth');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));

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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

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