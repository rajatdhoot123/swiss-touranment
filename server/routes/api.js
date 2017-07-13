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
    var tourId = req.body.tourId;
    player.registerPlayers(players,tourId,req.session.name,function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.json(result);
      }
    });
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
        console.log(req.session.name + "=======================================");
        //res.cookie('user','email',{signed:true});
        res.redirect('/tournament')
      }
    });
  });

  /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.post('/updateMatch',parse, function (req, res) {
    var users = req.body;
    console.log(req.body.winner)
    console.log(req.body.loser)
    console.log(req.body.tourId)
    player.updateMatch(users,function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is: ', result);
        res.json(result);
      }
    });
  });



  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


  router.post('/registerUser',parse, function (req, res) {
    var users = req.body;
    console.log(users)
    user.registerUser(users,function(err,result){
      console.log("hi1")
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is: ', result);
        res.redirect('/login')
      }
    });
  });
  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.get('/currentStatus/:tourId', function (req, res) {
    console.log("Current Status Called");
    var tourId = req.params.tourId;
    console.log(tourId);
    player.currentStatus(req.session.name,tourId,function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is:------------------------------------ ', result);

        res.send(JSON.stringify(result));
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
      }
    });
  });

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/



  router.get('/getPlayers/:id',function(req,res){
    console.log("req.params.id"+req.params.id+"req.params.id"+req.params.id)
    player.getPlayers(req.session.name,req.params.id,function(error,results){
      if (error) {
        console.log("error ocurred",error);
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
        console.log("error ocurred",error);
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
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('Tournament Created-------------------------- ', results.insertId);
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
        res.send(JSON.stringify({'result' : results.insertId}));
      }
    });
  });


  /*<<<<<<<<<<<<<<<<<<<Sub Tournament Count>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.get('/sub_tour_count',function(req,res){
    player.displayTournament(req.session.name,function(error,results){
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('Player Counted ', results);

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
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log(results + "-----------------------------------------------------------------")
      res.render('result',{matchresult:results});
    }
  });
});

//++++++++++++++++++++++++++++++GET SWISS PAIRING+++++++++++++++++++++++++++++++++++++++++++



router.post('/getFixture',function(req,res){
  console.log('Current Players');
  var rounds = req.body.round;
  var tourId = req.body.tourId;
  console.log(">>>>>>>>>tourId<<<<<<<<<<<<<<"+tourId)
  var fixture = true;
  player.getPlayerStandings(tourId,req.session.name,fixture,rounds,function(error,results){
    if (error) {
        throw error
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log(JSON.stringify(results)+"=========+++++++++++++++++_________________-------------------")
      res.send(JSON.stringify(results));
    }
  });
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<GET ALL PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.

router.post('/getAllPlayers',function(req,res){
  var tourId = req.body.tourId;
  console.log(tourId + "+================Tour Id"+req.session.name+"========================userId")
  player.getPlayers(req.session.name,tourId,function(error,results){
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('GET ALL PLAYERS++++++++++++++++++++++++++++++++++++++++++++++ ', results);
      res.render('getAllPlayer',{allPlayer : results});
    }
  });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/getFinalResult',function(req,res){
  var tourId = req.body.tourId;
  player.getFinalResult(tourId,function(error,results){
    if (error) {
      console.log("error ocurred",error);
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
  console.log(pid);
  player.deletePlayers(pid,function(error,results){
    if (error) {
      console.log("error ocurred",error);
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
