import { useState, useEffect } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import NoteCard from "../components/NoteCard";

function Main() {
    const [focusNote, setFocusNote] = useState(null);
    const {state, dispatch} = useNotesContext();

    useEffect(() => {
        state.length ? setFocusNote(state[0]) : setFocusNote(null);
    }, [state]);

    useEffect(() => {
        async function fetchAllNotes() {
            try {
                const response = await fetch("http://localhost:4000/api/notes");
                if (response.ok) {
                    const allNotes = await response.json();
                    dispatch({type: "set-notes", payload: allNotes.notes});
                } else {
                    throw new Error("Failed to fetch notes");
                }
            } catch (err) {
                console.error("Error fetching notes", err);
            }
        }
        fetchAllNotes();
    }, [dispatch]);

    async function addNote() {
        try {
            const response = await fetch("http://localhost:4000/api/notes", {method: "POST"});
            if (response.ok) {
                const newNote = await response.json();
                dispatch({type: "add-note", payload: newNote.note});
            } else {
                throw new Error("Failed to create note");
            }
        } catch (err) {
            console.error("Error creating note", err);
        }
    }

    async function saveNote() {
        if (focusNote) {
            try {
                const response = await fetch(`http://localhost:4000/api/notes/${focusNote._id}`, {
                    method: "PATCH",
                    body: JSON.stringify({title: focusNote.title, note: focusNote.note}),
                    headers: {"Content-Type": "application/json"}
                });
                if (response.ok) {
                    const updatedNote = await response.json();
                    dispatch({type: "update-note", payload: updatedNote.newNote});
                } else {
                    throw new Error("Failed to update note");
                }
            } catch (err) {
                console.error("Error updating note", err);
            }
        }
    }

    function changeFocusNote(note) {
        setFocusNote(note);
    }

    async function deleteNote(note) {
        try {
            const response = await fetch(`http://localhost:4000/api/notes/${note._id}`, {method: "DELETE"});
            if (response.ok) {
                const deletedNote = await response.json();
                dispatch({type: "delete-note", payload: deletedNote.deleted});
            } else {
                throw new Error("Failed to delete note");
            }
        } catch (err) {
            console.error("Error deleting note", err);
        }
    }

    function titleHandler(e) {
        setFocusNote({...focusNote, title: e.target.value});
    }

    function noteHandler(e) {
        setFocusNote({...focusNote, note: e.target.value});
    }

    const noteMethods = {
        changeFocusNote,
        deleteNote
    };

    return (
        <div className="notes">
            <section className="left">
                <button onClick={addNote} className="addNote">Add note</button>
            </section>

            <section className="mid">
                <section className="midHeader">
                    <h2>Notes</h2>
                    <small>{state.length === 1 ? "1 Note" : `${state.length} Notes`}</small>
                </section>
                <section className="allNotes">
                    {
                        state.map(note => <NoteCard key={note._id} note={note} methods={noteMethods} />)
                    }
                </section>
            </section>

            <section className="right">
                <div className="rightHeader">
                    <button onClick={saveNote} className="saveNote">Save</button>
                </div>
                <div className="rightBody">
                    <input onChange={titleHandler} type="text" placeholder="Note title" className="editTitle" value={focusNote ? focusNote.title : ""} />
                    <textarea onChange={noteHandler} placeholder="Write your note" className="editNote" value={focusNote ? focusNote.note : ""} />
                </div>
            </section>
        </div>
    );
}

export default Main;