const mysql = require('mysql');

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bitshackdatabase',
    port:7000,
});

module.exports = con;