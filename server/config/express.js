var express = require('express')
    ,app = express()
    ,routes = require('../app/routes')
    ,path =  require('path')
    ,bodyParser = require('body-parser')
    ,cors = require('cors'),
    compileSass = require('express-compile-sass');

app.use(cors());

app.use(compileSass({
    root: path.join(__dirname, '/../../server', 'public'),
    sourceMap: false, 
    sourceComments: false, 
    watchFiles: false, 
    logToConsole: true
}));

app.use(compileSass({
    root: path.join(__dirname, '/../../server/public', 'uploads'),
    sourceMap: false, 
    sourceComments: false, 
    watchFiles: false, 
    logToConsole: true
}));

    
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/../../client', 'build', 'index.html')); 
});
    
app.use(express.static(path.join(__dirname, '/../../client', 'build'))); 
app.use(express.static(path.join(__dirname, '/../../server', 'public'))); 
app.use(express.static(path.join(__dirname, '/../../server/public', 'uploads'))); 

app.use(express.json({limit: '5000000mb'}));
app.use(express.urlencoded({extended: true, limit: '5000000mb'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

routes(app);

module.exports = app;