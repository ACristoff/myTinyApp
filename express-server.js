const express = require("express");
const app = express();
const PORT = 3001;

const cookieParser = require('cookie-parser')
 
app.use(cookieParser())

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



//EDGE CASES
//READ AND WRITE TO A FILE TO KEEP THE "DATABASE" PERSISTENT
//CREATE AN ACTUAL 404 PAGE
//SEND PROPER STATUS CODES
//HAVE GENERATE RANDOM STRING() CHECK IF THE STRING ALREADY EXISTS, IF SO RECURSIVELY RUN UNTIL A NEW ONE IS REACHED

//HELPER FUNCTIONS

function generateRandomString() {
  return Math.random().toString(16).substr(2, 6);
}


//these next 3 functions can be refactored into one, investigate later
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
    // console.log(users[user].email, emailToFind)
    if (users[user].password === passwordToFind) {
      return true
    }
  }
  return false
}

function userLookUp(data, userEmail) {
  for (const user in data) {
    // console.log(users[user].email, emailToFind)
    if (users[user].email === userEmail) {
      return user
    }
  }
}

//GLOBAL OBJECTS

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "hello@hello.hello",
    password: "123"
  }
}

//Starting pages, fix later ???

app.get("/", (req, res) => {
  res.send("Hello!");
});



//
//// POSTS
//

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('hello, this is the request', req.body) //log the post request to delete data to the console
  // console.log(req.body.shortURL)
  delete urlDatabase[req.body.shortURL]
  res.redirect(`/urls/`); 
})

app.post("/urls", (req, res) => {
  // console.log(req.body, generateRandomString());  // Log the POST request body to the console
  // console.log(req.body)
  const newShort = generateRandomString()
  urlDatabase[newShort] = req.body.longURL
  console.log(urlDatabase)
  res.redirect(`/urls/${newShort}`);       // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body)
  urlDatabase[req.body.shortURL] = req.body.longURL
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
  users[newID].password = req.body.password
  // console.log(users)
  res.cookie("user_id", newID)
  res.redirect(`/urls`)
})

app.post("/login", (req, res) => {
  console.log(req.body)
  if (emailLookUp(users, req.body.email) === false) {
    res.status(403).send('Bad credentials')
  } 
  if (passwordLookUp(users, req.body.password) === false) {
    res.status(403).send('Bad credentials')
  }
  const setid = userLookUp(users, req.body.email)
  res.cookie("user_id", setid)
  // res.cookie("username", req.body.username);
  res.redirect(`/urls`)
})

app.post("/logout", (req, res) => {
  console.log(req.body)
  res.clearCookie('user_id')
  res.redirect(`/urls`)
})


//
//// GETS
//

app.get("/urls/new", (req, res) => {
  const templateVars = { users, userid: req.cookies["user_id"] };
  res.render("urls_new", templateVars);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, users, userid: req.cookies["user_id"]};
  res.render("urls_index", templateVars);
});

app.get(`/register`, (req, res) => {
  const templateVars = {users, userid: req.cookies["user_id"]}
  res.render('register', templateVars)
})

app.get(`/login`, (req, res) => {
  const templateVars = {users, userid: req.cookies["user_id"]}
  res.render('login', templateVars)
})

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!', users};
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // const shortURL = req.params.shortURL
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], users, userid: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});