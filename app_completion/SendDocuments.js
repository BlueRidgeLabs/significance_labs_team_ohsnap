/**
 * Created by airswoop1 on 7/24/14.
 */

var Phaxio = require('phaxio'),
	MongoClient = require('../database.js'),
    fs = require('fs'),
    config = require("../config.js"),
    phaxio = new Phaxio(config.phaxio.key,config.phaxio.secret);


var SendDocuments = (function() {

    console.log("Sending Documents via Phaxio...")

    MongoClient.getConnection(function(db_err, db){
        if(db_err) {
            console.log(db_err);
        }
        else {
            var collection = db.collection('users'),
                query = {'completed':true, 'documents':{'$exists':true}, "$or":[{'sent_documents': false}, {'sent_documents':{'$exists':false}}]};

            collection.find(
                query,
                function(err, cursor){
                    if(err){
                        console.log("error with query in Send Documents!");
                        console.log(err);
                    }
                    else{
                        cursor.toArray(function(e, docs){
                            //console.log(docs.length);
                            docs.forEach(sendDocuments);

                        })
                    }
                })
        }
    });


    function sendDocuments() {



    }


} ());

module.exports = SendDocuments;