var express = require('express');
var morgan = require('morgan');
var player = require('./server/controller/tournament');
var user = require('./server/controller/user');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const api = require('./server/routes/api')();
var path = require('path');
var app = express();
var session = require('express-session');
var parse = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({ secret: 'winter is coming' ,resave:'false',saveUninitialized :'true',cookie : 'maxAge: 1000*60*2'}));
var router = express.Router();
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'));

app.use(express.static(path.join(__dirname,'/public')));


app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
});



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});



app.get('/tournament', checkSignIn, function(req, res) {
        res.status(200).sendFile(path.join(__dirname + '/views/tournament.html'));
});


/*app.get('/currentStatus', function(req, res) {
        res.status(200).sendFile(path.join(__dirname + '/views/currentstatus.html'));
});*/


app.route('/register')

    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/views/register.html'));
    })

    .post(function(req, res) {
        console.log('processing');
        res.send('processing the registration form!');
    })

app.route('/login')

    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/views/login.html'));
    })

app.route('/inside_game')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname + '/views/inside_game.html'));
    })


function checkSignIn(req, res, next){
    if(req.session.name){
        next();     //If session exists, proceed to page
    }
    else {
        var err = new Error("Not logged in!");
        res.status(404).send('You are not allowed to access')
    }
}

app.get('/logout', function(req,res){
 req.logOut();
 req.session.destroy(function (err) {
        console.log("COOKIE DELETED");
        res.redirect('/');
    });
});




// router.post('/register',login.register);
// router.post('/login',login.login)
// router.post('/tournament',login.subtournament)
// router.post('/registerPlayers',login.registerPlayers)
app.use('/api',api);
app.listen(3050);