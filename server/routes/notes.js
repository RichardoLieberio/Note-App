const express = require("express");

const authRequired = require("../middlewares/authRequired");
const notesContr = require("../controllers/notes");

const router = express.Router();

router.use(authRequired);

router.get("/", notesContr.getAllNotes);

router.post("/", notesContr.createNote);

router.get("/:id", notesContr.getNote);

router.patch("/:id", notesContr.updateNote);

router.delete("/:id", notesContr.deleteNote);

module.exports = router;