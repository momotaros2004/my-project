import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "./database.js";
import {
  GAME_REQUIREMENTS,
  meetsRequirements,
  requirementsForGameIds,
} from "./specRequirements.js";

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

const verifyAdmin = (req, res, next) => {
  db.query("SELECT role FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Could not verify admin access" });
    if (results.length === 0 || results[0].role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

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
        { id: user.id, username: user.username, role: user.role || "user" },
        SECRET,
        { expiresIn: "6h" }
      );

      const publicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      };

      res.json({
        message: "Login successful",
        token,
        user: publicUser,
      });
    });
  });
});


// ======================= PRODUCTS =======================
app.get("/api/products", verifyToken, verifyAdmin, (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/products/add", verifyToken, verifyAdmin, (req, res) => {
  const { name, type, detail, stock, price } = req.body;
  const numericStock = Number(stock);
  const numericPrice = Number(price);

  if (!String(name || "").trim() || !type || !Number.isInteger(numericStock) || numericStock < 0 || !Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: "Enter a name, type, non-negative stock, and valid price." });
  }

  const sql = `
    INSERT INTO products (name, type, detail, stock, price, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [name.trim(), type, detail || "", numericStock, numericPrice], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "เพิ่มสินค้าเรียบร้อย", id: result.insertId });
  });
});

app.delete("/api/products/delete/:id", verifyToken, verifyAdmin, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "ลบสินค้าเรียบร้อย" });
  });
});


// ======================= COMSET =======================
app.get("/api/comset", verifyToken, verifyAdmin, (req, res) => {
  db.query("SELECT * FROM comset", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/comset/add", verifyToken, verifyAdmin, (req, res) => {
  const {
    name, cpu, gpu, ram, storage, price, tier,
    performance, price_score, upgrade_score, efficiency,
  } = req.body;

  const numericPrice = Number(price);
  const scores = [performance, price_score, upgrade_score, efficiency].map(Number);
  const requiredValues = [name, cpu, gpu, ram, storage, tier];
  if (requiredValues.some((value) => !String(value || "").trim()) ||
      !Number.isFinite(numericPrice) || numericPrice < 0 ||
      scores.some((score) => !Number.isFinite(score) || score < 0 || score > 100)) {
    return res.status(400).json({ error: "Complete all fields and enter valid scores from 0 to 100." });
  }

  const sql = `
    INSERT INTO comset
    (name, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [name.trim(), cpu.trim(), gpu.trim(), ram.trim(), storage.trim(), numericPrice, tier.trim(), ...scores],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "เพิ่มข้อมูลสำเร็จ!",
        id: result.insertId,
      });
    }
  );
});

app.put("/api/comset/update/:id", verifyToken, verifyAdmin, (req, res) => {
  const { name, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency } = req.body || {};
  const textValues = [name, cpu, gpu, ram, storage, tier].map((value) => String(value || "").trim());
  const numericPrice = Number(price);
  const rawScores = [performance, price_score, upgrade_score, efficiency];
  const scores = rawScores.map(Number);

  if (textValues.some((value) => !value) || price === undefined || price === null || String(price).trim() === "" ||
      rawScores.some((score) => score === undefined || score === null || String(score).trim() === "") ||
      !Number.isFinite(numericPrice) || numericPrice < 0 ||
      scores.some((score) => !Number.isFinite(score) || score < 0 || score > 100)) {
    return res.status(400).json({ error: "Complete all fields and enter valid scores from 0 to 100." });
  }

  const sql = `
    UPDATE comset
    SET name = ?, cpu = ?, gpu = ?, ram = ?, storage = ?, price = ?, tier = ?,
        performance = ?, price_score = ?, upgrade_score = ?, efficiency = ?
    WHERE id = ?
  `;
  const values = [...textValues, numericPrice, ...scores, req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Could not update PC build." });
    if (result.affectedRows > 0) return res.json({ message: "PC build updated successfully." });

    db.query("SELECT id FROM comset WHERE id = ?", [req.params.id], (lookupError, rows) => {
      if (lookupError) return res.status(500).json({ error: "Could not verify PC build." });
      if (rows.length === 0) return res.status(404).json({ error: "PC build not found." });
      return res.json({ message: "PC build is unchanged." });
    });
  });
});

app.delete("/api/comset/delete/:id", verifyToken, verifyAdmin, (req, res) => {
  db.query("DELETE FROM comset WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "ลบข้อมูลสำเร็จ!" });
  });
});


// ======================= MANUAL PC MATCH =======================
app.post("/api/check-com", verifyToken, (req, res) => {
  const { cpu, gpu, ram, storage } = req.body;

  if (!cpu || !gpu || !ram || !storage) {
    return res.status(400).json({ error: "Missing PC component selection" });
  }

  const sql = `
    SELECT * FROM comset
    WHERE cpu = ? AND gpu = ? AND ram = ? AND storage = ?
    ORDER BY price ASC
    LIMIT 1
  `;

  db.query(sql, [cpu, gpu, ram, storage], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.json({ found: false });

    return res.json({ found: true, data: results[0] });
  });
});

// ======================= SAW (FIXED + PROTECTED) =======================
app.post("/api/saw/filter", verifyToken, (req, res) => {
  const rawWeights = req.body?.weights;
  const rawGameIds = req.body?.gameIds;

  if (!rawWeights) {
    return res.status(400).json({ error: "Missing weights" });
  }

  const weights = {
    performance: Number(rawWeights.performance),
    price_score: Number(rawWeights.price_score ?? rawWeights.price),
    upgrade_score: Number(rawWeights.upgrade_score ?? rawWeights.upgrade),
    efficiency: Number(rawWeights.efficiency),
  };
  const weightValues = Object.values(weights);
  const weightTotal = weightValues.reduce((sum, value) => sum + value, 0);
  if (weightValues.some((value) => !Number.isFinite(value) || value < 0)
    || Math.abs(weightTotal - 1) > 0.001) {
    return res.status(400).json({ error: "Weights must be non-negative and add up to 1" });
  }

  if (!Array.isArray(rawGameIds) || rawGameIds.length === 0) {
    return res.status(400).json({ error: "Select at least one program" });
  }

  const gameIds = [...new Set(rawGameIds.map(Number))];
  if (gameIds.some((id) => !Number.isInteger(id) || !GAME_REQUIREMENTS[id])) {
    return res.status(400).json({ error: "One or more selected programs are invalid" });
  }

  const requirements = requirementsForGameIds(gameIds);
  const selectedPrograms = gameIds.map((id) => ({ id, title: GAME_REQUIREMENTS[id].title }));

  db.query("SELECT * FROM comset", (err, coms) => {
    if (err) return res.status(500).json({ error: "Could not load PC builds" });

    const eligible = coms.filter((build) => meetsRequirements(build, requirements));
    const results = eligible.map((build) => {
      const totalScore =
        Number(build.performance) * weights.performance +
        Number(build.price_score) * weights.price_score +
        Number(build.upgrade_score) * weights.upgrade_score +
        Number(build.efficiency) * weights.efficiency;

      return { ...build, totalScore };
    });

    results.sort((a, b) => b.totalScore - a.totalScore || Number(a.price) - Number(b.price));

    return res.json({
      results,
      weights,
      requirements,
      selectedPrograms,
      filterStats: { totalBuilds: coms.length, eligibleBuilds: results.length },
    });
  });
});


// ======================= SERVER =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
