var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var io = require('socket.io')(http);

var secret = require('./app/config/secret'); // get our secret
var database = require('./app/config/database'); // get our database config

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(database.url); // connect to database
mongoose.connection.on('open', function () {
 console.log('SUCCESS');
});
mongoose.connection.on('error', function (err) {
 console.log('ERROR WITH DATABASE');
 console.log(err);
});
app.set('superSecret', secret); // secret variable
app.use('/public', express.static(__dirname + '/app/public')); 
app.use('/assets', express.static(__dirname + '/app/public/assets')); 
app.use('/components', express.static(__dirname + '/app/public/js/components')); 
app.use('/shared', express.static(__dirname + '/app/public/js/shared')); 
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// use morgan to log requests to the console
app.use(morgan('dev'));

/*Init routes */
require('./app/routes.js')(app, express, io);

// app.listen(port);
http.listen(port, function () {
	console.log('app start on ' + port);
});
// console.log('Magic happens at http://localhost:' + port);

