const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const notesRouter = require("./routes/notes");

mongoose.connect("mongodb://localhost:27017/NotesV2")
    .then(function() {
        console.log("Connected to database");
    })
    .catch(function(err) {
        console.log("Failed to connect to database");
        console.log(err);
    });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);

app.listen(4000, function() {
    console.log("Listening on port 4000");
});