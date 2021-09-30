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

module.exports = {
  generateRandomString,
  emailLookUp,
  passwordLookUp,
  userLookUp,
  urlsForUser
};
