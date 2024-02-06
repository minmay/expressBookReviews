const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  return users.includes(username)
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    res.send(book);
  } else {
    res.status(404).send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let found = null;
  for (let isbn in books) {
    let book = books[isbn]
    if (book.author === author) {
      found = book;
      break;
    }
  }

  if (found) {
    res.send(found)
  } else {
    res.status(404).send("Book by author not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let found = null;
  for (let isbn in books) {
    let book = books[isbn]
    if (book.title === title) {
      found = book;
      break;
    }
  }

  if (found) {
    res.send(found)
  } else {
    res.status(404).send("Book by title not found");
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.send(book.reviews)
  } else {
    res.status(404).send("Book review by isbn not found");
  }

});

module.exports.general = public_users;
