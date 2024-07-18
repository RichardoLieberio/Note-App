const Notes = require("../models/Notes");

async function getAllNotes(req, res) {
    const allNotes = await Notes.find({}).sort({createdAt: -1});
    res.json({allNotes});
}

async function createNote(req, res) {
    const {title, note} = req.body;
    const newNote = await Notes.create({title, note});
    res.json({newNote});
}

async function getNote(req, res) {
    const note = await Notes.findOne({_id: req.params.id});
    res.json({note});
}

async function updateNote(req, res) {
    const {title, note} = req.body;
    const updatedNote = await Notes.findOneAndUpdate({_id: req.params.id}, {title, note}, {new: true});
    res.json({updatedNote});
}

async function deleteNote(req, res) {
    const deletedNote = await Notes.findOneAndDelete({_id: req.params.id});
    res.json({deletedNote});
}

module.exports = {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote
};