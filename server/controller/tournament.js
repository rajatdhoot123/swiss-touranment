var mysql = require('mysql');
function create_connection() {
    var con = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'mountblue',
      database : 'demo1'
    });
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
return con;
}





/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR REGISTER PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var count = 0;
var registerPlayers = function registerPlayers(players, cb) {
    var con = create_connection();
    con.query('INSERT INTO PLAYERS SET ?',players, function (error, results, fields) {
        con.end();
        if (error) {
            console.log(error);
            return;
        }
        count++;
        var data = Math.log2(count);
        if (!(data === parseInt(data, 10))||count===1)
          console.log("total players should be 2^n where n is tolat no. of players");
        else
          console.log("you can conduct a round or add more players");
      cb(null, results.affectedRows);
  });
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR COUNT PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var countPlayers = function countPlayers(cb){
    var con=create_connection();
    var sql="select player_id, count(*) as total_players from player;"
    con.query(sql,function(err,result){
        con.end();
        if(err) {
            cb(err,0);
        }
    cb(null, result[0].total_players);
    })
}


/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var displayPlayers = function displayPlayers(cb){
    var con=create_connection();
    var sql="select tour_id, tour_name from tournament;"
    con.query(sql,function(err,result){
        con.end();
        if(err) {
            cb(err,0);
        }
    cb(null, result);
    })
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR DELETE PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var deletePlayers = function deletePlayers(cb){
    var con = create_connection();
    con.query('TRUNCATE TABLE PLAYERS;', function (error, results) {
        con.end();
        if (error) {
            cb(error, 0);
        }
        cb(null, results);
    });
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR DELETE MATCHES>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var deleteMatches = function deleteMatches(cb){
var con = create_connection();
con.query('TRUNCATE TABLE MATCHES;', function (error, results) {
    con.end();
    if (error) {
        cb(error, 0);
    }
    cb(null, results);
});
}



/*<<<<<<<<<<<<<<<<<<<<<<<<<Get Players Standing>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/



var getPlayerStandings = function getPlayerStandings(round) {
    var con = create_connection();
    var sql = 'SELECT PLAYERS.NAME,COUNT(MATCHES.WINNER) AS POINTS,PLAYERS.tour_id FROM PLAYERS LEFT JOIN MATCHES ON MATCHES.WINNER = PLAYERS.NAME GROUP BY PLAYERS.NAME HAVING PLAYERS.tour_id = 12  ORDER BY POINTS DESC;';
    con.query(sql, function(err, res) {
        con.query(sql, function (err, result) {
        if (err) throw err;
        var standings = result;

        // For matches
        con.query(sql, function(err, res) {
            var sql = 'SELECT WINNER,LOOSER FROM MATCHES';
            con.query(sql,function(err,result){
                if (err) throw err
                var matches = result;
                console.log(matches);
                getSwissPairings(standings, matches, round)
                con.end();
                })
            })
        })
    })
}











/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR PLAYER STANDING>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
/*var getPlayerStandings = function getPlayerStandings(round) {
    var con = create_connection();
    var sql = 'SELECT PLAYERS.NAME,COUNT(MATCHES.WINNER) AS POINTS FROM PLAYERS LEFT JOIN MATCHES ON MATCHES.WINNER = PLAYERS.NAME GROUP BY PLAYERS.NAME ORDER BY POINTS DESC;';
    con.query(sql, function(err, res) {
        con.query(sql, function (err, result) {
        if (err) throw err;
        var standings = result;

        // For matches
        con.query(sql, function(err, res) {
            var sql = 'SELECT WINNER,LOOSER FROM MATCHES';
            con.query(sql,function(err,result){
                if (err) throw err
                var matches = result;
                console.log(matches);
                getSwissPairings(standings, matches, round)
                con.end();
                })
            })
        })
    })
}*/

/*<<<<<<<<<<<<<<<<<<<FUNCTION TO DETERMINE WINNER AND LOSER>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var matchUpdates = function(player1,player2,round){
    var con = create_connection();
    var sql = 'INSERT INTO MATCHES (WINNER,LOOSER,ROUND_ID) VALUES (?,?,?)';
    con.query(sql,[player1,player2,round], function (err, result) {
        con.end();
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    })
}


/*<<<<<<<<<<<<<<<<<<<FUNCTION TO DETERMINE CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


var currentStatus =function(cb){
    var con = create_connection();
    var sql = 'SELECT PLAYERS.NAME,COUNT(MATCHES.WINNER) AS POINTS FROM PLAYERS LEFT JOIN MATCHES ON MATCHES.WINNER = PLAYERS.NAME GROUP BY PLAYERS.NAME ORDER BY POINTS DESC;';
    con.query(sql, function (err, result) {
        con.end();
        if (err) throw err;
        cb(null,result)
    })
}



/*<<<<<<<<<<<<<<<<<<<FUNCTION TO GET SWISS PAIRING>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

function getSwissPairings(standings, matches, round) {
    var pairing = [];
    while(standings.length > 0){
    var sliced = standings.splice(0, 1);
    var firstPlayer = sliced[0].NAME;
        var player1 = firstPlayer;
        for(var i = 0 ;i < standings.length ; i++){
            player2 = standings[i].NAME;
            if(!((matches.winner == player1 && matches.looser == player2)||(matches.winner == player2 && matches.looser == player1))) {
                pairing.push([player1,player2]);
                var temp;
                if (Math.random() > .5){
                    temp = player1;
                    player1 = player2;
                    player2 = temp;
                }
                matchUpdates(player1,player2,round);
                standings.splice(i, 1);
                break;
            }
        }
    }
    //pointUpdate();
    console.log(pairing)// Get the Swiss Pairing On Terminal
}





module.exports = {
    registerPlayers: registerPlayers,
    countPlayers: countPlayers,
    deletePlayers: deletePlayers,
    deleteMatches: deleteMatches,
    getPlayerStandings:getPlayerStandings,
    matchUpdates : matchUpdates,
    getSwissPairings : getSwissPairings,
    displayPlayers : displayPlayers,
    currentStatus : currentStatus,
    // playerStandings: playerStandings
}
