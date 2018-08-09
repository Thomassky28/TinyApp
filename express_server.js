var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters

  let shortURL=generateRandomString();
  let longURL=req.body.longURL;

  urlDatabase[shortURL]=longURL;
  let templateVars = { urls: urlDatabase };
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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index",templateVars);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id ;
  urlDatabase [id] = req.body.longURL
  res.redirect("/urls")
})

