var express = require('express')
    ,app = express()
    ,routes = require('../app/routes')
    ,path =  require('path')
    ,bodyParser = require('body-parser')
    ,cors = require('cors'),
    compileSass = require('express-compile-sass'),
    root = process.cwd();

app.use(cors());

app.use(express.json({limit: '5000000mb'}));
app.use(express.urlencoded({extended: true, limit: '5000000mb'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(compileSass({
    root: root,
    sourceMap: false, 
    sourceComments: false, 
    watchFiles: false, 
    logToConsole: true
}));

app.use(express.static(root));

routes(app);

module.exports = app;