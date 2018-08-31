var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//var cookieParser = require('cookie-parser')
//app.use(cookieParser())
var cookieSession = require('cookie-session')
app.use(cookieSession({
    name: 'session',
    keys: ["tinyapp" /* secret keys */ ],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
const bcrypt = require('bcrypt');



app.set("view engine", "ejs");

var urlDatabase = {
    "b2xVn2": {
        "longUrl": "http://www.lighthouselabs.ca",
        "userID": "userRandomID"
    },
    "9sm5xK": {
        "longUrl": "http://www.google.com",
        "userID": "user2RandomID"
    }
};
// urlDatabase['b2xVn2'] === {
//     "longUrl": "http://www.lighthouselabs.ca",
//     "userID": "userRandomID"
// }
// urlDatabase['a'] === undefined

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
    //req.cookies.username
    console.log("get/urls");
    console.log(`req.session.user_id is,`, req.session);


    let templateVars = {
        urls: urlsForUser(req.session.user_id),
        //username: req.cookies.username,
        user: users[req.session.user_id]
    };

    res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
    let templateVars = { user: users[req.session.user_id] };
    console.log("templatevars", templateVars);
    res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id].longUrl,
        user: users[req.session.user_id]
    };
    if (req.session.user_id === urlDatabase[req.params.id].userID) {
        res.render("urls_show", templateVars);
    } else {
        res.status(400).send("You are not allowed to Edit!");
    }

});



app.post("/urls", (req, res) => {
    console.log(req.body); // debug statement to see POST parameters

    let shortURL = generateRandomString();
    let longURL = req.body.longURL;
    //console.log(urlDatabase["shortURL"]);
    console.log(longURL);
    urlDatabase[shortURL] = { longUrl: longURL, userID: req.session.user_id };

    let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
    // res.render("urls_index", templateVars);
    res.redirect("/urls");

});

function urlsForUser(id) {
    var subSet = {};
    for (var key in urlDatabase) {
        if (urlDatabase[key].userID === id) {
            subSet[key] = urlDatabase[key];

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


app.get("/u/:shortURL", (req, res) => {
    // let longURL = ...
    // res.redirect(longURL);
    const shortURL = req.params.shortURL
    if (urlDatabase[shortURL] === undefined) {
        res.status(403).send("Unvalid URL");
    } else {

        const longURL = urlDatabase[shortURL].longUrl
        res.redirect(longURL);
    }
});

app.post("/urls/:id/delete", (req, res) => {
    if (req.session.user_id === urlDatabase[req.params.id].userID) {
        delete urlDatabase[req.params.id];
        res.redirect("/urls");
    } else {
        res.status(400).send("You are not allowed to delete!");
    }
});

app.post("/urls/:id", (req, res) => {
    const id = req.params.id;
    urlDatabase[id].longUrl = req.body.longURL
    res.redirect("/urls")
})

app.post("/login", (req, res) => {
    console.log(req.body.email, req.body.password);
    //console.log(bcrypt.compareSync(req.body.password, users[user].password)); // returns true
    //bcrypt.compareSync("pink-donkey-minotaur", hashedPassword);

    for (var user in users) {
        if (req.body.email === users[user].email && bcrypt.compareSync(req.body.password, users[user].password)) {
            //res.cookie("user_id", users[user].id, { maxAge: 10* 60 * 1000});
            req.session.user_id = users[user].id
            res.redirect("/urls");
            return;
        }
    }
    res.status(403).send("email/password is not found!");

})

app.post("/logout", (req, res) => {
    // res.cookie("username", req.body.username, { maxAge: 10* 60 * 1000})
    //res.clearCookie('user_id');
    console.log("post/logout")
    req.session = null;
    res.redirect("/urls")
})


app.get("/register", (req, res) => {

    res.render("register");
});



// task 3------------------------------------------------------
const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "u@g.ca",
        password: bcrypt.hashSync('p', 10)
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "u2@g.ca",
        password: bcrypt.hashSync('p', 10)
    }
}

//task 4--------------------------------------------------------

app.post("/register", (req, res) => {
    //console.log(req.body)
    const idPut = generateRandomString()
    const emailPut = req.body.email
    const password2 = req.body.password
    const hashedPassword = bcrypt.hashSync(password2, 10);
    const passwordPut = hashedPassword
    //const passwordPut = req.body.password


    var arr = [];
    for (var key in users) {
        arr.push(users[key].email);
    }
    var bademail = false;

    for (let elment of arr) {
        if (emailPut === elment) {
            bademail = true;
        }
    }

    if (emailPut === "" || password2 === "") {
        res.status(400).send("Please provide valid email and password");
    } else if (
        bademail

    ) {
        res.status(400).send("Please provide a non existing email");
    } else {
        users[idPut] = { id: idPut, email: emailPut, password: passwordPut }
        //console.log(users);
        //res.cookie("user_id", idPut, { maxAge: 10* 60 * 1000});
        req.session.user_id = idPut;


        res.redirect("/urls")
    };

})
//-----------------------------------------------------
//task 7: creat a login page

app.get("/login", (req, res) => {

    res.render("login");
});