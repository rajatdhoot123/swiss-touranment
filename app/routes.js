var player = require('../server/controller/tournament');
var bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = function(app, passport) {


    app.get('/', function(req, res) {
        if(req.isAuthenticated()){
            res.redirect('/tournament')
        }
        else{
        res.render('login',{title:'Form Validation', layout : false,message : req.flash('loginMessage')});
    }
    });


    app.get('/login', function(req, res) {
        res.render('login',{title:'Form Validation', layout : false,message: req.flash('loginMessage')})
    });



    app.post('/login', function(req, res, next) {
       passport.authenticate('local-login', { failureFlash : true }, function(err, user, info) {
           if (err) {
                res.status(500).send(JSON.stringify({
                   'msg': "Internal Server Error"
               }));
           }
           if (!user) {
               return res.render('login', {layout: false, message: req.flash('loginMessage') });
           }
           req.login(user, function(err) {
               if (err) return next(err);
               req.session.save(function(err) {
                   if (!err) {
                       return res.redirect('/tournament');
                   }
                   else {
                       console.log('error occured during session save');
                   }
               });
           });
       })(req, res, next);
   });


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
   app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            if (err) {
                 res.status(500).json({
                    msg: "Internal Server Error"
                });
            }
            if (!user) {
                return res.redirect('/');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                req.session.save(function(err) {
                    if (!err) {
                        res.redirect('/tournament');
                    }
                    else {
                        console.log('error occured during session save');
                    }
                });
            });
        })(req, res, next);
    });


app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

       app.get('/auth/facebook/callback', function(req, res, next) {
        passport.authenticate('facebook', function(err, user, info) {
            if (err) {
                 res.status(500).json({
                    msg: "Internal Server Error"
                });
            }
            if (!user) {
                return res.redirect('/');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                req.session.save(function(err) {
                    if (!err) {
                        res.redirect('/tournament');
                    }
                    else {
                        console.log('error occured during session save');
                    }
                });
            });
        })(req, res, next);
    });



    // route for logging out
    app.get('/logout', function(req, res) {
      console.log("Session Destroyed " + "=========================================================")
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });






    app.get('/tournament', isLoggedIn ,function(req, res) {
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




/*    app.get('/logout', function(req, res) {
      console.log("Session Reset Block " + "=========================================================")
      req.session.reset();
      res.redirect('/');
  });*/
/*    app.route('/login')

    .get(function(req, res) {
        res.render('login',{title:'Form Validation',success: false,errors : req.session.errors, layout : false,message: req.flash('loginMessage') })
    })
    */

    app.get('/inside_game/:id/:name/:status',isLoggedIn, function(req, res) {
        res.render('index1',{title: 'Tournament ',
            tourId : req.params.id,
            tourName : req.params.name,
            status : req.params.status,
            condition:false});
    });
}


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
