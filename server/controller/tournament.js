var session = require('express-session');


var mysql = require('mysql');

function create_connection() {
    var con = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'mountblue',
      database : 'demo2'
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
    return con;
}






/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR REGISTER PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
var registerPlayers = function registerPlayers(players,tourId,a, cb) {
    var con = create_connection();
    sql1 = `select count(*) as count from players where tour_id = ${tourId} and user_id = ${a} and player_name ='${players}';`;
    con.query(sql1,function (error, results, fields) {
        if (error) throw error;
        else{
            if(!(results[0].count)){
                sql = "INSERT INTO players (player_name,tour_id,user_id) values (?,?,?)";
                con.query(sql,[players,tourId,a],function (error, results, fields) {
                    con.end();
                    if (error) {
                        console.log("Problem in Adding Player");
                        return;
                    }
                    else{
                        console.log("Player Added Successfully");
                        cb(0,results);
                    }
                    });
                }
                else{
                    console.log("Player Already Exist");
                    cb(error,0);
                }
            }
        })
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR COUNT PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/










/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR REGISTER PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
/*var count = 0;
var registerPlayers = function registerPlayers(players,tourId,a, cb) {
    var con = create_connection();


    sql = "INSERT INTO players (player_name,tour_id,user_id) values (?,?,?)";
    con.query(sql,[players,tourId,a],function (error, results, fields) {
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
}*/

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

var displayTournament = function displayTournament(a,cb){
    var con=create_connection();
    var sql=(`select tour_id, tour_name from tournament where user_id = ${a}`);
    con.query(sql,function(err,result){
        con.end();
        if(err) {
            cb(err,0);
        }
    cb(null, result);
    })
}



//++++++++++++++++++++++++++++++User Tounament+++++++++++++++++++++++++++++++++++++++++++++++++

function userTournament(tour_name,user_id,cb){
  var con = create_connection();
  var sql = `select tour_name from tournament where user_id = ${user_id} and tour_name = '${tour_name}'`;
  con.query(sql, function (error, results) {
    console.log("=========================================",results.length)
    if (error) throw error
    if(results.length === 0){
        con.query(`insert into tournament (tour_name,user_id)  values (?,?)`,[tour_name,user_id], function (error, results) {
            console.log("inside Second Query")
          if (error) {
            cb(error, 0)
        }
        else{
            cb(0,results);
        }
    })
    }
})
}
//+++++++++++++++++++++++++++++Insert Players+++++++++++++++++++++++++++++++++++++++++++++++++




//++++++++++++++++++++++++++++++User Tounament+++++++++++++++++++++++++++++++++++++++++++++++++

/*function userTournament(tour_name,id,cb){
  var con = create_connection();
    con.query(`insert into tournament (tour_name,user_id)  values (?,?)`,[tour_name,id], function (error, results) {
      if (error) {
        cb(error, 0)
      }
      else{
        cb(0,results);
      }
  })
}*/

//+++++++++++++++++++++++++++++Insert Players+++++++++++++++++++++++++++++++++++++++++++++++++

function insertPlayers(id,cb){
  console.log(tour_name,id)
  var con = create_connection();
  con.query(`insert into players (player_name,user_id)  values (?,?)`,[player_name,user_id], function (error, results) {
      if (error) {
        cb(error, 0)
      }
      else{
        cb(0,results);
      }
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



var getPlayerStandings = function getPlayerStandings(tourId, a) {
    var con = create_connection();
    console.log("tourId============" + tourId + "userId============" + a)
    var sql = (`SELECT players.player_name,players.tour_id,players.user_id,COUNT(matches.winner_id) AS POINTS FROM players LEFT JOIN matches ON matches.winner_id = players.player_name GROUP BY players.player_name having players.user_id = ${a} and players.tour_id= ${tourId} ORDER BY POINTS DESC`);
    con.query(sql, function (err, result) {
        if (err) throw err;
        var standings = result;
        // For matches
        con.query(sql, function(err, result) {
            var sql = `select winner_id,loser_id,tour_id FROM matches where tour_id = ${tourId}`;
            con.query(sql,function(err,result){
                if (err) throw err
                var matches = result;
                console.log(result)
                getSwissPairings(standings, matches, 3,tourId)
            })
        })
    })
}



//=======================================Select All Players+++++++++++++++++++++++++++++++++


var getPlayers = function getPlayers(a) {
    var con = create_connection();
    var sql = (`select * from players where user_id = ${a}`);
    con.query(sql, function (err, result) {
        if (err) throw err;
        var count = result.length;
        console.log(count);
        con.end();
    })
}



/*<<<<<<<<<<<<<<<<<<<FUNCTION TO DETERMINE WINNER AND LOSER>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var matchUpdates = function(player1,player2,round,tourId,pairing){
    var con = create_connection();
    var sql = 'INSERT INTO matches (winner_id,loser_id,round_id,tour_id) VALUES (?,?,?,?)';
    con.query(sql,[player1,player2,round,tourId], function (err, result) {
        con.end();
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows   +   "Pairing " + pairing);
    })
}


/*<<<<<<<<<<<<<<<<<<<FUNCTION TO DETERMINE CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


var currentStatus =function(a,tourId,cb){
    console.log(tourId);
    var con = create_connection();
    var sql = (`SELECT players.player_name,players.tour_id,players.user_id,COUNT(matches.winner_id) AS POINTS FROM players LEFT JOIN matches ON matches.winner_id = players.player_name GROUP BY players.player_name having (players.user_id = ${a} and players.tour_id= ${tourId}) order by POINTS DESC;`);
    con.query(sql, function (err, result) {
        console.log(result);
        con.end();
        if (err) throw err;
        cb(null,result)
    })
}


//===============================GET FIXTURES++++++++++++++++++++++++++++++++++++++++++++++++






/*<<<<<<<<<<<<<<<<<<<FUNCTION TO GET SWISS PAIRING>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

function getSwissPairings(standings, matches, round,tourId) {
    var pairing = [];
    while(standings.length > 0){
    var sliced = standings.splice(0, 1);
    var firstPlayer = sliced[0].player_name;
    console.log("==============================="+firstPlayer)
        var player1 = firstPlayer;
        for(var i = 0 ;i < standings.length ; i++){
            player2 = standings[i].player_name;
            if(!((matches.winner_id == player1 && matches.loser_id == player2)||(matches.winner_id == player2 && matches.loser_id == player1))) {
                pairing.push([player1,player2]);
                var temp;
                if (Math.random() > .5){
                    temp = player1;
                    player1 = player2;
                    player2 = temp;
                }
                matchUpdates(player1,player2,round,tourId,pairing);
                standings.splice(i, 1);
                break;
            }
        }
    }
    console.log(pairing);
}





module.exports = {
    registerPlayers: registerPlayers,
    countPlayers: countPlayers,
    deletePlayers: deletePlayers,
    deleteMatches: deleteMatches,
    getPlayerStandings:getPlayerStandings,
    matchUpdates : matchUpdates,
    getSwissPairings : getSwissPairings,
    displayTournament : displayTournament,
    currentStatus : currentStatus,
    userTournament : userTournament,
    getPlayers : getPlayers
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
