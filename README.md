# 待辦清單網站

Web 原理與技術自主學習 30 天作品。

## 功能
- 註冊、登入（JWT）
- 待辦事項新增、編輯、完成、刪除
- 分類、截止日期、逾期標示、統計
- 分類篩選與關鍵字搜尋
- 每位使用者只能存取自己的資料

## 技術
Node.js、Express 5、SQLite、bcryptjs、jsonwebtoken、helmet、express-rate-limit

## 本機執行
1. `npm install`
2. 複製 `.env.example` 為 `.env`，填入 `JWT_SECRET`
3. `npm start`
4. 開啟 http://localhost:3000/login.html

## 已知限制
SQLite 資料庫存在本機檔案，部署到免費雲端主機時，重啟或重新部署會被重置。