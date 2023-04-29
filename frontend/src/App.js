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
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Image } from "cloudinary-react";
import { useEffect } from "react";

function App() {
  const [token, setToken] = React.useState("");

  useEffect(() => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      setToken(datosRecuperar.token);
    }
  }, []);
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/adjuntar" element={<Addcasa />}></Route>
          <Route path="/AdjuntarHabitacion" element={<Addhab />}></Route>
          <Route path="/Adjuntararmario" element={<Addarm />}></Route>
          <Route path="/comousar" element={<Howto />}></Route>
          <Route path="/registro" element={<Registro />}></Route>
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/miscasas" element={<MisCasas />}></Route>
          <Route path="/personal" element={<PersonalPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
