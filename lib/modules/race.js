var config = require("../../config").values
var socket = require("./socket");
var racemodel = require("./racemodel");

function startRace(io){
    var game_duration = config.game.duration * 1000;
    var game_started = new Date();

    //refresh pages per second
	setInterval(function broadcastTime(){
		var elapsed = new Date().getTime() - game_started.getTime();
		var remaining = Math.floor((game_duration - elapsed) / 1000);
		if (remaining<0){
			//archive game
			var timestamp = game_started.getDate() + '/' + (game_started.getMonth() + 1) + '/' + game_started.getFullYear() + ' ' +  game_started.getHours() + ":" + (game_started.getMinutes() > 9 ? game_started.getMinutes() : '0' + game_started.getMinutes());
			if (racemodel.formatScores(racemodel.getScores()).length){
                //set history and hall of fame before scores reset
                racemodel.setHistory(game_started.getTime(), timestamp, racemodel.formatScores(racemodel.getScores()));
                racemodel.setHallOfFame(timestamp, racemodel.formatScores(racemodel.getScores()));
            }
            //reset scores
            racemodel.resetScores();
            //timeout, start game again
			game_started = new Date();
            //broadcast scores, history and hall of fame
			socket.broadcast (socket.getSessions(), 'scores', racemodel.formatScores(racemodel.getScores()));
            socket.broadcast (socket.getSessions(), 'history', racemodel.getHistory());
            socket.broadcast (socket.getSessions(), 'hall_of_fame', racemodel.getHallOfFame());
            socket.broadcast (socket.getSessions(), 'new_game', null);

		} else {
            //continuously countdown
            socket.broadcast (socket.getSessions(), 'time', remaining);
        }
	}, 1000);

    //socket.io connection
    socket.connectSocket(io);
}
exports.startRace = startRace;
