var done        =    false;
var express     =    require("express");
var multer      =    require('multer');
var app         =    express.Router();
var models      =    require('../models');

app.get('/:offset/:limit', function(req, res) {
    console.log("offset: " +  req.param('offset'), "limit: " + req.param('limit'));
    models.image.findAll(
        {
            offset : req.param('offset'),
            limit : req.param('limit'),
            where : {
                reports : {
                    lt : 5
                },
            },
            order : 'id DESC',
        })
    .then(function(images) {
        images.push({
                results: Object.keys(images).length - 1,
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(images));
    });
});

app.post('/', function(req,res) {
    var rng         = (Math.random() * 100).toString(),
        serverPath  = '/uploads/'  +  rng.split('.').join('') + req.files.file.name,
        saveDir     =  __dirname + '/../public/',
        dir = saveDir + serverPath;

    require('fs').rename(
        req.files.file.path,
        dir,
        function(error) {
            if(error) {
                console.log(error);
                res.send('something went wrong');
                return;
            }
            models.image.create({
                path : serverPath,
                reports: 0,
                createAt : Date.now(),
                updateAt : Date.now(),
            }).success(function() {
                done = true;
            });
            res.send(200);
        }
    );

});

app.put('/report/:id', function(req, res) {
    var _id = req.param('id');
    console.log('put on : ' + _id);
    models.image.find(_id)
        .then(function (img) {
            console.log(img.dataValues.reports  );
            if (img) {
                img.updateAttributes({
                    reports : img.dataValues.reports + 1,
                    uploaded: Date.now(),
                }).success(function() {
                    res.end('Reported ' + _id + '!');
                }).fail(function () {
                     res.send(500);
                });
            } else {
                res.send(404);
            }
        });
});

module.exports = app;
