/**
 * Created by airswoop1 on 6/23/14.
 */
var fs = require('fs')
	phaxio_prod_key = process.env.PHAXIO_PROD_KEY,
    phaxio_prod_secret = process.env.PHAXIO_PROD_SECRET,
    AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY,
	AWS_S3_BUCKET = process.env.AWS_S3_OHSNAP,
	MONGO_URI = process.env.MONGODB_URI_SL_OHSNAP;


module.exports = {
    "db" : {
        "mongodb" : MONGO_URI
    },
    "aws" : {
        "s3" : {
            "accessKeyId": AWS_ACCESS_KEY,
            "secretAccessKey": AWS_SECRET_KEY,
        },
        "s3_bucket":AWS_S3_BUCKET
    },
    "ssl" : {
        //"key":fs.readFileSync('ssl.key'),
        //"cert":fs.readFileSync('ssl.crt'),
        //"ca":fs.readFileSync('sub.class1.server.ca.pem')
    },
    "web": {
        "http_port": 3000,
        "https_port" : 3001
    },
    "phaxio" : {
        "key":phaxio_prod_key,
        "secret":phaxio_prod_secret
    }

};

