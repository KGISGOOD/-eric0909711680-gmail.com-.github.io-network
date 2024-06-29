ada//導入 express、mysql2 和 path 模組，創建一個 Express 應用並設定伺服器運行的端口為 3000
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
adasdfrsfsfsdf
const app = express();
const port = 4000;
//apple
// 創建資料庫連接池
const pool = mysql.createPool({




  
  host: 'localhost',
  user: 'root',
  password: '0909711680',
  database: 'mc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 中間件配置
//配置了中間件來解析 URL 編碼和 JSON 請求，並設置靜態文件服務的目錄為 public
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 處理 JSON 請求
app.use(express.static(path.join(__dirname, 'public')));

// 根路由請求，獲取 麥當勞點餐系統.html
//當用戶訪問根路徑 / 時，伺服器會返回 麥當勞點餐系統.html 文件。
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/麥當勞點餐系統.html');
});

//定義一個 /restaurants 路由，從資料庫中獲取 Restaurants 表的數據，並返回 JSON 格式的響應
//500 錯誤碼是一種通用的伺服器錯誤
app.get('/restaurants', (req, res) => {
  pool.query('SELECT * FROM Restaurants', (error, results) => {
    if (error) {
      console.error('獲取數據時發生錯誤:', error);
      res.status(500).json({ error: '獲取數據時發生錯誤' });
      return;
    }
    res.json(results);
  });
});

// 處理登入請求
//定義一個 /login 路由，驗證用戶提供的姓名、電話和密碼是否匹配註冊表中的記錄。若匹配，返回成功響應，否則返回錯誤訊息
app.post('/login', (req, res) => {
  const { name, phone, password } = req.body;
  pool.query('SELECT * FROM 註冊 WHERE 姓名 = ? AND 電話 = ? AND 密碼 = ?', [name, phone, password], (error, results) => {
    if (error) {
      console.error('查詢用戶時出錯:', error);
      res.status(500).json({ success: false, message: '查詢用戶時出錯' });
    } else if (results.length > 0) {
      res.json({ success: true, name: results[0].姓名 });
    } else {
      res.json({ success: false, message: '用戶名或密碼錯誤' });
    }
  });
});

// 處理註冊請求
app.post('/register', (req, res) => {
  const { name, phone, password } = req.body;

  pool.query(
    'INSERT INTO 註冊 (姓名, 電話, 密碼) VALUES (?, ?, ?)',
    [name, phone, password],
    (error) => {
      if (error) {
        console.error('寫入數據時出錯:', error);
        res.status(500).send('寫入數據時出錯');
      } else {
        console.log('數據已成功寫入MySQL資料庫');
        res.send('註冊成功');
      }
    }
  );
});

// 提交訂單的路由
app.post('/submit-order', (req, res) => {
  const { orders, phone } = req.body; // 從請求體中提取訂單和電話號碼
  if (!orders) {
    return res.status(400).send('Orders are required');
  }
  if (!phone) {
    return res.status(400).send('Phone number is required');
  }

  // 解析訂單數據並準備插入資料庫
  let orderData = JSON.parse(orders);
  let quantities = {
    大漢堡: 0,
    中漢堡: 0,
    小漢堡: 0,
    可口可樂: 0
  };

  orderData.forEach(order => {
    if (quantities.hasOwnProperty(order.item)) {
      quantities[order.item] = order.quantity;
    }
  });

  const { 大漢堡, 中漢堡, 小漢堡, 可口可樂 } = quantities;

  // 將訂單數據和電話號碼插入點餐表
  pool.query(
    'INSERT INTO 點餐 (大漢堡數量, 中漢堡數量, 小漢堡數量, 可口可樂數量, 電話) VALUES (?, ?, ?, ?, ?)', 
    [大漢堡, 中漢堡, 小漢堡, 可口可樂, phone], 
    (err) => {
      if (err) {
        console.error('提交訂單時出錯:', err);
        res.status(500).send('提交訂單時出錯');
      } else {
        console.log('數據已成功寫入MySQL資料庫');
        res.send('訂單已成功提交');
      }
    }
  );
});

// 處理評價提交請求
app.post('/submit-rating', (req, res) => {
  const { rating, comment, phone } = req.body; // 從請求體中提取評價、留言和電話號碼
  pool.query(
    'INSERT INTO 評論 (星級評價, 留言, 電話) VALUES (?, ?, ?)', 
    [rating, comment, phone], 
    (err) => {
      if (err) {
        console.error('提交評價時出錯:', err);
        res.status(500).send('提交評價時出錯');
      } else {
        res.send('評價已成功提交');
      }
    }
  );
});

// 啟動伺服器並在指定端口監聽，顯示伺服器運行的訊息
const server = app.listen(port, () => {
  console.log(`伺服器正在運行，訪問地址：http://localhost:${port}`);
});

// 處理伺服器關閉
//監聽 SIGINT 信號，在伺服器關閉時釋放 MySQL 連接池並進行清理工作
process.on('SIGINT', () => {
  console.log('正在關閉伺服器並釋放MySQL連接池');
  server.close(() => {
    pool.end((err) => {
      if (err) {
        console.error('關閉MySQL連接池時發生錯誤:', err.message);
      } else {
        console.log('MySQL連接池已關閉');
      }
      process.exit(err ? 1 : 0);
    });
  });
});
