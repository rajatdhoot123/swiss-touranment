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
    });
    return con;
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<FUNCTION FOR REGISTER PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var registerPlayers = function registerPlayers(players,tourId,a, cb) {
    var con = create_connection();
    sql1 = `select count(*) as count,player_name from players
            where tour_id = ${tourId} and
            user_id = ${a} and player_name ='${players}'`;
    con.query(sql1,function (error, results, fields) {
        if (error) throw error;
        else{
            if(!(results[0].count)){
                sql = "INSERT INTO players (player_name,tour_id,user_id) values (?,?,?)";
                con.query(sql,[players,tourId,a],function (error, results, fields) {
                    con.end();
                    if (error) {
                        return;
                    }
                    else{
                        cb(0,results);
                    }
                });
            }
            else{
                cb(error,0);
            }
        }
    })
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var displayTournament = function (a,cb){
    var con=create_connection();
    var sql=(`select tour_id,status, tour_name from tournament where user_id = ${a}`);
    con.query(sql,function(err,result){
        con.end();
        if(err) {
            cb(err,0);
        }
        cb(null, result);
    })
}





//=================================================================================================
/*select max(matches.round_id) as rounds,matches.winner_id,count(matches.winner_id) as Points,
            tournament.status from matches,
            tournament where matches.tour_id = 6 and tournament.status= 'Finished'
            group by winner_id order by Points desc limit 1*/


var getTournamentStatus = function (a,tourId,cb){
    var con=create_connection();
    var sql=`select status from tournament where user_id = ${a} and tour_id = ${tourId}`;
    con.query(sql,function(err,result){
        if(err) {
            cb(err,0);
        }
        else{
            var sql1 = `select max(matches.round_id) as rounds,tournament.status,matches.winner_id,count(matches.winner_id) as Points,
            tournament.status from matches,
            tournament where tournament.tour_id = ${tourId} and matches.tour_id = ${tourId}
            group by winner_id order by Points desc limit 1`;
            con.query(sql1,function(err,result){
                con.end();
                if(err) {
                    cb(err,0);
                }
                else{
                    cb(0,result)
                }
            })
        }
     })
}

//++++++++++++++++++++++++++++++User Tounament+++++++++++++++++++++++++++++++++++++++++++++++++

function userTournament(tour_name,user_id,cb){
  var con = create_connection();
  var sql = `select tour_name from tournament
  where user_id = ${user_id} and tour_name = '${tour_name}'`;
  con.query(sql, function (error, results) {
    if (error) throw error;
    else{
        if(results.length === 0){
            con.query(`insert into tournament (tour_name,user_id)  values (?,?)`,[tour_name,user_id], function (error, results) {
                if (error) {
                    cb(error,0);
                }
                else{
                    cb(0,results);
                }
            })
        }
        else{
            cb(null,0);
        }
    }
})
}

/*<<<<<<<<<<<<<<<<<<<FUNCTION TO DETERMINE CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var currentStatus = function(a,tourId,cb){
    var con = create_connection();
var sql = `select p.id,p.user_id,p.tour_id,
            p.player_name, ifnull(ws.wins, 0) as wins, ifnull(ls.losses,0) as losses,
            (ifnull(ws.wins,0) + ifnull(ls.losses,0)) as matches
            from players p left outer join ((select winner_id, count(*) as wins
            from matches where matches.tour_id = ${tourId} group by winner_id) as ws) on (p.player_name = ws.winner_id)
            left outer join ((select loser_id, count(*) as losses
            from matches where matches.tour_id = ${tourId} group by loser_id) as ls)
            on (p.player_name = ls.loser_id) having (p.user_id = ${a} and p.tour_id = ${tourId}) order by wins desc`;


/*    var sql = (`SELECT players.player_name,
        players.tour_id,players.user_id,COUNT(matches.winner_id) AS POINTS
        FROM players LEFT JOIN matches ON matches.winner_id = players.player_name
        GROUP BY players.player_name having (players.user_id = ${a}
        and players.tour_id= ${tourId}) order by POINTS DESC;`);*/
        con.query(sql, function (err, result) {
        con.end();
        if (err) throw err;
        cb(null,result)
    })
}


//=======================================Select All Players+++++++++++++++++++++++++++++++++


var getPlayers = function (a,tourId,cb) {
    var con = create_connection();
    var sql = (`select distinct player_name from players where user_id = ${a} and tour_id <> ${tourId}
                and player_name not in
                (select player_name from players where user_id = ${a} and tour_id = ${tourId}
                )
            `);
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err,null)
        }
        else{
            cb(null,result)
        }
    })
}

//+++++++++++++++++++++++++++++++++++++++Current Players++++++++++++++++++++++++++++++++++++++++

var getCurrentPlayers = function (a,tourId,cb) {
    var con = create_connection();
    var sql = (`select * from players where user_id = ${a} and tour_id = ${tourId}`);
    con.query(sql, function (err, result) {
        con.end();
        if (err) {
            cb(err,null)
        }
        else{
            cb(null,result)
        }
    })
}


