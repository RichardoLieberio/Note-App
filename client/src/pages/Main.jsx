import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { BarLoader } from "react-spinners";
import NoteCard from "../components/NoteCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNotesContext } from "../hooks/useNotesContext";
import { useMainController } from "../hooks/useMainController";

function Main() {
    const [user, setUser] = useState({});
    const [total, setTotal] = useState("0 Notes");
    const {
        setIsNewNote,
        focusNote, setFocusNote,
        title, setTitle,
        note, setNote,
        timer,
        titleHandler, noteHandler,
        addNote, saveNote, changeNote, deleteNote
    } = useMainController();
    const { state: token, dispatch: tokenDispatch } = useAuthContext();
    const { state, dispatch } = useNotesContext();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            if (token) {
                try {
                    const response = await fetch("http://localhost:4000/api/user", {
                        headers: {"Authorization": `Bearer ${token}`}
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.user) {
                            setUser(data.user);
                        } else {
                            throw new Error("");
                        }
                    } else {
                        throw new Error("");
                    }
                } catch (err) {
                    logout();
                }
            }
        }
        fetchUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (state) {
            setTotal(state.length === 1 ? "1 Note" : `${state.length} Notes`);
        }
    }, [state]);

    function logout() {
        setIsNewNote(false);
        setFocusNote(null);
        setTitle("");
        setNote("");
        clearTimeout(timer.current);
        localStorage.removeItem("token");
        dispatch({type: "empty-notes", payload: []});
        tokenDispatch({type: "logout", payload: {}});
        navigate("/login");
    }

    const noteCardMethods = {
        changeNote,
        deleteNote
    };

    return (
        <div className="notes">
            <section className="left">
                <div className="leftHeader">
                    <div>
                        <h2>{user.name ? user.name : <Skeleton baseColor="#b4b4b4" highlightColor="#ccc" />}</h2>
                    </div>
                    <div>
                        <small>{user.email ? user.email : <Skeleton baseColor="#b4b4b4" highlightColor="#ccc" />}</small>
                    </div>
                    <button onClick={addNote} className="addNote">Add note</button>
                </div>
                <button onClick={logout} className="logoutBtn">Logout</button>
            </section>

            <section className="mid">
                <section className="midHeader">
                    <h2>Notes</h2>
                    <small>{total}</small>
                </section>
                <section className="allNotes">
                    {
                        state
                        ? state.map(note =>
                            <NoteCard
                                key={note._id}
                                note={note}
                                methods={noteCardMethods}
                                active={focusNote && note._id === focusNote._id}
                            />
                        )
                        : <BarLoader width={"100%"} />
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