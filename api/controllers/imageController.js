var done        = false;
var express     = require("express");
var multer      = require('multer');
var app         = express.Router();
var models      = require('../models');

app.get('/:offset/:limit', function(req, res) {
    // query the database
    models.image.findAll({
        offset : req.param('offset'),
        limit : req.param('limit'),
        where : {
            reports : {
                lt : 5
            },
        },
        order : 'createdAt DESC',
    })
    .then(function(images) {
        images.push({
            results: Object.keys(images).length,
        });
        var data = JSON.stringify(images);
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
    });
});

app.post('/', function(req,res) {
    var rng         = (Math.random() * 100).toString(),
        now         = Date.now(),
        saveDir     = __dirname + '/../public/',
        serverPath  = '/uploads/'  +  rng.split('.').join('') + req.files.file.name,
        dir = saveDir + serverPath;

    require('fs').rename(
        req.files.file.path,
        dir,
        function(error) {
            if(error) {
                console.log(error);
                res.send('Something went wrong. Check server-log for info.');
                return;
            }
            models.image.create({
                path : serverPath,
                reports: 0,
                createAt : now,
                updateAt : now,
            }).success(function() {
                done = true;
            });
            res.status(200).end();
        }
    );

});

app.put('/report/:id', function(req, res) {
    models.image.find(req.param('id'))
        .then(function (img) {
            if (img) {
                img.updateAttributes({
                    reports : img.dataValues.reports + 1,
                    uploaded: Date.now(),
                }).success(function() {
                    res.end('Reported ' + req.param('id') + '!');
                }).fail(function () {
                     res.status(500).end();
                });
            } else {
                res.status(404).end();
            }
        });
});

module.exports = app;
