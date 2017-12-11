const express = require('express');
const app = express();
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const exphbs = require('express-handlebars');
const path = require('path');
var db = require('./models');

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }


app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({ secret: "civiDiscSession", saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(Date);
require('./config/passport.js')(passport, db.User);
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});


require('./controllers/homeController')(app, passport);
require('./controllers/userController')(app, passport);
require('./controllers/postController')(app, passport);
require('./controllers/voteController')(app, passport);
const port = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(port);
})