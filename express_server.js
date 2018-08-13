var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.use(cookieParser())


app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": {
    "longUrl": "http://www.lighthouselabs.ca",
    "userID": "userRandomID"
  },
  "9sm5xK": {
    "longUrl": "http://www.google.com",
    "userID" : "user2RandomID"
  }
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
  res.end("<html><body><b>Hello</b><b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log("cookies: ", req.cookies)
  //console.log("users", users)
  //req.cookies.username

  let templateVars = {
    urls: urlsForUser(req.cookies.user_id),
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
    longURL: urlDatabase[req.params.id].longUrl,
    user: users[req.cookies.user_id]
  };
  if (req.cookies.user_id === urlDatabase[req.params.id].userID){
  res.render("urls_show", templateVars);
  } else {
    res.status(400).send("You are not allowed to Edit!");
  }

});



app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters

  let shortURL=generateRandomString();
  let longURL=req.body.longURL;
  //console.log(urlDatabase["shortURL"]);
  console.log(longURL);
  urlDatabase[shortURL]= {longUrl:longURL, userID: req.cookies.user_id};
  res.redirect("/urls/"+shortURL);
  //let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id]};
  //res.render("urls_index",templateVars);

  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

function urlsForUser(id){
  var subSet = {} ;
 for(var key in urlDatabase){
  if (urlDatabase[key].userID === id) {
    subSet[key]=urlDatabase[key];

  }
 }
 return subSet;
}


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
  const longURL = urlDatabase[shortURL].longUrl
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.cookies.user_id === urlDatabase[req.params.id].userID){
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
  } else {
    res.status(400).send("You are not allowed to delete!");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id ;
  urlDatabase [id] = req.body.longURL
  res.redirect("/urls")
})

app.post("/login", (req,res) => {
  console.log(req.body.email, req.body.password);

  for(var user in users) {
    if ((req.body.email === users[user].email) && (req.body.password === users[user].password)) {
      res.cookie("user_id", users[user].id, { maxAge: 10* 60 * 1000});
      res.redirect("/");
      return;
    }
  }
    // else if ((req.body.email === user.email) && (req.body.password !== user.password)) {
    //   res.status(403).send("password is incorrect" );
    // } else {

  res.status(403).send("email/password is not found!");
  //res.sendStatus(403);}
  // fix

})

app.post("/logout", (req,res) => {
// res.cookie("username", req.body.username, { maxAge: 10* 60 * 1000})
 res.clearCookie('user_id');
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
    email: "u@g.ca",
    password: "p"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "u2@g.ca",
    password: "p"
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







