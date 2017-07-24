var express = require('express');
var morgan = require('morgan');
var player = require('./server/controller/tournament');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const api = require('./server/routes/api')();
var hbs = require('express-handlebars');
var path = require('path');
var app = express();
var expressValidator = require('express-validator');
var expressSession = require('express-session');
//var session = require('express-session');
var parse = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
var passport = require('passport');
var flash    = require('connect-flash');
require('./config/passport')(passport);
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));

var FileStore = require('session-file-store')(expressSession);

var file = {
    path : './temp/session',
    userAsync : 'true',
    reapInterval : 5000,
    maxAge : 1000*60*2
}


app.engine('hbs',hbs({extname:'hbs',defaultLayout : 'layouts',layoutsDir : path.resolve( __dirname + '/views/layouts/')}))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

app.use(expressValidator());
app.use(cookieParser())
app.use(expressSession({
    store:new FileStore(file),
    secret: 'My secret coming',
    resave: false,
    saveUninitialized: false,
    cookie : 'maxAge: 1000*60*2'})
);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./app/routes.js')(app, passport);


app.use('/api',api);
app.listen(3000);

exports.closeServer = function(){
  server.close();
};
