import { v4 as uuid } from "uuid";
import { useState, useEffect, useRef } from "react";
import { useNotesContext } from "./useNotesContext";

function useMainController() {
    const [isNewNote, setIsNewNote] = useState(false);
    const [focusNote, setFocusNote] = useState(null);
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const timer = useRef(null);
    const { state, dispatch } = useNotesContext();

    useEffect(() => {
        fetchAllNotes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (focusNote) {
            setTitle(focusNote.title);
            setNote(focusNote.note);
        } else {
            setTitle("");
            setNote("");
        }
    }, [focusNote]);

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            autosave(focusNote);
        }, 3000);
    }, [title, note]); // eslint-disable-line react-hooks/exhaustive-deps

    async function fetchAllNotes() {
        try {
            const response = await fetch("http://localhost:4000/api/notes");
            if (response.ok) {
                const allNotes = await response.json();
                dispatch({type: "set-notes", payload: allNotes.allNotes});
                allNotes.allNotes.length && setFocusNote(allNotes.allNotes[0]);
            } else {
                throw new Error("Failed to fetch all notes");
            }
        } catch (err) {
            console.error("Error fetching all notes", err);
        }
    }

    function addNote() {
        if (!isNewNote) {
            clearTimeout(timer.current);
            const newNote = {
                _id: uuid(),
                title: "",
                note: "",
                updatedAt: Date.now()
            };
            dispatch({type: "add-note", payload: newNote});
            if (focusNote && (focusNote.title !== title || focusNote.note !== note)) {
                savePrevNote(focusNote);
            }
            setIsNewNote(true);
            setFocusNote(newNote);
        }
    }

    function changeNote(nextNote) {
        if (nextNote._id !== focusNote._id) {
            clearTimeout(timer.current);
            if (isNewNote) {
                if (title || note) {
                    saveNewNote(false, focusNote);
                } else {
                    dispatch({type: "delete-note", payload: focusNote});
                }
                setIsNewNote(false);
            } else if (focusNote && (focusNote.title !== title || focusNote.note !== note)) {
                savePrevNote(focusNote);
            }
            setFocusNote(nextNote);
        }
    }

    function saveNote() {
        if (state.length === 0) {
            (title || note) && saveNewNote(true);
        } else if (focusNote && (focusNote.title !== title || focusNote.note !== note)) {
            clearTimeout(timer.current);
            if (isNewNote) {
                saveNewNote(true, focusNote);
                setIsNewNote(false);
            } else {
                savePrevNote(focusNote);
            }
        }
    }

    function deleteNote(e, deleteNote) {
        e.stopPropagation();
        if (deleteNote._id === focusNote._id) {
            clearTimeout(timer.current);
            if (isNewNote) {
                dispatch({type: "delete-note", payload: deleteNote});
                setIsNewNote(false);
            } else {
                deleteNoteApi(deleteNote);
            }
            if (state.length !== 1) {
                state[0]._id === deleteNote._id ? setFocusNote(state[1]) : setFocusNote(state[0]);
            } else {
                setFocusNote(null);
            }
        } else {
            deleteNoteApi(deleteNote);
        }
    }

    async function deleteNoteApi(deleteNote) {
        try {
            const response = await fetch(`http://localhost:4000/api/notes/${deleteNote._id}`, {method: "DELETE"});
            if (response.ok) {
                const deletedNote = await response.json();
                dispatch({type: "delete-note", payload: deletedNote.deletedNote});
            } else {
                throw new Error("Failed to delete note");
            }
        } catch (err) {
            console.error("Error deleting note", err);
        }
    }

    async function savePrevNote(oldNote, updateFocusNote = false) {
        try {
            const response = await fetch(`http://localhost:4000/api/notes/${focusNote._id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, note})
            });
            if (response.ok) {
                const updatedNote = await response.json();
                dispatch({type: "replace-note", payload: {newNote: updatedNote.updatedNote, oldNote}});
                updateFocusNote && setFocusNote(updatedNote.updatedNote);
            } else {
                throw new Error("Failed to save note");
            }
        } catch (err) {
            console.error("Error saving note", err);
        }
    }

    async function saveNewNote(updateFocusNote = false, oldNote = null) {
        try {
            const response = await fetch("http://localhost:4000/api/notes", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, note})
            });
            if (response.ok) {
                const newNote = await response.json();
                if (oldNote) {
                    dispatch({type: "replace-note", payload: {newNote: newNote.newNote, oldNote}});
                } else {
                    dispatch({type: "add-note", payload: newNote.newNote});
                }
                updateFocusNote && setFocusNote(newNote.newNote);
            } else {
                throw new Error("Failed to create new note");
            }
        } catch (err) {
            console.error("Error creating new note", err);
        }
    }

    function autosave() {
        if (state.length && (focusNote.title !== title || focusNote.note !== note)) {
            if (isNewNote) {
                saveNewNote(true, focusNote);
                setIsNewNote(false);
            } else {
                savePrevNote(focusNote, true);
            }
        }
    }

    function titleHandler(e) {
        setTitle(e.target.value);
    }

    function noteHandler(e) {
        setNote(e.target.value);
    }

    return {
        focusNote,
        title,
        note,
        titleHandler, noteHandler,
        addNote, saveNote, changeNote, deleteNote
    };
}

export { useMainController };