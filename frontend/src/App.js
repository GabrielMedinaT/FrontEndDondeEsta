import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import NavBar from "./componets/NavBar";
import Addcasa from "./pages/Addcasa";
import Addhab from "./pages/Addhab";
import Addarm from "./pages/Addarm";
import Howto from "./pages/Howto";
import Registro from "./pages/Registro";
import MisCasas from "./pages/MisCasas";
import PersonalPage from "./pages/PersonalPage";
import Habitaciones from "./pages/Habitaciones";
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
            <Route path="/adjuntar" element={<Addcasa />}></Route>
            <Route path="/AdjuntarHabitacion" element={<Addhab />}></Route>
            <Route path="/Adjuntararmario" element={<Addarm />}></Route>
            <Route path="/comousar" element={<Howto />}></Route>
            <Route path="/registro" element={<Registro />}></Route>
            {/* <Route path="/login" element={<LogIn />}></Route> */}
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
