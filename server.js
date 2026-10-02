const express = require('express');
const app = express();

app.use(express.json()); //解析 JSON 格式的請求主體
const db = require('./db');

//Midleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next(); //必須要呼叫，不然請求會卡住
});

app.use(express.static('public')); 


//取得所有待辦事項
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: '資料庫錯誤' });
    }
    res.json(rows);
  });
});

//取得單一待辦事項
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) {
   return res.status(404).json({ message: '找不到這筆待辦事項' });
  }
  res.json(todo);
});

//新增待辦事項
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: '請提供待辦事項內容' });
  }

  const stmt = db.prepare('INSERT INTO todos (title, done) VALUES (?, 0)');
  stmt.run(title, function (err) {
    if (err) {
      return res.status(500).json({ message: '資料庫錯誤' });
    }
    // this.lastID 是剛剛新增那筆資料的 id
    res.status(201).json({ id: this.lastID, title, done: 0 });
  });
  stmt.finalize();
});

//更新待辦事項
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
    if (!todo) {
      return res.status(404).json({ message: '找不到這筆待辦事項' });
    }

    const newDone = todo.done ? 0 : 1;
    db.run('UPDATE todos SET done = ? WHERE id = ?', [newDone, id], (err) => {
      if (err) {
        return res.status(500).json({ message: '資料庫錯誤' });
      }
      res.json({ ...todo, done: newDone });
    });
  });
});

//刪除待辦事項
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: '資料庫錯誤' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: '找不到這筆待辦事項' });
    }
    res.status(204).send();
  });
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