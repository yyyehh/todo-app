const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, Todo App!');
});

server.listen(3000, () => {
    console.log('伺服器啟動於 http://localhost:3000');
});