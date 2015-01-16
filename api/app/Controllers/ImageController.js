var express = require('express');
var app = express.Router();

app.get('/:offset/:from', function(req, res) {
    // TODO get stuff from db
    var offset  = req.params.offset,
        from    = req.params.from;
    console.log(offset);
    console.log(from);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        '1' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'username',
            time: 'time ago'
        },
        '2' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'use23rname',
            time: 'time ago'
        },
        '3' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'utre',
            time: 'time ago'
        },
        '4' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'username',
            time: 'time ago'
        },
        '5' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'use23rname',
            time: 'time ago'
        },
        '6' : {
            img: 'http://photos-d.ak.instagram.com/hphotos-ak-xpa1/t51.2885-15/10623926_313491828861835_1654496837_n.jpg',
            username: 'utre',
            time: 'time ago'
        }
    }, null, 3));
});

/* POST for app */
app.post('/', function(req, res) {

    var serverPath  = '/images/' + req.files.userPhoto.name,
        saveDir     =  __dirname + '/../../public/';

    require('fs').rename(
    req.files.userPhoto.path,
    saveDir + serverPath,
    function(error) {
        if(error) {
            console.log(error);
            res.send({
                error: 'Ah crap! Something bad happened'
            });
            return;
        }

        res.send({
            path: serverPath
        });
    }
    );
});


/* DELETE for deleteing */
app.delete('/', function(req, res) {
    res.send('delete sent')
});

module.exports = app;
