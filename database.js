/**
 * Created by airswoop1 on 6/23/14.
 */
var MongoClient = require('mongodb').MongoClient,
    config = require('./config.js'),
    mongo_url = config.db.mongodb;

var mongoDatabase;

function getConnection(callback) {

    if (mongoDatabase) {
        callback(null,mongoDatabase);
    }
    else {
        console.log("Connecting to mongo database...");

        MongoClient.connect(mongo_url, function(err,db) {
            if(err) {
                console.log("Unable to connect to Mongo database.");

                mongoDatabase = null;
                callback(err, null);
            }
            else {
                console.log("Connected to Mongo database.");
                mongoDatabase = db;
                callback(null, mongoDatabase);
            }
        });
    }
};

function isConnected() {
    if(typeof mongoDatabase === "undefined") {
        return false;
    }
    else {
        return true;
    }
}

module.exports.getConnection = getConnection;
module.exports.isConnected = isConnected;