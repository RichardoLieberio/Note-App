const Notes = require("../models/Notes");

async function getAllNotes(req, res) {
    const allNotes = await Notes.find({}).sort({updatedAt: -1});
    res.json({notes: allNotes});
}

async function createNote(req, res) {
    const newNote = await Notes.create({title: "", note: ""});
    res.json({note: newNote});
}

async function getNote(req, res) {
    const note = await Notes.findOne({_id: req.params.id});
    res.json({note});
}

async function updateNote(req, res) {
    const {title, note} = req.body;
    const updatedNote = await Notes.findOneAndUpdate({_id: req.params.id}, {title, note}, {new: true});
    res.json({newNote: updatedNote});
}

async function deleteNote(req, res) {
    const deletedNote = await Notes.findOneAndDelete({_id: req.params.id});
    res.json({deleted: deletedNote});
}

module.exports = {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote
};