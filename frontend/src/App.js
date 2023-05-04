import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import NavBar from "./componets/NavBar";
import Addarm from "./pages/Addarm";
import Howto from "./pages/Howto";

import MisCasas from "./pages/MisCasas";
import PersonalPage from "./pages/PersonalPage";
import Habitaciones from "./componets/Habitaciones";
import MisArmarios from "./componets/MisArmarios";
import { AuthProvider } from "./componets/context/AuthContext";

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
            <Route path="/Adjuntararmario" element={<Addarm />}></Route>
            <Route path="/comousar" element={<Howto />}></Route>
            <Route path="/misarmarios" element={<MisArmarios />}></Route>
            <Route path="/miscasas" element={<MisCasas />}></Route>
            <Route path="/personal" element={<PersonalPage />}></Route>
            <Route path="/habitaciones" element={<Habitaciones />}></Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
