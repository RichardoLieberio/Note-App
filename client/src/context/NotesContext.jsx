import { createContext, useReducer } from "react";

const NotesContext = createContext();

function notesReducer(state, action) {
    switch (action.type) {
        case "set-notes":
            return action.payload;
        case "add-note":
            return [action.payload, ...state];
        case "replace-note":
            const updatedNotes = state.map(note => note._id === action.payload.oldNote._id ? action.payload.newNote : note);
            return [...updatedNotes];
        case "delete-note":
            const deletedNotes = state.filter(note => note._id !== action.payload._id);
            return [...deletedNotes];
        default:
            return state;
    }
}

function NotesContextProvider({ children }) {
    const [state, dispatch] = useReducer(notesReducer, []);

    return (
        <NotesContext.Provider value={{state, dispatch}} >
            {children}
        </NotesContext.Provider>
    );
}

export {
    NotesContext,
    NotesContextProvider
};