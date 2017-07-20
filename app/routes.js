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
        console.log("hello");
          if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
/*            req.session.name=result[0].user_id;
            res.redirect('/tournament/'+req.session.name)*/
              res.redirect('/')
          }else {
          req.session.cookie.expires = false;
      }
      res.redirect('/');
    });



    app.get('/tournament', function(req, res) {
        console.log(user)
        res.render('tournament.hbs',{title: 'Tournament ',layout : "newLayout",
            userId : req.params.uid
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


    app.route('/login')

    .get(function(req, res) {
        res.render('login',{title:'Form Validation',success: false,errors : req.session.errors, layout : false})
    })


    app.get('/inside_game/:id/:name/:status', checkSignIn, function(req, res) {
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

