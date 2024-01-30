const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let filtred = users.filter((user)=>user.username===username);
    return filtred.length > 0;
}

const authenticatedUser = (username,password)=>{ 
    let filtred = users.filter((user)=>user.username===username && user.password===password);
    return filtred.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;
  if(!username || !password){
    res.send("Unable to login please provide valid username and password");    
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data:password},"access",{expiresIn:60*60});
    req.session.authorization = {accessToken,username};
    res.send("User Logged In succesfully");
} else {
    res.send("User is not authenticated");
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(books[isbn]){
    if(books[isbn].reviews.hasOwnProperty(username)){
        books[isbn].reviews[username] = review;
        res.send("Updated the review of an existing username");
    } else {
        books[isbn].reviews[username] = review;
        res.send("New review for this user");
    }
  } else {
    res.send("ISBN Not Valid");
  }
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if(books[isbn]){
        if(!books[isbn].reviews.hasOwnProperty(username)){
            res.send("Nor reviews To remove");
        } else {
            delete books[isbn].reviews[username];
            return res.send("Review removed");
        }
    } else {
        res.send("ISBN Not valid");
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
