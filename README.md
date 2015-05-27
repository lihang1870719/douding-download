# 豆丁书房文档下载至PC端

最近因为要写一些小论文，有时需要在豆丁网下载文档，但是豆丁上的文档大部分是要钱的，有三种途径，一种是充VIP，但是VIP也是下载的次数也是有限的；另一种是直接充钱（此处土豪直接略过）；最后一种是豆丁出的神器--豆丁书房APP（此处是不是有打广告的嫌疑，囧），但是这种方法是有局限的，只能在手机端去查看，有点麻烦，于是就有了这一片blog的由来，我用nodejs写了一个小脚本，直接下载文档到PC端，下面就是详细的过程。

## 使用步骤
1. 由于本插件是基于nodejs的，所以需要配置nodejs的环境
2. 访问[我的github](https://github.com/lihang1870719/douding-download) clone到本地
3. 执行npm install
4. 执行node getFile 文档就会自动下载到当前目录

## 详解
### Step 1. 获取文档对应ID号
进入豆丁网，找到大家需要下载的文档，例如《42套最成功个人简历模板大集合 求职简历 英文简历》

![snapshot](https://github.com/lihang1870719/douding-download/blob/master/snapshot.png?raw=true)

大家可以看到这篇文档时需要充值才可以下载的。注意图片最上面的地址栏：www.douin.com/p-531956905.html。其中“531956905”就是代表这篇文档的ID号。那么读者可能会问，这个ID有什么用，OK，下面进入正题。

### Step 2. 根据ID号获得文档
上代码：
``` javascript
var superagent = require('superagent');
var async = require('async');
var fs = require('fs');
```
可以看到插件主要使用了3个模块：

- superagent：用来模拟http请求
- async：用来对代码进行控制，避免陷入callback-callback-callback
- fs：文件操作

插件中主要有4个函数

- getFile
- getInvoiceId
- getFileAddr
- downFile

---
getFile函数:
```
var tasks = [getInvoiceId, getFileAddr, downFile];
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
getFile(531956905);
```
getFile函数是程序的入口，大家只需要将自己要下载的文档ID换掉就可以欢乐的下载了

---
getInvoiceId函数
```
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
				}
				callback(null, invoiceid, ext);
			});
}
```
这里需要InvoiceID，是因为在下一步获取下载地址是需要的，推荐大家使用wireshark来抓包分析

---
getFileAddr
```
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
```
这里利用获得的invoiceId获得文件下载的地址和下载文件名

---
downFile函数
```
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
```
OK，最后一步，下载到本地就可以啦






