const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ======================
// SAFE DATABASE CONNECT
// ======================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(function(err) {
  if (err) {
    console.log("DB connection failed (non-fatal):", err.message);
  } else {
    console.log("DB connected successfully");
  }
});

// ======================
// HEALTH CHECK ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("CRM API is running");
});

// ======================
// INSERT LEAD ENDPOINT
// ======================
app.post("/insert-lead", (req, res) => {

  const d = req.body;

  console.log("Incoming payload:", d);

  const sql = `
    INSERT INTO leads 
    (created_at, lead_id, customer_name, customer_phone_no, lead_source, product_interest, budget, quantity, location, assigned_rep, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    d.created_at,
    d.lead_id,
    d.customer_name,
    d.customer_phone_no,
    d.lead_source,
    d.product_interest,
    d.budget,
    d.quantity,
    d.location,
    d.assigned_rep,
    d.status
  ];

  db.query(sql, values, (err, result) => {

    if (err) {
      console.log("MYSQL ERROR:", err.message);
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    return res.json({
      status: "success",
      inserted_id: result.insertId
    });

  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
