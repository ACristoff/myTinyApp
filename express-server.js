const express = require("express");
const app = express();
const PORT = 3001;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
    return Math.random().toString(16).substr(2, 6);
}

//EDGE CASES
//READ AND WRITE TO A FILE TO KEEP THE "DATABASE" PERSISTENT
//CREATE AN ACTUAL 404 PAGE
//SEND PROPER STATUS CODES
//HAVE GENERATE RANDOM STRING() CHECK IF THE STRING ALREADY EXISTS, IF SO RECURSIVELY RUN UNTIL A NEW ONE IS REACHED



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log('hello, this is the request', req.body) //log the post request to delete data to the console
  // console.log(req.body.shortURL)
  delete urlDatabase[req.body.shortURL]
  res.redirect(`/urls/`); 
})

// const Employee = {
//   firstname: 'John',
//   lastname: 'Doe'
// };

// console.log(Employee.firstname);
// // expected output: "John"

// delete Employee.firstname;

// console.log(Employee.firstname);
// // expected output: undefined

app.post("/urls", (req, res) => {
  // console.log(req.body, generateRandomString());  // Log the POST request body to the console
  // console.log(req.body)
  const newShort = generateRandomString()
  urlDatabase[newShort] = req.body.longURL
  console.log(urlDatabase)
  res.redirect(`/urls/${newShort}`);       // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // const shortURL = req.params.shortURL
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});