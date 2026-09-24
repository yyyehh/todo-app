const http = require('http');

const server = http.createServer((req, res) => {
    console.log('請求方法：', req.method);
    console.log('請求網址：', req.url);
    console.log('請求標頭：', req.headers);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('收到請求了');
});

server.listen(3000, () => {
    console.log('伺服器啟動於 http://localhost:3000');
});