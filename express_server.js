var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())


app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log("cookies: ", req.cookies)
  console.log("users", users)
  //req.cookies.username
  let templateVars = {
    urls: urlDatabase,
    //username: req.cookies.username,
    user: users[req.cookies.user_id]
  };

  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]};
  console.log("templatevars", templateVars);
  res.render("urls_new",templateVars);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters

  let shortURL=generateRandomString();
  let longURL=req.body.longURL;

  urlDatabase[shortURL]=longURL;
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id]};
  res.render("urls_index",templateVars);

  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


// i quote from the "https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript", i use the similar function.
function generateRandomString() {
  var randomString = "";
  var random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    randomString += random.charAt(Math.floor(Math.random() * random.length));

  return randomString;
}


// var longURL = req.body;
// var shortURL = generateRandomString();



app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  // res.redirect(longURL);
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_index",templateVars);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id ;
  urlDatabase [id] = req.body.longURL
  res.redirect("/urls")
})

app.post("/login", (req,res) => {
  // fix
  res.cookie("username", req.body.username, { maxAge: 10* 60 * 1000})
console.log(req.body.username)
  res.redirect("/urls")

})

app.post("/logout", (req,res) => {
// res.cookie("username", req.body.username, { maxAge: 10* 60 * 1000})
 res.clearCookie('username');
  res.redirect("/urls")
})

// User Registration Task 2
app.get("/register", (req, res) => {

  res.render("register");
});



// task 3------------------------------------------------------
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
  }
}

//task 4--------------------------------------------------------

 app.post("/register", (req,res) => {
  console.log(req.body)
  const idPut = generateRandomString()
  const emailPut = req.body.email
  const passwordPut = req.body.password


  var arr = [];
  for (var key in users) {
        arr.push(users[key].email);
    }


  users[idPut] = {id: idPut, email: emailPut, password:passwordPut }
  console.log(users);

  res.cookie("user_id", idPut, { maxAge: 10* 60 * 1000});
  if (emailPut === "" || passwordPut === "" ){
   res.status(400);
  } else if (
    arr.forEach(function(elment){
      emailPut === elment;
      return true;
    })
){
   res.status(400)
  } else {

  res.redirect("/urls")};

})
//-----------------------------------------------------
//task 7: creat a login page

app.get("/login", (req, res) => {

  res.render("login");
});







