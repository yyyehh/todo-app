# 待辦清單網站

Web 原理與技術自主學習 30 天作品。

## 線上版本
https://todo-app-3f13.onrender.com

免費方案閒置 15 分鐘會休眠，第一次載入可能需要等待約一分鐘。

## 功能
- 註冊、登入（JWT）
- 待辦事項新增、編輯、完成、刪除
- 分類、截止日期、逾期標示、統計
- 分類篩選與關鍵字搜尋
- 每位使用者只能存取自己的資料
- 登入限流與安全標頭

## 技術
Node.js、Express 5、SQLite、bcryptjs、jsonwebtoken、helmet、express-rate-limit、dotenv

## 本機執行
1. `npm install`
2. 複製 `.env.example` 為 `.env`，填入 `JWT_SECRET`
3. `npm start`
4. 開啟 http://localhost:3000/login.html

產生密鑰：`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 已知限制
- SQLite 資料庫存在本機檔案。Render 免費方案的檔案系統是暫時的，重新部署、重啟或休眠後，資料庫會被重置，所有帳號與待辦事項都會消失。
- 為了讓頁面內的 script 能執行，目前關閉了內容安全政策（CSP）。
- 登出只清除瀏覽器上的 token，已發出的 token 在到期前仍然有效。

## 改進方向
- 改用雲端資料庫，或升級付費方案掛載永久磁碟
- 將頁面的 script 拆成獨立檔案，重新開啟 CSP
- 加入自動化測試