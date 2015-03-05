//Importar modulos
var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path');


//Iniciar Express
var app = express();


//Config. Varias
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res, next){
	console.log(req.method)
 	res.send('hello world');
 	next();
});

//Download
app.get('/:file(*)', function(req, res, next){
  var file = req.params.file,
  	  FilePath = path.join(__dirname, 'uploads', file);

  res.download(FilePath);
});

module.exports = app;