const express = require("express")
const fs = require("fs")
const path = require('path');
const uuid = require('./helpers/uuid');
const notes = require('./db/db');


//const bookData = require("./data/books.json")
//res.json(bookData);
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


//GET * should return the index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))

})


//GET /api/notes should read the db.json file and 
//return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received for saved notes`);
})


//POST /api/notes should receive a new note 
//to save on the request body, add it to the db.json file, 
//and then return the new note to the client. 
//You'll need to find a way to give each note a unique id 
//when it's saved (look into npm packages that could do this 
//for you).
app.post ("/api/notes", (req, res) => {
  console.info(`${req.method} note received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text, } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id : uuid(),
    };

    const note = {
      status: 'success',
      body: newNote,
    };

    console.log(note);
    res.status(201).json(note);
  } else {
    res.status(500).json('Error in posting note');
  }
});


//You haven’t learned how to handle DELETE requests, 
//but this application has that functionality in the 
//front end. As a bonus, see if you can add 
//the DELETE route to the application using 
//the following guideline:

//DELETE /api/notes/:id should receive a 
//query parameter containing the id of a note 
//to delete. In order to delete a note, 
//you'll need to read all notes from the db.json file, 
//remove the note with the given id property, and then 
//rewrite the notes to the db.json file.
app.delete ("/api/notes/:id", (req, res) => {
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

