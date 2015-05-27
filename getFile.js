var superagent = require('superagent');
var async = require('async');
var fs = require('fs');

var url = "http://www.docin.com/bookstore.do";
var invoiceid;


var getInvoiceId = function (callback) {
	console.log("in invoiceid");
	superagent.post(url)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('Connection', 'Keep-Alive')
			.set('User-Agent', 'Android')
			.send(postText)
			.end(function (err, res){
				if (err)
				{
					console.error(err);
				}
				else
				{
					var o = JSON.parse(res.text);
					var documents = o.body.documents[0];
					invoiceid = documents.invoiceid;
					var ext = documents.ext;
					/*console.log(documents.document_id);
					console.log(documents.filesize);
					console.log(documents.invoiceid);
					console.log(documents.name);
					console.log(documents.ext);*/
				}
				callback(null, invoiceid, ext);
			});
}


var urlFile = 'http://www.docin.com/app/dbox/getinfo.do';

var getFileAddr = function (arg1, args2, callback) {
	console.log('in fileAddr');
	var postFileText = 'un=-fkKFxPvVLXOUxYkMY91S&'
				 + 'pwd=1t8o4wWbnARtCij8JSgSUv'
				 + '&invoiceid=' + arg1
				 + '&isfolder=false'
				 + '&encrypt=3'
				 + '&from=1'
				 + '&platform=android'
				 + '&version=2.5.9';
	superagent.post(urlFile)
		.set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Connection', 'Keep-Alive')
		.set('User-Agent', 'Android')
		.send(postFileText)
		.end(function (err, res){
			if (err)
			{
				console.error(err);
			}
			else
			{
				var o = JSON.parse(res.text);
				var downLoadPath = o.result.url;
				var documentName = o.result.name;
				console.log("downLoadPath: " + downLoadPath);
				console.log(o);
			}
			callback(null, downLoadPath, documentName, args2);
		});	
}

var downFile = function (args1, args2, args3, callback) {
	var path = process.cwd() + "\\File\\" + args2 + '.' + args3;
	if (args1 == "")
	{
		callback(null);
	}
	fs.exists(path, function(args){
		if (args == true)
		{
			callback(null);
		}
		else
		{
			console.log(args1);
			console.log(path);
			var stream = fs.createWriteStream(path);
			var req = superagent.get(args1)
							.end(function (err, res){
								console.log(res.type);
							});
			req.pipe(stream).on('finish', function(err){
				if (err)
				{
					console.error(err);
				}
				callback(null);
			});
		}
	});
}

var tasks = [getInvoiceId, getFileAddr, downFile];

/*exports.getFile = function (documentId, callback) {
	var documentId = documentId;
	postText = 'value={"body":{"type":"1",' 
							+ '"document_ids":["' + documentId +'"]},' 
							+ '"account":"-fkKFxPvVLXOUxYkMY91S",'
							+ '"pwd":"1t8o4wWbnARtCij8JSgSUv",'
							+ '"type":"collection",'
							+ '"device_info":{"screen":"1080x1800","model":"android"},'
							+ '"version":"6.30","engine_id":"Android_BookStore"}';
	async.waterfall(tasks, function (err) {
		if(err) console.error(err.stack);
		console.log("download ok");
		callback();
	});	
}*/

var getFile = function (documentId) {
	var documentId = documentId;
	postText = 'value={"body":{"type":"1",' 
							+ '"document_ids":["' + documentId +'"]},' 
							+ '"account":"-fkKFxPvVLXOUxYkMY91S",'
							+ '"pwd":"1t8o4wWbnARtCij8JSgSUv",'
							+ '"type":"collection",'
							+ '"device_info":{"screen":"1080x1800","model":"android"},'
							+ '"version":"6.30","engine_id":"Android_BookStore"}';
	async.waterfall(tasks, function (err) {
		if(err) console.error(err.stack);
		console.log("download ok");
	});	
}

getFile(656834523);