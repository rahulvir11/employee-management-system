const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port:"3306",
  user: 'root',
  password: 'root@123',
  database: 'assiginment_dealsdray'
});

// Establish connection
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected');
});
module.exports = db;
