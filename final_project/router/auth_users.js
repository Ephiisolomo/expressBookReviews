const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 // Extract username and password from the request body
 const { username, password } = req.body;

 // Check if username and password are provided
 if (!username || !password) {
   return res.status(400).json({ message: "Username and password are required" });
 }

 // Check if the username exists and the password is correct
 if (isValid(username, password)) {
   // Create a JWT for the user's session
   const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });

   // Respond with the JWT
   return res.status(200).json({ token });
 } else {
   // If the username or password is incorrect, respond with a 401 Unauthorized
   return res.status(401).json({ message: "Invalid credentials" });
 }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve ISBN and review from request parameters
  const requestedISBN = req.params.isbn;
  const review = req.query.review;

  // Retrieve the username from the user's session
  const username = req.user.username;

  // Find the book with the requested ISBN
  const requestedBook = books[requestedISBN];

  // Check if the book is found
  if (requestedBook) {
    // Check if the user has already posted a review for this ISBN
    if (!requestedBook.reviews[username]) {
      // If not, add a new review
      requestedBook.reviews[username] = review;
    } else {
      // If yes, modify the existing review
      requestedBook.reviews[username] = review;
    }

    // Respond with the updated reviews
    return res.status(200).json(requestedBook.reviews);
  } else {
    // If the book is not found, respond with a 404 Not Found
    return res.status(404).json({ message: "Book not found" });
  }});

  regd_users.delete("/auth/review/:isbn",  (req, res)=> {
    const requestedISBN = req.params.isbn;
    const username = req.user.username;
  
    const requestedBook = books[requestedISBN];
  
    if (requestedBook) {
      // Check if the user has a review for this ISBN
      if (requestedBook.reviews[username]) {
        // Delete the user's review for this ISBN
        delete requestedBook.reviews[username];
  
        return res.status(200).json({ message: 'Review deleted successfully' });
      } else {
        // If the user has no review for this ISBN, respond with a 404 Not Found
        return res.status(404).json({ message: 'Review not found' });
      }
    } else {
      // If the book is not found, respond with a 404 Not Found
      return res.status(404).json({ message: 'Book not found' });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
