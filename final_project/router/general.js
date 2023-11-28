const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { username, password };

  // Respond with a success message
  return res.status(201).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books).map(book => {
    return {
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
    };
  });

  const formattedResponse = JSON.stringify(bookList, null, 2);
  return res.status(200).type('text/plain').send(formattedResponse);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   // Retrieve ISBN from request parameters
   const requestedISBN = req.params.isbn;

   // Find the book with the requested ISBN
   const requestedBook = books[requestedISBN];
 
   // Check if the book is found
   if (requestedBook) {
     // Respond with the book details
     formattedResponse = JSON.stringify(requestedBook, null, 2);
     return res.status(200).type('text/plain').send(formattedResponse);
   } else {
     // If the book is not found, respond with a 404 Not Found
     return res.status(404).json({ message: "Book not found" });
   }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve author from request parameters
  const requestedAuthor = req.params.author;

  // Find books that match the requested author
  const matchingBooks = Object.values(books).filter(book => book.author === requestedAuthor);

  // Check if any books are found
  if (matchingBooks.length > 0) {
    // Respond with the details of matching books
    const formattedResponse = JSON.stringify(matchingBooks, null, 2);
    return res.status(200).type('text/plain').send(formattedResponse);
  } else {
    // If no books are found, respond with a 404 Not Found
    return res.status(404).json({ message: "Books by the author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve title from request parameters
  const requestedTitle = req.params.title;

  // Find books that match the requested title
  const matchingBooks = Object.values(books).filter(book => book.title === requestedTitle);

  // Check if any books are found
  if (matchingBooks.length > 0) {
    // Respond with the details of matching books
    const formattedResponse = JSON.stringify(matchingBooks, null, 2);
    return res.status(200).type('text/plain').send(formattedResponse);
  } else {
    // If no books are found, respond with a 404 Not Found
    return res.status(404).json({ message: "Books with the title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   // Retrieve ISBN from request parameters
  const requestedISBN = req.params.isbn;

  // Find the book with the requested ISBN
  const requestedBook = books[requestedISBN];

  // Check if the book is found
  if (requestedBook) {
    // Respond with the book reviews
    const formattedResponse = JSON.stringify(requestedBook.reviews, null, 2);
    return res.status(200).type('text/plain').send(formattedResponse);  
  } else {
    // If the book is not found, respond with a 404 Not Found
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
