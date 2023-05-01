import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./NavBar.css";

const NavBar = () => {
  const navegar = useNavigate();
  const { gestionarLogOut, isLoggedIn } = useContext(AuthContext);
  const [menuDesplegable, setMenuDesplegable] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navegar("/misCasas");
      //recargar una sola vez  el navbar para que se vean los otros botones
    }
  }, [isLoggedIn]);

  const Logout = () => {
    gestionarLogOut();
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
  const registro = () => {
    navegar("/registro");
  };

  const toggleMenuDesplegable = () => {
    setMenuDesplegable(!menuDesplegable);
  };

  return (
    <div>
      <div className="BarraNavegacion">
        <div className="Logo">Logo</div>
        <div className="Botones">
          {isLoggedIn ? (
            <>
              <button onClick={() => adjuntar()}>Añadir Casa</button>
              <button onClick={() => habitacion()}>Añadir Habitacion</button>
              <button onClick={Logout}>Log Out</button>
              <button>Bienvenido</button>
            </>
          ) : (
            <>
              <button onClick={() => login()}>Log In</button>
              <button onClick={() => registro()}>Registro</button>
            </>
          )}
        </div>
        <div
          className="MenuHamburguesa"
          onClick={() => toggleMenuDesplegable()}
        >
          &#9776;
        </div>
      </div>
      {isLoggedIn && (
        <div
          className={`MenuDesplegable ${
            menuDesplegable ? "MenuDesplegable--activo" : ""
          }`}
        >
          <ul>
            <li>
              <Link to="/adjuntar" onClick={() => adjuntar()}>
                {" "}
                Añadir Casa
              </Link>
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
      )}
      {!isLoggedIn && (
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
              <a href="#" onClick={() => registro()}>
                Registro
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
