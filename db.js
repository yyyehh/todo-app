const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

// 建立資料表（如果不存在的話）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);

  // 檢查資料表是不是空的，是的話放入初始資料
  db.get('SELECT COUNT(*) AS count FROM todos', (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO todos (title, done) VALUES (?, ?)');
      stmt.run('完成 Web 原理作業', 0);
      stmt.run('寫鐵人賽 Day 9', 0);
      stmt.run('複習 Express 路由', 1);
      stmt.finalize();
    }
  });
});

module.exports = db;