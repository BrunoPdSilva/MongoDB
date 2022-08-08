const express = require("express");
const { connectToDb, getDb } = require("./db");

// Initialize App & Middleware
const app = express();

//db connection
let db;
connectToDb(err => {
  if (!err) {
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  }
  db = getDb();
});

// Routes
app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach(book => {
      books.push(book);
    })
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Couldn't find books." });
    });
});
