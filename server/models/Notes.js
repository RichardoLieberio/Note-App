const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
    title: {
        type: String
    },
    note: {
        type: String
    }
}, {timestamps: true});

const Notes = new mongoose.model("Notes", notesSchema);

module.exports = Notes;