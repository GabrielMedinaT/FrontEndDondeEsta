import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navegar = useNavigate();
  const { gestionarLogOut } = useContext(AuthContext);
  const [menuDesplegable, setMenuDesplegable] = useState(false);

  const Logout = () => {
    gestionarLogOut();
    localStorage.removeItem("datosUsuario");
    navegar("/login");
  };
  const login = () => {
    navegar("/login");
  };
  const adjuntar = () => {
    navegar("/adjuntar");
  };
  const habitacion = () => {
    navegar("/AdjuntarHabitacion");
  };

  const toggleMenuDesplegable = () => {
    setMenuDesplegable(!menuDesplegable);
  };

  return (
    <div>
      <div className="BarraNavegacion">
        <div className="Logo">Logo</div>
        <div className="Botones">
          <button onClick={() => login()}>Log In</button>
          <button onClick={() => adjuntar()}>Añadir Casa</button>
          <button onClick={() => habitacion()}>Añadir Habitacion</button>
          <button onClick={Logout}>Log Out</button>
        </div>
        <div
          className="MenuHamburguesa"
          onClick={() => toggleMenuDesplegable()}
        >
          &#9776;
        </div>
      </div>
      <div
        className={`MenuDesplegable ${
          menuDesplegable ? "MenuDesplegable--activo" : ""
        }`}
      >
        <ul>
          <li>
            <a href="#" onClick={() => login()}>
              Log In
            </a>
          </li>
          <li>
            <a href="#" onClick={() => adjuntar()}>
              Añadir Casa
            </a>
          </li>
          <li>
            <a href="#" onClick={() => habitacion()}>
              Añadir Habitacion
            </a>
          </li>
          <li>
            <a href="#" onClick={Logout}>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
