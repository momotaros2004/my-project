import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // ชื่อผู้ใช้เริ่มต้นของ XAMPP คือ root
  password: "",     // ถ้ายังไม่ตั้งรหัสผ่าน ให้เว้นว่างไว้
  database: "my_app_db" // ชื่อ database ที่คุณจะใช้ (สร้างใน phpMyAdmin ก็ได้)
});

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL!");
  }
});

export default db;
