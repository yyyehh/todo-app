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
  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    title: req.body.title,
    done: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

//更新待辦事項
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: '找不到這筆待辦事項' });
  }
  todo.done = !todo.done; //切換完成狀態
  res.json(todo);
});

//刪除待辦事項
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: '找不到這筆待辦事項' });
  }
  todos.splice(index, 1);
  res.status(204).send();
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