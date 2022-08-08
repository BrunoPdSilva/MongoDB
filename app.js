const express = require("express");
const { connectToDb, getDb } = require("./db");

// Initialize App & Middleware
const app = express();

//db connection
let db
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
  res.json({ msg: "welcome to books api" });
});
