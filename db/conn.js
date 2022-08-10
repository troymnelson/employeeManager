const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    database: 'employee_dir',
    user: 'root',
});

module.exports = connection;