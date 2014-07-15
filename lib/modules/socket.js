var util = require("./util");
var racemodel = require("./racemodel");

//socket object
var gClients = {};
//array of socket ids
var gSessions = [];

//find socket clients via sessions (socket ids)
function broadcast(sessions, command, data, exception){
    for (var i=0, l=sessions.length; i < l ; i++) {
        if (!exception || sessions[i] != exception)
            gClients[sessions[i]].emit(command, data);
    }
}
exports.broadcast = broadcast;

//get session (socket ids)
function getSessions(){
    //array of socket ids
    return gSessions;
}
exports.getSessions = getSessions;

//socket.io connection
function connectSocket(io){

    var operation = racemodel.instanceOperation();

	io.on('connection', function (socket) {
        socket.on('disconnect', function () {
			for (var i = 0, l = gSessions.length; i < l ;  i++) {
				if (gSessions[i]==socket.id){
					delete gClients[socket.id];
                    gSessions.splice(i,1);
					break;
				}
			}
		});

        socket.on('join', function (data) {
			util.add (gSessions, socket.id); //add socket id to list of gSessions
			gClients[socket.id] = socket;  //store specific socket object
            socket.emit ('new_operation', operation.quest); //send challenge to new socket
            socket.emit ('scores', racemodel.formatScores(racemodel.getScores())); //send scores to new socket
            socket.emit ('history', racemodel.getHistory()); //send history
			broadcast (gSessions, 'hall_of_fame', racemodel.getHallOfFame()); //send hall of fame
        });

        socket.on('solve_operation', function (data) {
			if (data.operation == operation.solution){
				//result_operation: 1:you win, 2:other player won, 0: bad operation
                socket.emit ('result_operation', 1); //msg to winner
				broadcast (gSessions, 'result_operation', 2, socket.id); //msg to rest of players. someone else won!

				var safe_name = data.name.slice(0,25); //avoid long names
                var scores = {};
                scores = racemodel.getScores();
				scores[safe_name] = (scores[safe_name] || 0) + 1; //credit score to socket
                racemodel.setScores(scores);
				broadcast (gSessions, 'scores', racemodel.formatScores(racemodel.getScores())); //broacast scores

				//new challenge
                operation = racemodel.instanceOperation();
				broadcast (gSessions, 'new_operation', operation.quest); //new challenge for all players
			} else {
                socket.emit ('result_operation', 0);
            }
		});
	});
}
exports.connectSocket = connectSocket;