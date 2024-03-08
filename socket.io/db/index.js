const mysql = require("mysql");
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  port: "3306",
  database: "my_db_01",
});
module.exports = db;


