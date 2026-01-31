import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "./database.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ======================= LOGIN =======================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ error: "User not found" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || "devsecret",
        { expiresIn: "6h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  });
});

// ======================= PRODUCTS =======================

// ดึงรายการสินค้า
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// เพิ่มสินค้า
app.post("/api/products/add", (req, res) => {
  const { name, type, detail, stock, price } = req.body;

  const sql = `
    INSERT INTO products (name, type, detail, stock, price, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [name, type, detail, stock, price], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "เพิ่มสินค้าเรียบร้อย", id: result.insertId });
  });
});

// ลบสินค้า
app.delete("/api/products/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "ลบสินค้าเรียบร้อย" });
  });
});

// ======================= COMSET =======================

// ดึง comset ทั้งหมด
app.get("/api/comset", (req, res) => {
  db.query("SELECT * FROM comset", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// เพิ่ม comset
app.post("/api/comset/add", (req, res) => {
  const {
    name,
    cpu,
    gpu,
    ram,
    storage,
    price,
    tier,
    performance,
    price_score,
    upgrade_score,
    efficiency,
  } = req.body;

  const sql = `
    INSERT INTO comset
    (name, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      cpu,
      gpu,
      ram,
      storage,
      price,
      tier,
      performance,
      price_score,
      upgrade_score,
      efficiency,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "เพิ่มข้อมูลสำเร็จ!",
        id: result.insertId,
      });
    }
  );
});

// ลบ comset
app.delete("/api/comset/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM comset WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "ลบข้อมูลสำเร็จ!" });
  });
});

// ======================= SAW CALCULATE =======================
app.post("/api/saw/calc", (req, res) => {
  const { weights } = req.body;

  if (!weights)
    return res.status(400).json({ error: "Missing weights for SAW" });

  const sql = "SELECT * FROM comset";

  db.query(sql, (err, coms) => {
    if (err) return res.status(500).json({ error: err });

    const scored = coms.map((c) => {
      const total =
        c.performance * weights.performance +
        c.price_score * weights.price +
        c.upgrade_score * weights.upgrade +
        c.efficiency * weights.efficiency;

      return { ...c, totalScore: total };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);

    res.json({
      message: "SAW success",
      results: scored,
    });
  });
});
// ======================= CHECK COMSET =======================

app.post("/api/check-com", (req, res) => {
  const { cpu, gpu, ram, storage } = req.body;

  const sql = `
    SELECT * FROM comset
    WHERE cpu=? AND gpu=? AND ram=? AND storage=?
    LIMIT 1
  `;

  db.query(sql, [cpu, gpu, ram, storage], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    if (result.length > 0) {
      res.json({
        found: true,
        data: result[0],
      });
    } else {
      res.json({
        found: false,
      });
    }
  });
});


// ======================= SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
