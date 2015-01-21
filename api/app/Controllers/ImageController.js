
var express     =    require("express");
var multer      =    require('multer');
var done        =    false;
var app     = express.Router();

app.use(multer({ dest: './public/uploads',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }
}));


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

app.post('/',function(req,res){
    console.log(Date.now);
    if (done == true) {
        res.end("File uploaded.");
    }
});

module.exports = app;
