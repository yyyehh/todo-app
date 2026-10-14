const express = require('express');
const db = require('../db');
const router = express.Router();

// 統計（一定要在 /:id 之前）
router.get('/stats', (req, res) => {
  db.get(
    `SELECT
       COUNT(*) AS total,
       COALESCE(SUM(done), 0) AS done,
       COALESCE(SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END), 0) AS pending,
       COALESCE(SUM(CASE WHEN done = 0 AND due_date IS NOT NULL
                          AND due_date < date('now', 'localtime') THEN 1 ELSE 0 END), 0) AS overdue
     FROM todos`,
    (err, row) => {
      if (err) return res.status(500).json({ message: '資料庫錯誤' });
      res.json(row);
    }
  );
});

// 取得清單（可用 ?category= 篩選）
router.get('/', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM todos';
  const params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }
  sql += ' ORDER BY due_date IS NULL, due_date ASC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    res.json(rows);
  });
});

// 取得單一筆
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM todos WHERE id = ?', [Number(req.params.id)], (err, todo) => {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    if (!todo) return res.status(404).json({ message: '找不到這筆待辦事項' });
    res.json(todo);
  });
});

// 新增
router.post('/', (req, res) => {
  const title = (req.body.title || '').trim();
  const category = (req.body.category || '未分類').trim();
  const due_date = req.body.due_date || null;

  if (!title) {
    return res.status(400).json({ message: '待辦事項內容不能是空白' });
  }
  if (title.length > 50) {
    return res.status(400).json({ message: '待辦事項內容不能超過 50 字' });
  }

  const stmt = db.prepare(
    'INSERT INTO todos (title, done, category, due_date) VALUES (?, 0, ?, ?)'
  );
  stmt.run(title, category, due_date, function (err) {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    res.status(201).json({ id: this.lastID, title, done: 0, category, due_date });
  });
  stmt.finalize();
});

// 編輯標題
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const title = (req.body.title || '').trim();

  if (!title) {
    return res.status(400).json({ message: '待辦事項內容不能是空白' });
  }
  if (title.length > 50) {
    return res.status(400).json({ message: '待辦事項內容不能超過 50 字' });
  }

  db.run('UPDATE todos SET title = ? WHERE id = ?', [title, id], function (err) {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    if (this.changes === 0) {
      return res.status(404).json({ message: '找不到這筆待辦事項' });
    }
    res.json({ id, title });
  });
});

// 切換完成狀態
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);

  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    if (!todo) return res.status(404).json({ message: '找不到這筆待辦事項' });

    const newDone = todo.done ? 0 : 1;
    db.run('UPDATE todos SET done = ? WHERE id = ?', [newDone, id], (err) => {
      if (err) return res.status(500).json({ message: '資料庫錯誤' });
      res.json({ ...todo, done: newDone });
    });
  });
});

// 刪除
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ message: '資料庫錯誤' });
    if (this.changes === 0) {
      return res.status(404).json({ message: '找不到這筆待辦事項' });
    }
    res.status(204).send();
  });
});

module.exports = router;