const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let found_users = users.filter(user => user.username === username);
  return found_users.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  let found_users = users.filter(user => user.username === username && user.password === password);
  return found_users.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let username = req.session.authorization.username
    // modify or add review with this upsert
    book.reviews[username] = req.body.review;
    res.send("Book successfully reviewed");
  } else {
    res.status(404).send("Book review by isbn not found");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let username = req.session.authorization.username
    let review = book.reviews[username];
    if (review) {
      delete book.reviews[username]
      res.send("Book review successfully removed");
    } else {
      res.status(404).send("Book by isbn not found");
    }
  } else {
    res.status(404).send("Book by isbn not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
