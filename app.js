//Importar modulos
var multer = require('multer'),
	app = require('./base_serv');

//Multer Config
app.use(multer({
	dest: './uploads/',
	limits: {
		files: 1,
		fileSize: 100000000
	},
	onFileUploadStart: function (file, req, res) {
		if (file.fieldname !== 'file') {
			res.send('error');
			return false;
		} else {

		};
	},
	onFileUploadComplete: function (file) {
		/*console.log(
		  	'Field Name: ' + file.fieldname + 
		  	'\nOriginal Name: ' + file.originalname + 
		  	'\nName: ' + file.name + 
		  	'\nEncoding: ' + file.encoding + 
		  	'\nMime Type: ' + file.mimetype + 
		  	'\nPath: ' + file.path + 
		  	'\nExtension: ' + file.extension)*/
}}));


//Upload Route
app.post('/api/upload', function(req, res, next) {
	//console.log(req.body) // form fields
    console.log(req.files.file);
    res.status(204).end();
    //console.log(querystring.stringify(req.files[0]))
    //console.log(querystring.stringify(req.files.file))
});


//Arancar Server
app.listen(80);