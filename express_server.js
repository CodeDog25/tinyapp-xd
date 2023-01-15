const express = require("express");
const morgan = require("morgan");
const app = express();
app.set("view engine", "ejs")
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

/////////////////////////////////////////
//////////MIDDLEWARES
/////////////////////////////////////////
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//Function
const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8)
};
/////////////////////////////////////////
//////////DATABASE
/////////////////////////////////////////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
    userRandomID: {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur",
    },
    user2RandomID: {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "dishwasher-funk",
    },
  };

/////////////////////////////////////////
//////////ROUTES
/////////////////////////////////////////

// *GET /
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.userId]
};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.userId],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id]
};
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.userId] 
};
  res.render("urls_register", templateVars);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`urls/${id}`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req,res) => {
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  res.cookie("userId", req.body);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/urls");
});

app.post("/register", (req,res) => {
  const id = generateRandomString();
  const user = {
    id,
    email, 
    password 
};
  users[id] = user;
  res.cookie("user_id", id);
  res.redirect("/urls");
});

/////////////////////////////////////////
//////////SERVER LISTENING...
/////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});