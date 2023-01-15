const express = require("express");
const morgan = require("morgan");
const app = express();
app.set("view engine", "ejs");
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

/////////////////////////////////////////
//////////MIDDLEWARES
/////////////////////////////////////////
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//Functions
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8)
};

const getUserByEmail = (email) => {
  for (const uid in usersDatabse) {
    if (usersDatabse[uid].email === email) {
        return usersDatabse[uid].id;
    }
  }
  return null;
};

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

const usersDatabse = {
    userRandomID: {
      id: "1snymq",
      email: "user@example.com",
      password: "purple-monkey-dinosaur",
    },
    user2RandomID: {
      id: "4upxwu",
      email: "test@lhl.com",
      password: "lhl",
    }
};

/////////////////////////////////////////
//////////ROUTES
/////////////////////////////////////////

// GET /
app.get("/", (req, res) => {
  res.send("Hello!");
});

// GET /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


// GET /urls
app.get("/urls", (req, res) => {
    const templateVars = { 
      urls: urlDatabase,
      user: usersDatabse[req.cookies["user_id"]]
  };
    res.render("urls_index", templateVars);
});


// GET /urls/new
app.get("/urls/new", (req, res) => {
    const templateVars = {
      user: usersDatabse[req.cookies["user_id"]]
    };
    if (!templateVars.user) {
        res.redirect("/login");
    }
    res.render("urls_new", templateVars);
});
  
// GET /urls/:id
app.get("/urls/:id", (req, res) => {
    if (!urlDatabase[req.params.id]) {
      res.send("This id does not exist!");
    }
    const templateVars = { 
      user: usersDatabse[req.cookies.userId],
      id: req.params.id, 
      longURL: urlDatabase[req.params.id]
  };
    res.render("urls_show", templateVars);
});


// GET /u/:id
app.get("/u/:id", (req, res) => {
    if (!urlDatabase[req.params.id]) {
      res.send("This id does not exist!");
    }
    const longURL = urlDatabase[req.params.id];
    res.redirect(longURL);
});


// GET /register
app.get("/register", (req, res) => {
  const templateVars = { 
    user: usersDatabse[req.cookies["user_id"]] 
  };
  if (templateVars.user) {
    res.redirect("/urls");
  }
  res.render("urls_register", templateVars);
});


// GET /login
app.get("/login", (req, res) => {
    const templateVars = {
      user: usersDatabse[req.cookies["user_id"]]
    };
    if (templateVars.user) {
      res.redirect("/urls");
    }
    res.render("urls_login", templateVars);
});


// POST /urls
app.post("/urls", (req, res) => {
  let currentUser = usersDatabse[req.cookies["user_id"]];
  if (!currentUser) {
    res.redirect("Please login");
  }

  const id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`urls/${id}`);
});


// POST /urls/:id/delete
app.post("/urls/:id/delete", (req, res) => {
  let currentUser = usersDatabse[req.cookies["user_id"]];
  if (currentUser) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.send("You cannot delete it!");
  }
});

// PUT /urls/:id
app.put("/urls/:id", (req,res) => {
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls`);
});

// POST /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user;
  if (user === null) {
    return res.status(403).send("Email does not exist!");
  }
  if (!user || user.password !== password) {
    return res.status(403).send("Incorrect email and/or password!");
  }
  res.cookie("user_id", user.id); 
  res.redirect(`/urls`);
});

// POST /logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// POST /register
app.post("/register", (req,res) => {
    const { email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).send("Missing email and/or password!");
    }
  
    if (getUserByEmail(email)) {
      return res.status(400).send("This email has already exist!");
    }
    
    const id = generateRandomString();
    usersDatabse[id] = {
        id,
        email,
        password
    };
    res.cookie("user_id", id);
    res.redirect("/urls");
  });


/////////////////////////////////////////
//////////SERVER LISTENING...
/////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});