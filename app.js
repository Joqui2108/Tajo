var fs = require('fs'),
	express = require('express'),
	multer = require('multer'),
	mime = require('mime-types'),
	app = express();

var conf = {
	records: "fileRecords.json",
	destination: "uploads/",
	dates: {
		m: 60000,
		h: 3600000,
		d: 86400000
	}
};

fs.readFile(conf.records, function(err, data) {
	if (!err) {
		fileRecords = JSON.parse(data.toString());
	} else {
		fileRecords = {};
	}
});

var upload = multer({
	dest: conf.destination,
	limits: {
		fields: 0,
		files: 1,
		fileSize: 100000000
	}
});

function deleteFiles () {
	if (fileRecords[code]) {
		fs.unlinkSync(fileRecords[code].path);
		delete fileRecords[code];
		fs.writeFileSync(conf.records, JSON.stringify(fileRecords));
	};
}

app.post('/', upload.single('file'), function (req, res) {
	var expires = /^((?:[^0|^\\D][1-9]|[0-9]*))(m|h|d)$/.exec(req.query.expires),
		maxMilli = Date.now()+1209660000,
		exp=Date.now()+(expires[1]*conf.dates[expires[2]]);

	var code = req.file.filename.substr(-6, 6);
	fileRecords[code] = {
		originalname: req.file.originalname,
		extension: req.file.extension,
		path: req.file.path
	};

	fs.writeFileSync(conf.records, JSON.stringify(fileRecords));

	if (exp<maxMilli) {
		setTimeout(deleteFiles(), exp, code);
	} else{
		exp=maxMilli;
		setTimeout(deleteFiles(), exp, code);
	};

	res.status(200).json({key: code, expiry: new Date(exp).toUTCString()});
});

app.get('/:code(\\w{6}|\\d{6})', function (req, res) {

	var code = req.query.code;

	if (fileRecords[code]) {

		res.set('Content-Type', mime.lookup(fileRecords[code].originalname)).download(fileRecords[code].path, fileRecords[code].originalname, function (err) {
			
			if (err) {
				throw err;
			} else {

				res.on('finish', function () {
					fs.unlinkSync(fileRecords[code].path);
					delete fileRecords[code];
					fs.writeFileSync("./fileRecords.json", JSON.stringify(fileRecords));
				});

			};
		});
	} else {
		res.status(404).json({error: 404, message: 'Not found'});
	};
});

app.listen(80);