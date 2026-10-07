const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    category TEXT DEFAULT '未分類',
    due_date TEXT
    )
  `);

  db.get('SELECT COUNT(*) AS count FROM todos', (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO todos (title, done, category, due_date) VALUES (?, ?, ?, ?)');
      stmt.run('完成 Web 原理作業', 0, '作業', '2026-10-15');
      stmt.run('寫鐵人賽 Day 13', 0, '鐵人賽', '2026-10-07');
      stmt.run('複習 Express 路由', 1, '作業', '2026-10-01');
      stmt.finalize();
    }
  });
});

module.exports = db;