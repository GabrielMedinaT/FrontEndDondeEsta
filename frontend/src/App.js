import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./components/LogIn";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      setToken(datosRecuperar.token);
    }
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <NavBar />
          <Routes>
            {/* <Route path="/home" element={<Home />}></Route> */}
            <Route path="/" element={<LogIn />}></Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
