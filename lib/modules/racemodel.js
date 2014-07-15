/**
 * Created by 28848160 on 7/14/14.
 */
var config = require("../../config").values;
var util = require("./util");

var gScores = {};
var gHistory = [];
var gHallOfFame = [];

function setScores(scores){
    gScores = scores;
}
exports.setScores = setScores;

function getScores(){
    return gScores;
}
exports.getScores = getScores;

function resetScores(){
    gScores = {};
}
exports.resetScores = resetScores;

function formatScores (scores){
   var arr = [];
   for(var key in scores){
      arr.push({player: key, score : scores[key]});
   }
   return arr;
}
exports.formatScores = formatScores;

function setHistory(timestamp, name, scores){
    gHistory.push({
        timestamp: timestamp,
        name: name,
        scores: scores
    });
    util.sort(gHistory, 'timestamp', true);
    gHistory = gHistory.slice(0, config.game.show_history_games);
}
exports.setHistory = setHistory;

function getHistory(){
    return gHistory;
}
exports.getHistory = getHistory;

function resetHistory(){
    gHistory = [];
}
exports.resetHistory = resetHistory;

function setHallOfFame(timestamp, scores){
    for (var i = 0, l = scores.length; i < l ;  i++) {
        var score = scores[i];
        score.timestamp = timestamp;
        gHallOfFame.push(score); //add all scores
    }
    util.sort(gHallOfFame, 'score', true);
    gHallOfFame.slice(0, config.game.show_hall_of_fame);
}
exports.setHallOfFame = setHallOfFame;

function getHallOfFame(){
    return gHallOfFame;
}
exports.getHallOfFame = getHallOfFame;

function resetHallOfFame(){
    gHallOfFame = [];
}
exports.resetHallOfFame = resetHallOfFame;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setOperation () {
    var self = this;
    var member1 = getRandomInt(0,20);
    var member2 = getRandomInt(0,20);

    var operation_type = getRandomInt(0,1) ? '+' : '-'; //build the match challenge.
    self.quest =  member1 + operation_type + member2;
    self.solution = eval (self.quest);
}

function instanceOperation(){
    var operation = new setOperation();
    return operation;
}
exports.instanceOperation = instanceOperation;
