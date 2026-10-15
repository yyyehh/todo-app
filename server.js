const express = require('express');
const todosRouter = require('./routes/todos');
const authRouter = require('./routes/auth');

const app = express();

// 計時 Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});

app.use(express.json());
app.use(express.static('public'));
app.use('/api/auth', authRouter);

// 待辦事項相關的 API 全部交給 router
app.use('/api/todos', todosRouter);

// /api 底下找不到的路徑，回傳 JSON 格式的 404
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API 路徑不存在' });
});

// 錯誤處理 Middleware（特徵：四個參數）
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 400 ? '請求格式錯誤' : '伺服器發生未預期的錯誤'
  });
});

app.listen(3000, () => {
  console.log('伺服器啟動於 http://localhost:3000');
});