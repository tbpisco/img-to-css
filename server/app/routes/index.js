var api = require('../api');

module.exports  = function(app) { 

    app.route('/image')
        .post(api.csspixelateImage); 

};