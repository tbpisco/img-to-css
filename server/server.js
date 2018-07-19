var http = require('http')
    ,app = require('./config/express'),
    utils = require('./app/utils'),
    root = process.cwd();

http.createServer(app).listen((process.env.PORT || 3000), function() {
    console.log('Server running on port: ' + this.address().port);
   // setInterval(() => { utils.cleanFolder('uploads', 60);}, 60 * 1000);
});
