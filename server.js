console.log("Initializing OHSNAP... ");
//require('monitor').start();

var express = require("express");
var http = require("http");
var https = require('https');
var path = require("path");
var ip = require("ip")

var api = require("./api/api.js");
var config = require('./config.js');

var app = express();
var server = http.createServer(app);
//var https_server = https.createServer(config.ssl, app);


app.set('port', config.web.http_port);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.compress());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser('0'));
app.use(express.session());




app.configure('sandbox', function(){
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/*app.configure('prod', function(){
    app.use(express.errorHandler());

    app.use(function(req, res, next){
        if(!req.connection.encrypted){
            res.redirect('https://' + req.headers.host + req.url);
        }
        else {
            next();
        }
    })

});*/

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

api.set_routes(app);

server.listen(app.get('port'), function () {
    console.log('HTTP now listening on ' + app.get('port'));
    console.log('Url: ' + ip.address())
});

/*https_server.listen(config.web.https_port, function(){
    console.log("HTTPS now listening on port " + config.web.https_port)
    console.log("Completed Node initialization: " + new Date());
})*/