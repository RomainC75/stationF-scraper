const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'stationf',
    password:process.env.DB_PASS,
    port: 3306
})

module.exports = pool.promise()