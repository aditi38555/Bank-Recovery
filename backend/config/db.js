const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });


// const db = mysql.createConnection(process.env.DATABASE_URL);
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

module.exports = db;