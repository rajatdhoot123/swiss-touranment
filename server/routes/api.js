var express = require('express');
var player = require('../controller/tournament');
var user = require('../controller/user');
var bodyParser = require('body-parser');
var parse = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var session = require('express-session');
//var a = 0;
module.exports=function (){

  router.get('/',function(req,res){
    app.use(express.static(path.join(__dirname, '/index.html')));
    res.json({ message: 'welcome to Swiss Tournament' });
  });


  /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/registerPlayers', parse ,function(req,res){
    var players = req.body.pname;
    if(!(players === "" )){
    var tourId = req.body.tourId;
    player.registerPlayers(players,tourId,req.session.name,function(err,result){
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

  router.post('/loginUser', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    user.loginUser(email,password,function(err,result){
      if (err) {
        res.send({
          "invalid":"Who You Are You Are Not Authoonticate user",
          "code":400,
          "failed":err
        })
      }else{
        req.session.name=result[0].user_id;
        //res.cookie('user','email',{signed:true});
        res.redirect('/tournament')
      }
    });
  });

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
        res.redirect('/login')
      }
    });
  });
  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.get('/currentStatus/:tourId', function (req, res) {
    var tourId = req.params.tourId;
    player.currentStatus(req.session.name,tourId,function(err,result){
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
    player.tstatus(req.session.name,tourName,function(err,result){
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
    player.currentStatus(req.session.name,tourId,function(err,result){
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
    player.getPlayers(req.session.name,req.params.id,function(error,results){
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
    player.getTotalPlayers(req.params.tourId,req.session.name,function(error,results){
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
    player.userTournament([tour_name],[req.session.name],function(error,results){
      if (error) {
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.send(JSON.stringify({'result' : results.insertId}));
      }
    });
  });


  /*<<<<<<<<<<<<<<<<<<<Sub Tournament Count>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.get('/sub_tour_count',function(req,res){
    player.displayTournament(req.session.name,function(error,results){
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

router.post('/getPlayerStandings',function(req,res){
  var tourId = req.body.tourId;
  var rounds = req.body.round;
  var fixture = false;
  player.getPlayerStandings(tourId,req.session.name,fixture,rounds,function(error,results){
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.render('result',{matchresult:results});
    }
  });
});

//++++++++++++++++++++++++++++++GET SWISS PAIRING+++++++++++++++++++++++++++++++++++++++++++

router.post('/getFixture',function(req,res){
  var rounds = req.body.round;
  var tourId = req.body.tourId;
  var fixture = true;
  player.getPlayerStandings(tourId,req.session.name,fixture,rounds,function(error,results){
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

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<GET ALL PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.

router.post('/getAllPlayers',function(req,res){
  var tourId = req.body.tourId;
  player.getPlayers(req.session.name,tourId,function(error,results){
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.render('getAllPlayer',{allPlayer : results});
    }
  });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/getFinalResult',function(req,res){
  var tourId = req.body.tourId;
  player.getFinalResult(tourId,function(error,results){
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.render('try',{work:results});
    }
  });
});

//>>>>>>>>>>>>>>>>>>>>>DELETE PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get('/deletePlayers/:id',function(req,res){
  //var pid = req.body.tourId;
  var pid = req.params.id;
  player.deletePlayers(pid,function(error,results){
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.redirect('/tournament');
    }
  });
});

/*<<<<<<<<<<<<<<<<<<<Sub Tournament COunt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
return router;
}
