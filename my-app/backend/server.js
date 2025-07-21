const express = require('express');
// const mysql = require('mysql2/promise');  // คอมเมนต์ไว้ก่อน
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ตัวอย่าง users เก็บในหน่วยความจำ (รหัสผ่าน hashed ด้วย bcrypt)
const users = [
  // password: "password123"
  { id: 1, username: 'user1', password: '$2b$10$KvZpzOXYj0Zae3lrM14W6eF0j9jjZv4xPmc/tU8jwWb7XKN8nlr7e' },
  // password: "hello123"
  { id: 2, username: 'user2', password: '$2b$10$9pFvlOzo2zqLtJXIo0QZLOaF/cZ3lG7kxBWykFTFU2ucg7o1JoQkC' }
];

/* --- ตัวอย่างโค้ดฐานข้อมูล (comment ไว้ก่อน) ---
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'users_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
*/

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: 'Incorrect password' });

  return res.json({ message: 'Login successful', userId: user.id, username: user.username });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
