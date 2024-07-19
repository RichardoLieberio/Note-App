import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { state } = useAuthContext();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={state ? <Main /> : <Navigate to="/login" />} />
          <Route path="/login" element={state ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={state ? <Navigate to="/" /> : <Register />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
