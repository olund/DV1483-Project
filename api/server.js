var express = require('express'),
    app     = express(),
    mysql   = require('mysql');
    dbCon = mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : ''
    });

app.listen(3000);
console.log('Rest Demo Listening on port 3000');
