var express = require('express');
var player = require('../controller/tournament');
var user = require('../controller/user');
var bodyParser = require('body-parser');
var parse = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var session = require('express-session');

module.exports=function (app, passport){

  router.get('/',function(req,res){
    app.use(express.static(path.join(__dirname, '/index.html')));
    res.send({ message: 'welcome to Swiss Tournament' });
  });


  /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/registerPlayers', parse ,function(req,res){
    var players = req.body.pname;
    if(!(players === "" )){
    var tourId = req.body.tourId;
    player.registerPlayers(players,tourId,req.session.passport.user,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.json(result);
      }
    });
  }
  else{
    res.send("You Cannont Add Empty Player");
  }
  });

  /*<<<<<<<<<<<<<<<<<<<LOGIN USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.post('/updateMatch',parse, function (req, res) {
    var users = req.body;

    player.updateMatch(users,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.json(result);
      }
    });
  });



  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


  router.post('/registerUser',parse, function (req, res) {
    var users = req.body;
    user.registerUser(users,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.render('login')
      }
    });
  });
  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.get('/currentStatus/:tourId', function (req, res) {
    var tourId = req.params.tourId;
    player.currentStatus(req.session.passport.user,tourId,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(result));
      }
    });
  });


//==========================================================================================================



  router.get('/getTournamentStatus/:tourId', function (req, res) {
    var tourId = req.params.tourId;
    player.getTournamentStatus(req.session.passport.user,tourId,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(result));
      }
    });
  });


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


  router.post('/torunamentStatus/', function (req, res) {
    var tourName = req.body.tname;
    player.tstatus(req.session.passport.user,tourName,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(result));
      }
    });
  });


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  router.get('/getRounds/:tourId', function (req, res) {
    var tourId = req.params.tourId;
    player.getRounds(tourId,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(result);
      }
    });
  });




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==




  router.get('/getRoundFixture/:tourId/:round', function (req, res) {
    var tourId = req.params.tourId;
    var round = req.params.round;
    player.getRoundFixture(round,tourId,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(result));
      }
    });
  });





/*============================Get Current Players=====================================*/



  router.get('/getCurrentPlayers/:tourId', function (req, res) {
    var tourId = req.params.tourId;
    player.currentStatus(req.session.passport.user,tourId,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(result));
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.get('/getPlayers/:id',function(req,res){
    player.getPlayers(req.session.passport.user,req.params.id,function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(results));
      }
    });
  });

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  router.get('/getTotalPlayers/:tourId',function(req,res){
    player.getTotalPlayers(req.params.tourId,req.session.passport.user,function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(results));
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<User Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.post('/usertournament',parse,function(req,res){


    var tour_name = req.body.tour_name;
    if(!(tour_name === "" )){
    player.userTournament([tour_name],[req.session.passport.user],function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results === 0){
          res.send(JSON.stringify(results))
        }
        else{
        res.send(JSON.stringify({'result' : results.insertId}));
      }
      }
    });
  }
  else{
    res.send(JSON.stringify({'result' : 'Empty Tournament'}));
  }
  });


  /*<<<<<<<<<<<<<<<<<<<Sub Tournament Count>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.get('/sub_tour_count',function(req,res){
    player.displayTournament(req.session.passport.user,function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify(results));
      }
    });
  });


//<<<<<<<<<<<<<<<<<<<<<<<GET PLAYERS STANDING>>>>>>>>>>>>>>>>>>>>>>

  router.get('/viewTournament',function(req,res){
    player.displayTournament(req.session.passport.user,function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.render('tournament',{success: false,errors : req.session.errors, result : JSON.stringify(results)})
      }
    });
  });


//++++++++++++++++++++++++++++++GET SWISS PAIRING+++++++++++++++++++++++++++++++++++++++++++

router.post('/getFixture',function(req,res){
  var rounds = req.body.round;
  var tourId = req.body.tourId;
  var fixture = true;
  player.getPlayerStandings(tourId,req.session.passport.user,fixture,rounds,function(error,results){
    if (error) {
        throw error
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.send(JSON.stringify(results));
    }
  });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  router.post('/tournamentOver', function (req, res) {
    var tourId = req.body.tourId;
    var gameOver = 'finished'

    player.updateTour(tourId,gameOver,function(err,result){
      if (err) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.json(result);
      }
    });
  });
/*<<<<<<<<<<<<<<<<<<<Sub Tournament COunt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=


return router;
}
