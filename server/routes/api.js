var express = require('express');
var player = require('../controller/tournament');
var user = require('../controller/user');
var bodyParser = require('body-parser');
var parse = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var session = require('express-session');
var a = 0;
module.exports=function (){

  router.get('/',function(req,res){
    app.use(express.static(path.join(__dirname, '/index.html')));
    res.json({ message: 'welcome to Swiss Tournament' });
  });


  /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/registerPlayers', parse ,function(req,res){
    var players = req.body.player_name;
    var tourId = req.body.tourId;
    player.registerPlayers(players,tourId,a,function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        res.redirect('/inside_game/'+tourId);
      }
    });
  });

    /*<<<<<<<<<<<<<<<<<<<Update Player Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
/*
    router.get('/:id',function(req,res){
        var id = req.params.id;
        player.insertPlayers(id,function(err,result){
        if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
        }else{
        console.log('The solution is: ', result);
        //res.redirect('/inside_game')
      }
    });

    })*/


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
        a = result[0].user_id;
        req.session.name=result[0].user_id;
        console.log(req.session.name + "=======================================");
        //res.cookie('user','email',{signed:true});
        res.redirect('/tournament')
      }
    });
  });

 /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


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
router.post('/currentStatus', function (req, res) {
  console.log("Current Status Called");
  var tourId = req.body.tourId;
  console.log(tourId);
    player.currentStatus(a,tourId,function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is:------------------------------------ ', result);

        res.render('currentstatus',{current:result});
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
      }
    });
  });

 /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/



   router.post('/getPlayers',function(req,res){
    player.getPlayers(a,function(error,results){
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('App Players Selected ', results);
        res.render('tournament',{allPlayer : results});
      }
    });
  });

 /*<<<<<<<<<<<<<<<<<<<User Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/usertournament',parse,function(req,res){
    var tour_name = req.body.tour_name;
    player.userTournament([tour_name],[a],function(error,results){
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('Tournament Created ', results);
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
        res.redirect('/tournament');
      }
    });
  });


/*<<<<<<<<<<<<<<<<<<<Sub Tournament Count>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/sub_tour_count',function(req,res){
    player.displayTournament(a,function(error,results){
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('Player Counted ', results);

        res.render('tournament',{tour:results});
      }
    });
  });


//<<<<<<<<<<<<<<<<<<<<<<<GET PLAYERS STANDING>>>>>>>>>>>>>>>>>>>>>>



router.post('/getPlayerStandings',function(req,res){
  console.log('Current Players');


  var tourId = req.body.tourId;
  var rounds = req.body.rounds;

  console.log(tourId + "===========tour Id=================" + rounds + "=============rounds=========");
  var fixture = false;
  player.getPlayerStandings(tourId,a,fixture,rounds,function(error,results){
    if (error) {
      console.log("error ocurred",error);
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
  console.log('Current Players');
  var rounds = Math.log2(req.body.rounds);
  var tourId = req.body.tourId;
  var fixture = true;
  player.getPlayerStandings(tourId,a,fixture,rounds,function(error,results){
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log(results.length+"==========================================");
      res.render('fixture',{fixture:results});
    }
  });
});



/*
router.post('/getSwissPairings',function(req,res){
  console.log('SWISS PAIRING');
  var tourId = req.body.tourId;
  player.getPlayerStandings(tourId,a,function(error,results){
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('HERE IS YOUR SWISS PAIRING', pairing);
      res.render(('allPlayers',{allPlayer : results}),
            ('allPlayers',{pairing : pairing})
        );
    }
  });
});

*/


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<GET ALL PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.





router.post('/getAllPlayers',function(req,res){
  console.log("Get Players")
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
      console.log('GET ALL PLAYERS ', results);
      res.render('getAllPlayer',{allPlayer : results});
    }
  });
});



/*<<<<<<<<<<<<<<<<<<<Sub Tournament COunt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
return router;
}
