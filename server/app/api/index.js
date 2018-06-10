var api = {};

var utils = require('../utils');

api.csspixelateImage = function(req, res){
    console.log('Dado recebido via POST:');
    utils.createScssFile(utils.exportScss(utils.pixelToColor(req.body.pixelsArray, req.body.w, req.body.h, req.body.quantity)));
    res.status(200).json("Data has sent successfully!");
};

module.exports = api;