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
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });

// Displays all notes
app.get("/api/notes", function(req, res) {
    return res.sendFile(path.join(__dirname, "db/db.json"));
  });

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });

app.post("/api/notes", function(req, res) {
    // Get new note from req.body
    const newNote = req.body;

    console.log(newNote);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });