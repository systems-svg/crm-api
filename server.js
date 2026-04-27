const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("CRM API is running");
});

// MYSQL CONNECTION
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
});

// INSERT LEAD
app.post("/insert-lead", (req, res) => {
  const d = req.body;

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

  db.query(sql, values, (err) => {
    if (err) {
  console.log("MYSQL ERROR:", err);
  return res.status(500).send(err.sqlMessage || err.message);
}
    res.send("Lead inserted");
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

app.post("/insert-lead", (req, res) => {

  console.log("RAW BODY:", req.body);

  const d = req.body;
