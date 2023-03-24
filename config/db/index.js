const mysql = require('mysql');
const db = mysql.createConnection({
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE || 'cinema_management',
    port: process.env.DATABASE_PORT || 3306
});

module.exports = db;