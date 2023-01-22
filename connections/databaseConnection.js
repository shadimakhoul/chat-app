const mysql = require('mysql')
var con  = mysql.createConnection({
    host            : 'localhost',
    user            : 'root',
    password        : '',
    port            : 3307,
    database        : 'laravel',
    timezone        : 'utc'
})

module.exports.con = con