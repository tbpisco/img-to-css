var api = {};

var utils = require('../utils'),
path =  require('path'),
uuidv1 = require('uuid/v1'),
fs = require('fs');


api.csspixelateImage = function(req, res){
    console.log('Dado recebido via POST:');
    let hash = uuidv1();
    utils.createScssFile(utils.exportScss(utils.pixelToColor(req.body.pixelsArray, req.body.w, req.body.h, req.body.quantity)), hash);
    res.status(200).json({data: hash});

    
};

api.getSassCode = function(req, res){

    if(req.params.id == "mario"){

        fs.readFile(path.join(__dirname, '/../../../server/public', 'mario-pixel.scss'), 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            res.status(200).json(data);
        });

    } else {

        fs.readFile(path.join(__dirname, '/../../../server/public/uploads', req.params.id + '.scss'), 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            res.status(200).json(data);
        });
    }
}

module.exports = api;