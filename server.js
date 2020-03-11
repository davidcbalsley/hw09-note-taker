// Dependencies
// =============================================================
var express = require("express");
var fs = require("fs");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
// =============================================================

// GET /notes -- return the notes.html file
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// GET /api/notes -- return all saved notes as JSON
app.get("/api/notes", function(req, res) {
    return res.sendFile(path.join(__dirname, "db/db.json"));
  });

// GET * -- return the index.html file
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

// POST /api/notes -- add new note to db.json file, then return the new note to the client
app.post("/api/notes", function(req, res) {
    let newNoteId = null;   // The ID for the new note

    // Get new note from req.body
    const newNote = req.body;

    // Add new note to the db.json file

    // Read in the db.json file
    fs.readFile("db/db.json", (err, data) => {
      if (err) throw err;
      
      // Get an array of notes from data
      const noteList = JSON.parse(data);

      // Use the last note to determine the id for the new note
      if (noteList && (noteList.length > 0)) {
        newNoteId = noteList[noteList.length - 1].id + 1;
      } else {
        newNoteId = 1;
      }

      // Add an id to the new note
      newNote.id = newNoteId;
      newNoteId++;

      // Add the new note to the list of notes
      noteList.push(newNote);
      
      // Write the updated list of notes back to db.json
      fs.writeFile("db/db.json", JSON.stringify(noteList), (err) => {
        if (err) throw err;
      });
    });

    // Return the new note to the client
    res.json(req.body);
});

// DELETE /api/notes/:id -- remove the note with the given id, then re-write the db.json file
app.delete("/api/notes/:id", function(req, res) {
  const updatedNoteList = []; // A list of notes that excludes the deleted note

  // Read in the db.json file
  fs.readFile("db/db.json", (err, data) => {
    if (err) throw err;
    
    // Get an array of notes from data
    const noteList = JSON.parse(data);

    for (const note of noteList) {
      if (note.id !== parseInt(req.params.id)) {
        updatedNoteList.push(note);
      }
    }
    
    // Write the updated list of notes back to db.json
    fs.writeFile("db/db.json", JSON.stringify(updatedNoteList), (err) => {
      if (err) throw err;
    });

    res.json(updatedNoteList);
  });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });