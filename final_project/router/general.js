const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if(!username ||!password){
    res.send("Unable to register the user");
  } else {
    if(isValid(username)){
        res.send("User Already exist");
    } else {
        users.push({"username":username,"password":password});
        res.send("User Has been Registred Successfully");
    }
  }
});

let promise = new Promise((resolve,reject)=>{

})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve,reject)=>{
        if(books){
            resolve(JSON.stringify(books));
        } else {
            reject("No Books Available")
        }
    })
    promise.then(result=>res.send("Books available : \n"+result));
    promise.catch(err=>res.send(err));
});



// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   let list = Object.keys(books);
//   let filtred = list.filter((item)=>item===isbn);
//   if(filtred.length===0){
//     res.send("No Book Correspond to this ISBN")
//   } else {
//     res.send(books[isbn]);
//   }
// });
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let list = Object.keys(books);
  let filtred = list.filter((item)=>item===isbn);
  let promise = new Promise((resolve,reject)=>{
        if(filtred.length===0){
            reject("No Book Correspond to this ISBN");
        } else {
            resolve(books[isbn]);
        }
   });
    promise.then(result=>res.send(result));
    promise.catch(err=>res.send(err));
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   let list = Object.keys(books);
//   for(let i=0;i<list.length;i++){
//     if(books[list[i]].author===author){
//         res.send("details of the books with author name "+author+" are "+JSON.stringify(books[list[i]]));
//     }
//   }
//   res.status(300).json({message: "No Book found with this author name"});
// });


const existAuthor = (author) => {
    let list = Object.keys(books);
    for(let i=0;i<list.length;i++){
        if(books[list[i]].author===author) {
            return true;
        }
    }
    return false;
}
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let list = Object.keys(books);
  let promise = new Promise((resolve,reject)=>{
    if(existAuthor(author)){
        resolve("details of the books with author name "+author+" are "+JSON.stringify(books[list[i]]));
    } else {
        reject("No Book found with this author name");
    }
  });
  promise.then(result=>res.send(result));
  promise.catch(err=>res.send(err));
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     let list = Object.keys(books);
//     for(let i=0;i<list.length;i++){
//       if(books[list[i]].title===title){
//           res.send("details of the books with title "+title+" are "+JSON.stringify(books[list[i]]));
//       }
//     }
//     res.status(300).json({message: "No Book found with this title"});
//   });

const existTitle = (title) => {
    let list = Object.keys(books);
    for(let i=0;i<list.length;i++){
      if(books[list[i]].title===title){
        return true;
      }
    }
    return false;
}

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let promise=new Promise((resolve,reject)=>{
        if(existTitle(title)){
            resolve("details of the books with title "+title+" are "+JSON.stringify(books[list[i]]));
        } else {
            reject("No Book found with this title");
        }
    })
    promise.then(result=>res.send(result));
    promise.catch(err=>res.send(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let list = Object.keys(books);
  for(let i=0;i<list.length;i++){
    if(list[i]===isbn){
        res.send(`Review of the book with isbn ${isbn} is ${JSON.stringify(books[isbn].reviews)}`)
    }
  }
});

module.exports.general = public_users;
