const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
    title: {
        type: String
    },
    note: {
        type: String
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
}, {timestamps: true});

const Notes = new mongoose.model("Notes", notesSchema);

module.exports = Notes;