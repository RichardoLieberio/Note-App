import { formatDistanceToNow } from "date-fns";

function NoteCard({ note, methods, active }) {
    return (
        <div onClick={() => methods.changeNote(note)} className={active ? "noteCard active" : "noteCard"}>
            <span onClick={(e) => methods.deleteNote(e, note)} className="delete">x</span>
            <div className="h3Div">
                {
                    note.title
                    ? <h3>{note.title}</h3>
                    : <h3 style={{color: "gray"}}>Untitled</h3>
                }
            </div>
            <div className="pDiv">
                {
                    note.note
                    ? <p>{note.note}</p>
                    : <p style={{color: "gray"}}>Note empty</p>
                }
            </div>
            <div className="smallDiv">
                <small>{formatDistanceToNow(new Date(note.updatedAt), {addSuffix: true})}</small>
            </div>
        </div>
    );
}

export default NoteCard;