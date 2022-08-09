const express = require("express");
const { ObjectId } = require("mongodb");

const { connectToDb, getDb } = require("./db");

// Initialize App & Middleware
const app = express();
app.use(express.json());

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

// Buscar todos os livros
app.get("/books", (req, res) => {
  //current page

  const page = req.query.p || 0;
  const booksPerPage = 3

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
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

// Buscar um único livro
app.get("/books/:id", (req, res) => {
  // Verifica se o parâmetro passado é válido
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: ObjectId(req.params.id) })
      .then(doc => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Couldn't find the book." });
      });
  } else {
    res.status(500).json({ error: "Not a valid book id." });
  }
});

//POST
app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then(result => res.status(200).json(result))
    .catch(err =>
      res.status(500).json({ error: "Could not create a new document" })
    );
});

//DELETE
app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Couldn't delete the book." });
      });
  } else {
    res.status(500).json({ error: "Not a valid book id." });
  }
});

//PATCH Request

app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Couldn't update the book." });
      });
  } else {
    res.status(500).json({ error: "Not a valid book id." });
  }
});
