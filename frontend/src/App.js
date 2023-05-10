import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import NavBar from "./components/NavBar";
import MisCasas from "./pages/MisCasas";
import Habitaciones from "./components/Habitaciones";
import MisArmarios from "./components/MisArmarios";
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
            <Route path="/" element={<LogIn />}></Route>
            <Route path="/misarmarios" element={<MisArmarios />}></Route>
            <Route path="/miscasas" element={<MisCasas />}></Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
