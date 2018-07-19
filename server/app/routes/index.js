var api = require('../api');

module.exports  = function(app) { 

    app.route('/image')
        .post(api.csspixelateImage); 

    app.route('/sass')
        .get(api.getSassCode); 

    app.route('/sass/:id')
        .get(api.getSassCode); 

};