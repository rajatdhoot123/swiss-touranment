var player = require('../server/controller/tournament');
var user = require('../server/controller/user');
var bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = function(app, passport) {


    app.get('/', function(req, res) {
        res.render('login',{title:'Form Validation',success: false,errors : req.session.errors, layout : false})
        req.session.errors = null;
    });


    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login',{title:'Form Validation',success: false,errors : req.session.errors, layout : false,message: req.flash('loginMessage')})
    });


    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/tournament', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
    function(req, res) {
        console.log(console.log(req.cookie + "+++++++++++++++++++++++++++++"));
        if (req.body.password === user.password) {
            req.session.user = user;
            res.redirect('/tournament')
        }else {
          req.session.cookie.expires = false;
      }
      res.redirect('/');
  });


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/tournament',
            failureRedirect : '/login'
    }));


app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/tournament',
            failureRedirect : '/login'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });






    app.get('/tournament', function(req, res) {
        res.render('tournament.hbs',{title: 'Tournament ',layout : "newLayout",
            userId : req.session.passport.user
        });
    });



    app.get('/register', function(req, res) {
        res.render('register',{title:'Form Validation',success: false,errors : req.session.errors, layout : false,message: req.flash('signupMessage')})
    });

    // process the signup form
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));




    app.get('/logout', function(req, res) {
      req.session.reset();
      res.redirect('/');
  });
/*    app.route('/login')

    .get(function(req, res) {
        res.render('login',{title:'Form Validation',success: false,errors : req.session.errors, layout : false,message: req.flash('loginMessage') })
    })
    */

    app.get('/inside_game/:id/:name/:status', function(req, res) {
        res.render('index1',{title: 'Tournament ',
            tourId : req.params.id,
            tourName : req.params.name,
            status : req.params.status,
            condition:false});
    });


    function checkSignIn(req, res, next){
        if(req.session.name){
        next();     //If session exists, proceed to page
    }
    else {
        var err = new Error("Not logged in!");
        res.status(404).send('You are not allowed to access')
    }
}
}