/*<<<<<<<<<<<<<<<<<<<<<<<<<Get Players Standing>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

var getPlayerStandings = function (tourId, a,fixture,rounds,cb) {
    var con = create_connection();

    var sql = `select p.id,p.user_id,p.tour_id,
            p.player_name, ifnull(ws.wins, 0) as wins, ifnull(ls.losses,0) as losses,
            (ifnull(ws.wins,0) + ifnull(ls.losses,0)) as matches
            from players p left outer join ((select winner_id, count(*) as wins
            from matches where matches.tour_id = ${tourId} group by winner_id) as ws) on (p.player_name = ws.winner_id)
            left outer join ((select loser_id, count(*) as losses
            from matches where matches.tour_id = ${tourId} group by loser_id) as ls)
            on (p.player_name = ls.loser_id) having (p.user_id = ${a} and p.tour_id = ${tourId}) order by wins desc`;

    /*var sql = (`SELECT players.player_name,players.tour_id,players.user_id,
        COUNT(matches.winner_id) AS POINTS FROM players LEFT JOIN matches ON
        matches.winner_id = players.player_name
        GROUP BY players.player_name having players.user_id = ${a} and players.tour_id= ${tourId}
        ORDER BY POINTS DESC`);*/

        con.query(sql, function (err,result) {
        if (err) throw err;
        var standings = result;
        cb(0,result)
        con.query(sql, function(err, result) {
            var sql = `select winner_id,loser_id,tour_id FROM matches where tour_id = ${tourId}`;
            con.query(sql,function(err,result){
                if (err) throw err
                    var matches = result;
                getSwissPairings(standings, matches, rounds ,tourId, fixture,function(pairing){
                })
            })
        })
    })
}

/*<<<<<<<<<<<<<<<<<<<FUNCTION TO GET SWISS PAIRING>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

function getSwissPairings(standings, matches, rounds,tourId,fixture,cb) {
    var pairing = [];
    while(standings.length > 0){
        var sliced = standings.splice(0, 1);
        var firstPlayer = sliced[0].player_name;
        var player1 = firstPlayer;
        for(var i = 0 ;i < standings.length ; i++){
            player2 = standings[i].player_name;
            if(!((matches.winner_id == player1 && matches.loser_id == player2)||(matches.winner_id == player2 && matches.loser_id == player1))) {
                pairing.push([player1,player2]);
                var temp;
                // if (Math.random() > .5){
                //     temp = player1;
                //     player1 = player2;
                //     player2 = temp;
                // }
                standings.splice(i, 1);
                break;
            }
        }
    }
    cb(pairing);
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var getRoundFixture = function(round,tourId,cb) {
    var con = create_connection();
    var sql = `select winner_id,loser_id from matches where (tour_id =${tourId} and round_id = ${round}) `;
    con.query(sql, function (err, result) {
        if (err) throw err;
        cb(null,result);
    })
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var getTotalPlayers = function(tourId,a,cb) {
    var con = create_connection();
    var sql1 = `update tournament set status = 'In Progress' where tour_id = ${tourId}`
    con.query(sql1, function (err, result) {
        if (err) throw err;
        else{
            var sql = `select * from players where tour_id =${tourId} and user_id = ${a} `;
            con.query(sql, function (err, result) {
                if (err) throw err;
                cb(null,result);
            })
        }
    })
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var updateMatch = function(users,cb) {
    var arr = []
    var winner = users.winner;
    var loser = users.loser;
    var tourId = users.tourId;
    var round = users.round;
    for(var i =0 ; i < winner.length ; i++){
        arr.push([winner[i],loser[i],tourId[i],round[i]])
    }

    var con = create_connection();
    var sql = `insert into matches (winner_id,loser_id,tour_id,round_id) values ?; `;
    con.query(sql, [arr], function (err, result) {
        if (err) throw err;
        cb(null,result);
    })
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


var tstatus = function(a,tname,cb) {
    var con = create_connection();
    var sql = `update tournament set status ="In Progress" where tour_name = '${tname}' and user_id = ${a};`
    con.query(sql, function (err, result) {
        if (err) throw err;
        cb(null,result);
    })
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var getRounds = function(tourId,cb) {
    var con = create_connection();
    var sql = `select DISTINCT round_id from matches where tour_id = ${tourId};`
    con.query(sql, function (err, result) {
        if (err) throw err;
        cb(null,result);
    })
}



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<




var updateTour = function(tourId,gameOver,cb) {
    var con = create_connection();
    var sql = `update tournament set status = 'Finished' where tour_id = ${tourId}`
    con.query(sql, function (err, result) {
        if (err) throw err;
        cb(null,result);
    })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


module.exports = {
    registerPlayers: registerPlayers,
    getPlayerStandings:getPlayerStandings,
    getSwissPairings : getSwissPairings,
    displayTournament : displayTournament,
    currentStatus : currentStatus,
    userTournament : userTournament,
    getPlayers : getPlayers,
    getTotalPlayers:getTotalPlayers,
    updateMatch:updateMatch,
    getCurrentPlayers:getCurrentPlayers,
    getRoundFixture:getRoundFixture,
    tstatus:tstatus,
    getRounds:getRounds,
    updateTour:updateTour,
    getTournamentStatus:getTournamentStatus
}
