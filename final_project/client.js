const axios = require('axios');


let config = {"baseURL": "http://localhost:5000"}


async function findBooks() {
    const result = await axios.get("/", config);
    console.log(result.data);
}

async function findBookByIsbn(isbn) {
    const result = await axios.get("/isbn/" + isbn, config)
    console.log(result.data)
}

async function findBookByAuthor(author) {
    const result = await axios.get("/author/" + author, config)
    console.log(result.data)
}

async function findBookByTitle(title) {
    const result = await axios.get("/title/" + title, config)
    console.log(result.data)
}

// console.log("find books")
// findBooks();
//
// console.log("find books by isbn");
// findBookByIsbn(1);

// console.log("find books by author");
// findBookByAuthor("Hans Christian Andersen");

// console.log("find books by title");
// findBookByTitle("The Divine Comedy")





