
const { getUserByEmail, generateRandomString, urlsForUser } = require("./helpers");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.set("view engine", "ejs");
const PORT = 8080; // default port 8080
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");


/////////////////////////////////////////
//////////MIDDLEWARES
/////////////////////////////////////////
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
      name: "session",
      keys: ["secretkeys"]
}));

/////////////////////////////////////////
//////////DATABASE
/////////////////////////////////////////

const urlDatabase = {
    b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW",
    },
    i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW",
    },
};

const usersDatabase = {
    sn1ymq: {
      id: "sn1ymq",
      email: "user@example.com",
      password: "purple-monkey-dinosaur",
    },
    up4xwu: {
      id: "up4xwu",
      email: "test@lhl.com",
      password: "lhl",
    },
};

/////////////////////////////////////////
//////////ROUTES
/////////////////////////////////////////

// GET /
app.get("/", (req, res) => {
  let templateVars = {
    urls: urlDatabase, 
    user: usersDatabase[req.session.user_id] 
};
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


// GET /urls
app.get("/urls", (req, res) => {
  let userID = req.session.user_id;
  let urls = urlsForUser(userID, urlDatabase);

  if (!userID) {
    return res.status(400).send("Please login to view!");
  }

  const templateVars = {
    urls: urls,
    user: usersDatabase[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

// GET /urls/new
app.get("/urls/new", (req, res) => {
    const templateVars = {
      user: usersDatabase[req.session.user_id]
    };
    if (!templateVars.user) {
        res.redirect("/login");
    }
    res.render("urls_new", templateVars);
});
  
  
// GET /urls/:id
app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
      return res.send("This url does not exist");
   }; 
    const templateVars = {
      id: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      user: usersDatabase[req.session.user_id]
    };
    if (urlDatabase[templateVars.id].userID !== templateVars.user.id) {
      return res.send("You are not own this URL");
    }
    res.render("urls_show", templateVars);
});


// GET /u/:id   
app.get("/u/:id", (req, res) => {
    if (urlDatabase[req.params.id]) {
      res.redirect(urlDatabase[req.params.id].longURL);
   } else {
     res.status(404).send("This url does not exist!");
   }  
});

// GET /login
app.get("/login", (req, res) => {
    const templateVars = {
      user: usersDatabase[req.session.user_id]
    };
    if (templateVars.user) {
      res.redirect("/urls");
    }
    res.render("urls_login", templateVars);
});


// POST /urls
app.post("/urls", (req, res) => {
    let user = usersDatabase[req.session.user_id];

    if (!user) {
      return res.status(401).send("Please login to shorten a URL.");
    }
    const ID = generateRandomString();
    urlDatabase[ID] = {
      longURL: req.body.longURL,
      userID: user.id
    };
    res.redirect(`/urls/${ID}`);
  });

// POST /urls/:id/delete **
app.post("/urls/:id/delete", (req, res) => {
  let currentUser = usersDatabase[req.session.user_id];
  if (currentUser) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send("You cannot delete it!");
  }
});

// POST /urls/:id
app.post("/urls/:id", (req,res) => {
const id = req.params.id;
const longURL = req.body.longURL;
  if (
    users[req.session.user_id] &&
    req.session.user_id === urlDatabase[id].userID
)   {
    urlDatabase[id].longURL = longURL;
     res.redirect("/urls");
 } else {
  res.status(401).send("You cannot Access the page");
}
});

// POST /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user;
  if (user === null) {
    return res.status(403).send("Email does not exist!");
  }
  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(403).send("Incorrect email and/or password!");
  }
  res.session.user_id = user.id; 
  res.redirect(`/urls`);
});


// POST /logout
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
}); 

// GET /register
app.get("/register", (req, res) => {
    if (!usersDatabase[req.session.user_id]) {
        const templateVars = {
          user: usersDatabase[req.session.user_id],
        };
        res.render("urls_register", templateVars);
      }
      res.redirect("/urls");
    });

// POST /register
app.post("/register", (req,res) => {
    const { email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (!email || !password) {
      return res.status(400).send("Missing email and/or password!");
    }
  
    if (getUserByEmail(email, usersDatabase)) {
      return res.status(400).send("This email has already exist!");
    }
    
    const id = generateRandomString();
    usersDatabase[id] = {
        id: id,
        email,
        password: hashedPassword
    };
    req.session.user_id = id;
    res.redirect("/urls");
});




/////////////////////////////////////////
//////////SERVER LISTENING...
/////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});