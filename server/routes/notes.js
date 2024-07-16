const express = require("express");

const notesContr = require("../controllers/notes");

const router = express.Router();

router.get("/", notesContr.getAllNotes);

router.post("/", notesContr.createNote);

router.get("/:id", notesContr.getNote);

router.patch("/:id", notesContr.updateNote);

router.delete("/:id", notesContr.deleteNote);

module.exports = router;