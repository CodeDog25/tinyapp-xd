///////HELPERS///////////

//find user by email
const getUserByEmail = (email, database) => {
    for (const userID in database) {
      if (database[userID].email === email) {
          return database[userID].id;
      }
    }
    return false;
  };

//generate unique id
const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8)
  };
  
  
//get userID
const urlsForUser = (id, urlDatabase) => {
      let userURL = {};
      for (const key in urlDatabase) {
        if (urlDatabase[key].userID === id) {
          userURL[key] = urlDatabase[key];
      }
    }   
    return userURL;
  };


  module.exports = {
    getUserByEmail,
    generateRandomString,
    urlsForUser
  };