const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('這是首頁');
});

app.get('/about', (req, res) => {
  res.send('這是關於頁面');
});

app.get('/success', (req, res) => {
  res.status(200).send('請求成功');
});

app.get('/notfound', (req, res) => {
  res.status(404).send('找不到這個頁面');
});

app.listen(3000, () => {
  console.log('伺服器啟動於 http://localhost:3000');
});