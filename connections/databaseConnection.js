const mysql = require('mysql')
var con  = mysql.createConnection({
    host            : 'localhost',
    user            : 'instafluencer_user01',
    password        : 'X@qR.$0K}zQ~',
    port            : 3306,
    database        : 'instafluencer_db01',
    // user            : 'root',
    // password        : '',
    // port            : 3307,
    // database        : 'laravel',
    // timezone        : 'utc'
})

module.exports.con = con