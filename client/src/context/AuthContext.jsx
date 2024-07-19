import { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

function authReducer(state, action) {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
        default:
            return state;
    }
}

function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, null);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"));
        dispatch({type: "login", payload: token});
    }, []);

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}

export {
    AuthContext,
    AuthContextProvider
};