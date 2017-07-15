var express = require('express');
var morgan = require('morgan');
var player = require('./server/controller/tournament');
var user = require('./server/controller/user');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const api = require('./server/routes/api')();
var hbs = require('express-handlebars');
var path = require('path');
var app = express();
var session = require('express-session');
var parse = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
var router = express.Router();
/*app.set('view engine', 'ejs');*/
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));

var FileStore = require('session-file-store')(session);


/*app.engine('handlebars',hbs({layoutsDir : __dirname + '/views'}));
app.set('views', path.join(__dirname, '/views'));*/

/*app.engine('handlebars',hbs({defaultLayout : 'layouts.handlebars', layoutsDir : __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, '/views'));*/
/*app.set('view engine', 'ejs');*/


app.engine('hbs',hbs({extname:'hbs',defaultLayout : 'layouts',layoutsDir : __dirname + '/views/layouts/'}))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

app.use(session({
    secret: 'My secret coming',
    //store: new FileStore(),
    resave:'true',
    saveUninitialized: true,
    cookie : 'maxAge: 1000*60*2'}));

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


/*app.get('/inside_game', checkSignIn, function(req, res) {
        res.status(200).sendFile(path.join(__dirname + '/views/inside_game.html'));
});
*/


app.get('/inside_game/:id/:name', checkSignIn, function(req, res) {
    res.render('index1',{title: 'Tournament ',
        tourId : req.params.id,
        tourName : req.params.name,
        condition:false});
    //res.status(200).sendFile(path.join(__dirname + '/views/inside_game.html'));
    /*res.render(path.join(__dirname + '/views/inside_game.ejs'),
    {'tourId' : req.params.id});*/
});


app.get('/startMatch',checkSignIn, function(req, res) {
    tour_id = req.params.id;
    res.status(200).sendFile(path.join(__dirname + '/views/tourdetail.html'));
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

app.get('/logout', function(req,res){
 req.session.destroy(function (err) {
    console.log("COOKIE DELETED");
    res.redirect('/');
});
});

app.use('/api',api);
app.listen(3000);
