const mysql = require("mysql2");
require("dotenv").config();
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
// const db = mysql.createConnection(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL missing");
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL); 
const db = mysql.createConnection({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
  port: url.port,
});


db.connect((err) => {
  if (err) {
    console.log("DB Error ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});



db.query(`
  CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    invoiceNo VARCHAR(50),
    email VARCHAR(100),
    contact VARCHAR(20),
    branch VARCHAR(100),
    bank VARCHAR(100),
    gstin VARCHAR(50),
    amount DECIMAL(10,2),
    cgst DECIMAL(10,2),
    sgst DECIMAL(10,2),
    total DECIMAL(10,2)
  )
`, (err) => {
  if (err) {
    console.log("Table Error ❌", err);
  } else {
    console.log("Table Created ✅");
  }
});

module.exports = db;


