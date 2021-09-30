const express = require("express");
const app = express();
const PORT = 3001;

const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['test'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
 
app.use(cookieParser())

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const bcrypt = require('bcryptjs');

const morgan = require('morgan');
app.use(morgan('dev'));
// const password = "dishwasher-funk"; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);

// console.log(hashedPassword)

//EDGE CASES
//READ AND WRITE TO A FILE TO KEEP THE "DATABASE" PERSISTENT
//CREATE AN ACTUAL 404 PAGE
//SEND PROPER STATUS CODES
//HAVE GENERATE RANDOM STRING() CHECK IF THE STRING ALREADY EXISTS, IF SO RECURSIVELY RUN UNTIL A NEW ONE IS REACHED

//HELPER FUNCTIONS

function generateRandomString() {
  return Math.random().toString(16).substr(2, 6);
}


//these next 3 functions can be refactored into one, investigate later, until then my code is a little wet
function emailLookUp(data, emailToFind) {
  for (const user in data) {
    // console.log(users[user].email, emailToFind)
    if (users[user].email === emailToFind) {
      return true
    }
  }
  return false
}

function passwordLookUp(data, passwordToFind) {
  for (const user in data) {

    if (bcrypt.compareSync(passwordToFind, users[user].password)) {
      return true
    }; 
    // returns true
    // console.log(users[user].email, emailToFind)
    // if (users[user].password === passwordToFind) {
    //   return true
    // }
  }
  return false
}

function userLookUp(data, userEmail) {
  for (const user in data) {
    // console.log(users[user].email, emailToFind)
    if (data[user].email === userEmail) {
      return user
    }
  }
}

//generates an object of urls for the logged in user
function urlsForUser(id) {
  const userURLs = {}
  for (link in urlDatabase) {
    if (urlDatabase[link].userID === id) {
      // console.log(link)
      userURLs[link] = {}
      userURLs[link].longURL = urlDatabase[link].longURL
    }
  }
  // console.log(userURLs)
  return userURLs;
}


//GLOBAL OBJECTS

//NEW DATABASE OBJECT YEAH WOOOO LOVE IT!!!
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

// const urlDatabase= {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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
}

//Starting pages, fix later ???

app.get("/", (req, res) => {
  res.send("Hello!");
});



//
//// POSTS
//

// To set the user_id key on a session, write:

// req.session.user_id = "some value";

// To read a value, write:

// req.session.user_id


app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.')
    return;
  }
  if (req.session.user_id !== urlDatabase[req.body.shortURL].userID) {
    res.status(401).send('Unauthorized. You do not have authorization to delete or edit this link')
    return;
  }
  // console.log('hello, this is the request', req.body) //log the post request to delete data to the console
  // console.log(req.body.shortURL)
  delete urlDatabase[req.body.shortURL]
  res.redirect(`/urls/`); 
})

app.post("/urls", (req, res) => {
  // console.log((req.cookies['user_ID'] === undefined))
  if (req.session.user_id === undefined) {
    res.status(400).send('You are not logged in. Only registered users can create links')
  }
  // console.log(req.body, generateRandomString());  // Log the POST request body to the console
  // console.log(req.body)
  const newShort = generateRandomString()
  urlDatabase[newShort] = {}
  urlDatabase[newShort].longURL = req.body.longURL
  urlDatabase[newShort].userID = req.session.user_id
  // urlDatabase[newShort] = req.body.longURL
  // console.log(urlDatabase)
  res.redirect(`/urls/${newShort}`);       // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL", (req, res) => {
  // console.log(req.body)
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.')
    return;
  }
  if (req.session.user_id !== urlDatabase[req.body.shortURL].userID) {
    res.status(401).send('Unauthorized. You do not have authorization to delete or edit this link')
    return;
  }
  urlDatabase[req.body.shortURL].longURL = req.body.longURL
  res.redirect(`/urls/`)
})

app.post(`/register`, (req, res) => {
  // checks for empty fields and returns 400 if true
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    console.log('uh oh empty fields!')
    res.status(400).send('Bad Request')
    return;
  }
  //checks for existing email and returns 400 if true
  if (emailLookUp(users, req.body.email)) {
    console.log('uh oh email already exists!')
    res.status(400).send('Bad Request')
    return;
  }
  const newID = generateRandomString()
  users[newID] = {}
  users[newID].id = newID
  users[newID].email = req.body.email
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[newID].password = hashedPassword
  // console.log(users)
  req.session.user_id = newID
  // res.cookie("user_id", newID)
  res.redirect(`/urls`)
})

app.post("/login", (req, res) => {
  // console.log(req.body)
  if (emailLookUp(users, req.body.email) === false) {
    res.status(403).send('Bad credentials')
  } 
  if (passwordLookUp(users, req.body.password) === false) {
    res.status(403).send('Bad credentials')
  }
  const setid = userLookUp(users, req.body.email)
  // res.cookie("user_id", setid)
  req.session.user_id = setid
  // res.cookie("username", req.body.username);
  res.redirect(`/urls`)
})

app.post("/logout", (req, res) => {
  // console.log(req.body)
  req.session = null
  res.redirect(`/urls`)
})


//
//// GETS
//

app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.')
    return;
  }
  const templateVars = { users, userid: req.session.user_id };
  res.render("urls_new", templateVars);
});


app.get("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    res.status(401).send('Unauthorized. Please sign in.')
    return;
  }
  myLinks = urlsForUser(req.session.user_id);
  // console.log(myLinks)
  const templateVars = { urls: myLinks, users, userid: req.session.user_id};
  res.render("urls_index", templateVars);
});

app.get(`/register`, (req, res) => {
  const templateVars = {users, userid: req.session.user_id}
  res.render('register', templateVars)
})

app.get(`/login`, (req, res) => {
  console.log(req.session.user_id)
  const templateVars = {users, userid: req.session.user_id}
  res.render('login', templateVars)
})

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!', users};
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === undefined) {
    res.redirect('/login')
    return;
  }
  // const shortURL = req.params.shortURL
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, users, userid: req.session.user_id};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(404).send('This link does not exist')
  }
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});