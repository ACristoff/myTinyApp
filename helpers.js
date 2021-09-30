const bcrypt = require('bcryptjs');

//HELPER FUNCTIONS

//Generates a random string
const generateRandomString = function() {
  return Math.random().toString(16).substr(2, 6);
};

//looks up an email and returns true or false
const emailLookUp = function(data, emailToFind) {
  for (const user in data) {
    if (data[user].email === emailToFind) {
      return true;
    }
  }
  return false;
}

//checks to see if two passwords match from the database, target user, and the inputted password
const passwordLookUp = function(data, passwordToFind, targetUser) {
  if (bcrypt.compareSync(passwordToFind, data[targetUser].password)) {
    return true;
  }
  return false;
}

//returns a user based on an email
const userLookUp = function(data, userEmail) {
  for (const user in data) {
    if (data[user].email === userEmail) {
      console.log(user);
      return user;
    }
  }
}

//generates an object of urls for the logged in user
function urlsForUser(id, data) {
  const userURLs = {};
  for (link in data) {
    if (data[link].userID === id) {
      userURLs[link] = {};
      userURLs[link].longURL = data[link].longURL;
    }
  }
  return userURLs;
}

module.exports = {
  generateRandomString,
  emailLookUp,
  passwordLookUp,
  userLookUp,
  urlsForUser
};
