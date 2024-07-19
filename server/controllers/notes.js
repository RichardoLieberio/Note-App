const Notes = require("../models/Notes");

async function getAllNotes(req, res) {
    try {
        const allNotes = await Notes.find({creatorId: req.userId}).sort({createdAt: -1});
        res.json({allNotes});
    } catch (err) {
        res.json({error: "Unexpected error"});
    }
}

async function createNote(req, res) {
    try {
        const {title, note} = req.body;
        const newNote = await Notes.create({title, note, creatorId: req.userId});
        res.json({newNote});
    } catch (err) {
        res.json({error: "Unexpected error"});
    }
}

async function getNote(req, res) {
    try {
        const note = await Notes.findOne({_id: req.params.id, creatorId: req.userId});
        res.json({note});
    } catch (err) {
        res.json({error: "Unexpected error"});
    }
}

async function updateNote(req, res) {
    try {
        const {title, note} = req.body;
        const updatedNote = await Notes.findOneAndUpdate({_id: req.params.id, creatorId: req.userId}, {title, note}, {new: true});
        res.json({updatedNote});
    } catch (err) {
        res.json({error: "Unexpected error"});
    }
}

async function deleteNote(req, res) {
    try {
        const deletedNote = await Notes.findOneAndDelete({_id: req.params.id, creatorId: req.userId});
        res.json({deletedNote});
    } catch (err) {
        res.json({error: "Unexpected error"});
    }
}

module.exports = {
    getAllNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote
};