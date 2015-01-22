
var express         = require('express')
var app             = express()
var path            = require('path')
var bodyParser      = require('body-parser');
var multer          = require('multer');

process.env.TMPDIR = path.join(__dirname, 'tmp');
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Main apiController
var image = require('./controllers/imageController')
app.use('/api', image);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.send(err.message);
});

module.exports = app;
