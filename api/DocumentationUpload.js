/**
 * Created by airswoop1 on 6/24/14.
 */

var config = require('../config.js'),
    MongoClient = require('../database.js'),
    AWS = require('aws-sdk'),
    s3 = require('s3policy'),
    path = require('path'),
    fs = require('fs');

var DocumentationUpload = (function(){

    var ResponseCodes = {
        "success" : {
            "code": "201",
            "message" : "successfully uploaded document to server"
        },
        "bad_request": {
            "code": "400",
            "message": "request missing required parameters"
        },
        "unable_to_upload" : {
            "code": "403",
            "message": "unable to upload document to server"
        },
        "db_failure" : {
            "code": "500",
            "message":"db write error"
        }

    };


    var DocumentTypes = {
        'IDENTITY':'identity',
        'RESIDENCE':'residence',
        'HOUSEHOLD_COMPOSITION':'household_composition',
        'AGE':'age',
        'SSN':'ssn',
        'CITIZENSHIP':'citizenship',
        'ALIEN_STATUS':'alien_status',
        'EARNED_INCOME':'earned_income',
        'UNEARNED_INCOME':'unearned_income',
        'RESOURCES' : 'resources'
    };

    var Request  = function() {
        this.file = {};
        this.user_id = undefined;
        this.document_type = undefined;
    };

    var  Response = function() {
        this.code = undefined;
        this.message = undefined;
    };

    var execute = function(req, res){

        console.log("executing documentation upload");

        var request = new Request();
        request.user_id = req.body.user_id;
        request.document_type = req.body.document_type;
        request.file.name = req.body.file_name;
        request.file.type = req.body.file_type;
        request.platform = req.body.platform;

        var file = req.files.file;

        console.log(request);

        if(request.user_id && request.document_type && request.file.name && request.file.type) {
            var my_path = path.join(__dirname, '../uploaded/', (request.user_id + request.document_type + "." + request.file.name.split('.').pop())),
                tmpPath = (typeof file === 'undefined') ? '' : file.path ;



            if(request.platform === 'ios'){
                processiOSDocumentUpload( my_path, tmpPath, request, function(error, result) {
                    if(error){
	                    console.log("error uploading document");
	                    console.log(error);
	                    res.send(400);
                    }
	                else {
	                    console.log(result)
	                    res.send(200);
                    }

                });
            }
            else {

                var file_type_regex = "data:" + request.file.type +  ";base64,",
                    base64Data = req.body.file_base64.replace(file_type_regex, "");

                processOtherDocumentUpload( my_path, base64Data, request, function(error, result) {
                    if(error){
	                    console.log("error uploading document");
	                    console.log(error);
                    }else{
	                    console.log(result)
	                    res.send(200);
	                    //delete temp file
                    }


                });
            }
        }
        else {
            var response = new Response();
            response = ResponseCodes['bad_request'];
            res.send(400, response);
        }
    };


    function processiOSDocumentUpload(path, tmpPath, request, callback) {

        fs.readFile(tmpPath, function (err, data) {

            fs.writeFile(path, data, function (err) {
                if(err) {
                    callback(err,null);
                }
                else {

                    updateDBForFile(request, function(db_file_err){
                        if(db_file_err){
                            callback(db_file_err,null);
                        }
                        else{
                            var file_ext = request.file.name.split('.').pop(),
                                proper_file_name= request.user_id + "_" + request.document_type + "." +file_ext;

                            storeFileOnAWS(path, proper_file_name, function(aws_err, result){
                                if(aws_err){
                                    callback(aws_err,null);
                                }
                                else {
	                                removeFile(path, function(file_err) {
		                                if(file_err){
			                                callback(file_err, null)
		                                }
		                                else {
			                                callback(null, result);
		                                }

	                                })

                                }

                            });
                        }
                    });
                }
            })
        })

    };

    function processOtherDocumentUpload( path, base64Data, request,  callback) {

        fs.writeFile(path, new Buffer(base64Data, 'base64'), function (err) {
            if(err) {
                callback(err,null);
            }
            else {
                updateDBForFile(request, function(db_file_err){
                    if(db_file_err){
                        callback(db_file_err, null);
                    }
                    else{

                        var file_ext = request.file.name.split('.').pop(),
                            proper_file_name= request.user_id + "_" + request.document_type + "." + file_ext;

                        storeFileOnAWS(path, proper_file_name, function(aws_err, result){
                            if(aws_err){
                                callback(aws_err, null);
                            }
                            else {
	                            removeFile(path, function(file_err) {
		                            if(file_err){
			                            callback(file_err, null)
		                            }
		                            else {
			                            callback(null, result);
		                            }
	                            })
                            }
                        });
                    }
                });
            }
        })
    }


    function updateDBForFile(request, cb) {

        MongoClient.getConnection(function(db_err,db){
            if(db_err){
                cb(db_err,null);
            }
            else {

                var collection = db.collection('users'),
                    doc_type = DocumentTypes[request.document_type],
                    query = {'user_id':request.user_id},
                    update = {'$push':{'documents':{}}};

                update.$push.documents = {name: doc_type,"file_name": request.file.name, "file_type": request.file.type};

                collection.findAndModify(query,[],update,function(err,res){
                    cb(err,res);
                })

            }
        });

    };

    function storeFileOnAWS(path, name, cb){
        //var aws_config = new AWS.Config(config.aws.s3);
        AWS.config.update({"region": "us-west-2"});
        var storage = new AWS.S3();

        fs.readFile(path, function(err, data){
            if(err){
                cb(err,null);
            }
            else {

                var params = {
                    Bucket: config.aws.s3_bucket,
                    Key: name,
                    ACL:'authenticated-read',
                    Body: data,
                    ServerSideEncryption:"AES256"
                };

                storage.createBucket( {Bucket:config.aws.s3_bucket}, function(){

                    storage.putObject(params, function(storage_err, data){
                        if(storage_err){
                            cb(storage_err, null);
                        }
                        else {
                            console.log("Stored file successfully!");
                            console.log(data);
                            cb(null, data);
                        }
                    })
                })
            }
        })

    }

	function removeFile(file_path, callback) {
		fs.unlink(file_path, function(err){
			if(err){
				callback(err);
			}
			else {
				callback(null);
			}
		})
	}

    return {
        "execute":execute
    }

}())

module.exports = DocumentationUpload