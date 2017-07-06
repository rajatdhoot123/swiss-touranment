var express = require('express');
var player = require('../controller/tournament');
var user = require('../controller/user');
var bodyParser = require('body-parser');
var parse = bodyParser.urlencoded({ extended: true });
var router = express.Router();
var session = require('express-session');


module.exports=function (){

  router.get('/',function(req,res){
    app.use(express.static(path.join(__dirname, '/index.html')));
    res.json({ message: 'welcome to Swiss Tournament' });
  });


  /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/registerPlayers', parse ,function(req,res){
    var players = req.body;
    console.log(players);
    player.registerPlayers(players,function(err,result){
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
  });

    /*<<<<<<<<<<<<<<<<<<<Register Players>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

    /*<<<<<<<<<<<<<<<<<<<LOGIN USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  router.post('/loginUser', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("=================================")
    user.loginUser(email,password,function(err,result){
      if (err) {
        res.send({
        "invalid":"Who You Are You Are Not Authoonticate user",
        "code":400,
        "failed":err
        })
      }else{
        req.session.name=result[0].email;
        console.log(req.session.name + "=======================================");
        //res.cookie('user','email',{signed:true});
        res.redirect('/tournament')
      }
    });
  });


/*  <<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/



    router.get('/getPlayerStandings', function(req, res) {
    player.getPlayerStandings(function(err,result){
      if (err) {
        res.send({
        "invalid":"Who You Are You Are Not Authoonticate user",
        "code":400,
        "failed":err
        })
      }else{
        console.log(result + "=======================================");
        //res.cookie('user','email',{signed:true});
        res.redirect('/')
      }
    });
  });


 /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


    /*<<<<<<<<<<<<<<<<<<<LOGIN USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

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
        res.send({
          "code":200,
          "success":"user registered sucessfully"
        });
      }
    });
  });
  /*<<<<<<<<<<<<<<<<<<<REGISTER USER>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

  /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
router.get('/currentStatus', function (req, res) {
    player.currentStatus(function(err,result){
      if (err) {
        console.log("error ocurred",err);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        console.log('The solution is: ', result);

        res.render('currentstatus',{current:result});
        /*res.send({
          "code":200,
          "success":"user registered sucessfully"
        });*/
      }
    });
  });

 /*<<<<<<<<<<<<<<<<<<<CURRENT STATUS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

 /*<<<<<<<<<<<<<<<<<<<Sub Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
  router.post('/subtournament',parse,function(req,res){
    var id = req.body.id;
    var tour_name = req.body.tour_name;

    console.log(id,tour_name+"==========================");
    user.subTournament([tour_name],[id],function(error,results){
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
    player.displayPlayers(function(error,results){
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

/*<<<<<<<<<<<<<<<<<<<Sub Tournament COunt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
return router;
}
