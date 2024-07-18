import NoteCard from "../components/NoteCard";
import { useMainController } from "../hooks/useMainController";
import { useNotesContext } from "../hooks/useNotesContext";

function Main() {
    const {
        focusNote,
        title,
        note,
        titleHandler, noteHandler,
        addNote, saveNote, changeNote, deleteNote
    } = useMainController();
    const { state } = useNotesContext();

    const noteCardMethods = {
        changeNote,
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
                    <small>
                        {
                            state.length === 1 ? "1 Note" : `${state.length} Notes`
                        }
                    </small>
                </section>
                <section className="allNotes">
                    {
                        state.map(note =>
                            <NoteCard
                                key={note._id}
                                note={note}
                                methods={noteCardMethods}
                                active={focusNote && note._id === focusNote._id}
                            />
                        )
                    }
                </section>
            </section>

            <section className="right">
                <div className="rightHeader">
                    <button onClick={saveNote} className="saveNote">Save</button>
                </div>
                <div className="rightBody">
                    <input onChange={titleHandler} value={title} type="text" placeholder="Untitled" className="editTitle" spellCheck="false" />
                    <textarea onChange={noteHandler} value={note} placeholder="Note empty" className="editNote" spellCheck="false" />
                </div>
            </section>
        </div>
    );
}

export default Main;