const express = require("express")
const path = require('path');
const fs = require("fs")
const uuid = require('./helpers/uuid');
const notesData = require('./db/db.json');
const { readAndAppend } = require("./helpers/fsUtils");



//res.json(notesData);
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//should return the notes.html file.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});





//GET /api/notes should read the db.json file and 
//return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received to get notes`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to read notes data' });
      }

      // Parse existing notes data into an array
      const notes = JSON.parse(data);

      // Send the saved notes back to the client
      res.status(200).json(notes);
  });
});

//POST /api/notes should receive a new note 
//to save on the request body, add it to the db.json file, 
//and then return the new note to the client. 
//You'll need to find a way to give each note a unique id 
//when it's saved (look into npm packages that could do this 
//for you).
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Read the existing notes from db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data' });
      }

      // Parse existing notes data into an array
      const notes = JSON.parse(data);

      // Add the new note to the array
      notes.push(newNote);

      // Write the updated notes array back to the db.json file
      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save note' });
        }

        // Send the new note back to the client
        const note = {
          status: 'success',
          body: newNote,
        };

        console.log(note);
        res.status(201).json(note);
      });
    });
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
  const id = req.params.id;

  // Read the existing notes from db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to read notes data' });
      }

      let notes = JSON.parse(data);

      // Filter out the note with the provided ID
      const updatedNotes = notes.filter(note => note.id !== id);

      // Check if a note was removed
      if (!updatedNotes) {
            return res.status(404).json({ error: 'Note not found' });
          }
      // Write the updated notes array back to the db.json file
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 2), 'utf8', (err) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to save notes data' });
          }

          // Send a success response
          res.status(200).json({ status: 'success' });
      });
  });
});

//GET * should return the index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

