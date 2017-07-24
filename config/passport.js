var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var configAuth = require('./auth');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);



module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log(JSON.stringify(user)  + "+++++++++++++++++++++++++++++++++++=")
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("select * from users where id = " + id,function(err,rows){
            done(err, rows[0]);
        });
    });


    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        email: email,
                        password: bcrypt.hashSync(password, saltRounds)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.email, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );




    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                console.log(rows)
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );




    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },



    function(token, refreshToken, profile, done) {

        var email = profile.email;

        process.nextTick(function() {

            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, user) {
                if (err){
                    return done(err);
                }
                if (user.length > 0) {
                    console.log(user)
                    return done(null,user[0]);
                } else {

                    var newUserMysql = new Object();
                    newUserMysql.email = email;
                    var password = 'TopSecrateMission'

                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
                    console.log(email , "+==========================");
                    connection.query(insertQuery,[email, password],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        console.log(err, "error");
                        console.log(rows, "rows");
                        return done(null, newUserMysql);
                    });
                }
            });
        });
    }));


    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email']

    },

    function(token, refreshToken, profile, done) {

        var email = profile.emails[0].value;

        process.nextTick(function() {

            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, user) {
                if (err){
                    return done(err);
                }
                if (user.length > 0) {
                    console.log(user)
                    return done(null,user[0]);
                } else {

                    var newUserMysql = new Object();
                    newUserMysql.email = email;
                    var password = 'TopSecrateMission'

                    var insertQuery = "INSERT INTO users ( email, password ) values (?,?)";
                    connection.query(insertQuery,[email, password],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        console.log(err, "error");
                        console.log(rows, "rows");
                        return done(null, newUserMysql);
                    });
                }
            });
        });
    }));
};
