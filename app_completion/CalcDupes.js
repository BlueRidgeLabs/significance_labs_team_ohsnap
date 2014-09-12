/**
 * Created by airswoop1 on 8/11/14.
 */
var MongoClient = require('../database.js'),
	_ = require('underscore'),
	util = require('util');


var CalcDupes = (function() {


	console.log("starting dupe calc");


	MongoClient.getConnection(function(err, db){
		if(err) throw err;

		var collection = db.collection('users'),
			query = {};
		console.log("finding all results...");
		collection.find({},[], function(err, cursor) {

			if(err) throw err;

			cursor.toArray(function(err, docs) {
				if(err) throw err;

				var grouped = _.groupBy(docs, function(i){

					return [i.name.first_name, i.name.last_name];

				});

				var userSets = {};

				for(var x in grouped){
					if(grouped[x].length >= 2){
						userSets[x]=[];

						for(var i =0;i<grouped[x].length; i++){
							userSets[x].push(grouped[x][i]);
						}

					}

				}

				console.log(util.inspect(userSets,true,null));



			});


		});


	});


} ());

module.exports = CalcDupes;