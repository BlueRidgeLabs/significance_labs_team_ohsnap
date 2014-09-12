/**
 * Created by airswoop1 on 8/3/14.
 */
var MongoClient = require('../database.js');


var UpdateUserInfo = (function(){


	var Request = function(){
		this.user_id=undefined;
	};

	var Response = function(){
		this.status = undefined;
		this.message = undefined;
		this.user_id = undefined;
	};

	var execute = function(req, res){
		console.log(req.body);
		if(req.method == 'GET'){
			res.send("Oops, this isn't what you're looking for!");
		}
		else if(req.method == 'POST') {

			validate_data(req.body, function(validated){

				if(validated){
					var request = new Request();
					request.user_id = req.body.user_id;

					MongoClient.getConnection(function(db_err, db){
						if(db_err) {
							console.log(db_err);
							var response = new Response();
							response.status = 404;
							response.message = 'error connecting to db';
							res.send(response);
						}
						else {
							var collection = db.collection('users');

							var query = {};

							query['user_id'] = request.user_id;

							req.body['last_modified'] = new Date().getTime();
							req.body['created_on_readable'] = new Date().toLocaleString();

							var update = {"$set":req.body};

							collection.update(
								query,
								update,
								{"upsert":false, "multi": false},
								function (err, updated) {
									if(err){
										console.log("error writing to the db for user: " + request.user_id);
										console.log(err);
										var response = new Response();
										response.status = 500;
										response.message = "error writing to db";

										res.send(500, response);
									}
									else {

										var response = new Response();
										response.status = 201;
										response.message = "successfully updated user data";
										res.send(201, response);
									}
								})

						}

					})
				}
				else {
					var response = new Response();
					response.status = 400;
					response.message = 'input data incorrect';
					res.send(400,response);
				}
			})
		}

	}


	function validate_data(data, callback) {
		if(!data.user_id) {
			callback(null);
		}
		else {
			callback(true);
		}
	}

	return {
		"execute":execute
	}

}());

module.exports = UpdateUserInfo;