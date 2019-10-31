const express = require('express');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const queryJS = require('./services/query');
const app = express();
const session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:mint1213@localhost:5432/greetings';

const pool = new Pool({
  connectionString,
  ssl : useSSL
});

const QueryJS = queryJS(pool)

 app.use(session({
  secret : "12345",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: 'some/path',
  layoutsDir: 'views/layouts',
}));

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async function (req, res) {
res.send('Test this works')
});


let PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});