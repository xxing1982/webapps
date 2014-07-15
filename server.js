//get static config
var config = require ('./config').values;
//instance express app
var app = require ('./app').getApp(config);
//instance http
var server = require('http').Server(app);
//instance socket.io
var io = require('socket.io')(server);
//get PORT from CLI
var port = parseInt(process.argv[2], 10) || 3001;
//start server on PORT
server.listen(port);
//start service that race
var race = require ('./lib/modules/race');
race.startRace(io);

//console output
console.log("Express server listening on port %d in %s mode", port, app.settings.env);

//emitted when the process receive a signal so as to stop the server and end the process
process.on('SIGINT', function () {
	server.close();
	console.log();
	console.log('Shutting down server...');
	process.exit(0);
});
