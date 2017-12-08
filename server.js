const express = require('express');
const app = express();
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const exphbs = require('express-handlebars');


var db = require('./models');


app.use(express.static("public"));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({ secret: "civiDiscSession", saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./controllers/homeController')(app, passport);
require('./controllers/authController')(app, passport);

require('./config/passport.js')(passport, db.User);
const port = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(port);
})