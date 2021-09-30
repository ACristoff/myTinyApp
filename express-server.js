const express = require("express");
const app = express();
const PORT = 3001;

//dependencies
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

//helper functions, refer to helpers.js
const { generateRandomString, emailLookUp, passwordLookUp, userLookUp, urlsForUser } = require('./helpers.js');

//dependencies
app.use(cookieSession({
  name: 'session',
  keys: ['test'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//EDGE CASES/FUNCTIONS/FUTURE FEATURES
//READ AND WRITE TO A FILE TO KEEP THE "DATABASE" PERSISTENT
//CREATE AN ACTUAL 404 PAGE
//HAVE GENERATE RANDOM STRING() CHECK IF THE STRING ALREADY EXISTS, IF SO RECURSIVELY RUN UNTIL A NEW ONE IS REACHED
//TIMESTAMPS OF LATEST VISITS
//UNIQUE VISITOR TRACKING
//METHOD OVERRIDE

//SEND PROPER STATUS CODES // DONE
//COUNTER FOR URL VISITS //DONE


//GLOBAL OBJECTS
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
    viewsTotal: 0
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
    viewsTotal: 10
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$8H4Wfcwa4xTkg8BkHyce0uJoKqtkfaQf9iTG3dt4eFpHn9CDIlS7a"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$tNdp0ybbUMDaVGkHJQEpI.87ny5O4iah0dNfeCos0rZEe1L2red0K"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "hello@hello.hello",
    password: "$2a$10$8hWttZ.mF19RfGbfZxPaseqpcvrnbpWK5.OGmJGXhXR5n6/UlRfRq"
  }
};

//Starting pages, fix later ???
app.get("/", (req, res) => {
  res.send("Hello!");
});


//
//// POSTS
//


app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.');
    return;
  }
  if (req.session.user_id !== urlDatabase[req.body.shortURL].userID) {
    res.status(401).send('Unauthorized. You do not have authorization to delete or edit this link');
    return;
  }
  delete urlDatabase[req.body.shortURL];
  res.redirect(`/urls/`);
});

app.post("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(400).send('You are not logged in. Only registered users can create links');
  }
  const newShort = generateRandomString();
  urlDatabase[newShort] = {};
  urlDatabase[newShort].longURL = req.body.longURL;
  urlDatabase[newShort].userID = req.session.user_id;
  urlDatabase[newShort].viewsTotal = 0;
  res.redirect(`/urls/${newShort}`);
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.');
    return;
  }
  if (req.session.user_id !== urlDatabase[req.body.shortURL].userID) {
    res.status(401).send('Unauthorized. You do not have authorization to delete or edit this link');
    return;
  }
  urlDatabase[req.body.shortURL].longURL = req.body.longURL;
  res.redirect(`/urls/`);
});

app.post(`/register`, (req, res) => {
  // checks for empty fields and returns 400 if true
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    console.log('uh oh empty fields!');
    res.status(400).send('Bad Request');
    return;
  }
  //checks for existing email and returns 400 if true
  if (emailLookUp(users, req.body.email)) {
    console.log('uh oh email already exists!');
    res.status(400).send('Bad Request');
    return;
  }
  const newID = generateRandomString();
  users[newID] = {};
  users[newID].id = newID;
  users[newID].email = req.body.email;
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[newID].password = hashedPassword;
  req.session.user_id = newID;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  if (emailLookUp(users, req.body.email) === false) {
    res.status(403).send('Bad credentials');
  }
  const setid = userLookUp(users, req.body.email);
  if (passwordLookUp(users, req.body.password, setid) === false) {
    res.status(403).send('Bad credentials');
  }
  req.session.user_id = setid;
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});


//
//// GETS
//

app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.');
    return;
  }
  const templateVars = { users, userid: req.session.user_id };
  res.render("urls_new", templateVars);
});


app.get("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.');
    return;
  }
  const myLinks = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = { urls: myLinks, users, userid: req.session.user_id};
  res.render("urls_index", templateVars);
});

app.get(`/register`, (req, res) => {
  const templateVars = {users, userid: req.session.user_id};
  res.render('register', templateVars);
});

app.get(`/login`, (req, res) => {
  console.log(req.session.user_id);
  const templateVars = {users, userid: req.session.user_id};
  res.render('login', templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!', users};
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect('/login');
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userid: req.session.user_id, totalViews: urlDatabase[req.params.shortURL].viewsTotal};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send('This link does not exist');
  }
  urlDatabase[req.params.shortURL].viewsTotal += 1;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});