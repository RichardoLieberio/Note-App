import { useContext } from "react";

import { NotesContext } from "../context/NotesContext";

function useNotesContext() {
    return useContext(NotesContext);
}

export { useNotesContext };