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

const SECRET = process.env.JWT_SECRET || "devsecret";


// ======================= JWT MIDDLEWARE =======================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
};


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
      if (err)
        return res.status(500).json({ error: "Hash compare error" });

      if (!match)
        return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "6h" }
      );

      res.json({
        message: "Login successful",
        token,
        user,
      });
    });
  });
});


// ======================= PRODUCTS =======================
app.get("/api/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/products/add", verifyToken, (req, res) => {
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

app.delete("/api/products/delete/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "ลบสินค้าเรียบร้อย" });
  });
});


// ======================= COMSET =======================
app.get("/api/comset", verifyToken, (req, res) => {
  db.query("SELECT * FROM comset", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/comset/add", verifyToken, (req, res) => {
  const {
    name, cpu, gpu, ram, storage, price,
    tier, performance, price_score, upgrade_score, efficiency
  } = req.body;

  const sql = `
    INSERT INTO comset
    (name, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [name, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "เพิ่มข้อมูลสำเร็จ!",
        id: result.insertId,
      });
    }
  );
});

app.delete("/api/comset/delete/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM comset WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "ลบข้อมูลสำเร็จ!" });
  });
});


// ======================= SAW (FIXED + PROTECTED) =======================
app.post("/api/saw/filter", verifyToken, (req, res) => {
  const { weights } = req.body;

  if (!weights) {
    return res.status(400).json({ error: "Missing weights" });
  }

  db.query("SELECT * FROM comset", (err, coms) => {
    if (err) return res.status(500).json({ error: err });

    const scored = coms.map((c) => {
      const totalScore =
        c.performance * weights.performance +
        c.price_score * weights.price +
        c.upgrade_score * weights.upgrade +
        c.efficiency * weights.efficiency;

      return { ...c, totalScore };
    });

    scored.sort((a, b) => b.totalScore - a.totalScore);

    res.json({ results: scored });
  });
});


// ======================= SERVER =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});