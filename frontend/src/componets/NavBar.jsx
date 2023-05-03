import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./NavBar.css";
import axios from "axios";

const NavBar = () => {
  const navegar = useNavigate();
  const { gestionarLogOut, isLoggedIn } = useContext(AuthContext);
  const [menuDesplegable, setMenuDesplegable] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");

  const extraerDatosDeUsuario = (token) => {
    const datos = localStorage.getItem("datosUsuario");
    if (datos) {
      const datosRecuperar = JSON.parse(datos);
      return { userId: datosRecuperar.userId, nombre: datosRecuperar.nombre };
    } else {
      // navegar("/login");
    }
  };

  const verUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const { userId, nombre } = extraerDatosDeUsuario(token);
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/usuarios/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId,
            nombre,
          },
        }
      );
      const usuario = response.data.usuarios.find((u) => u._id === userId);
      if (usuario) {
        setNombreUsuario(usuario.nombre);
      }
    } catch (error) {
      // console.log("Error al obtener usuario", error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verUsuario();
      navegar("/misCasas");
      //recargar una sola vez  el navbar para que se vean los otros botones
    }
  }, [isLoggedIn]);

  const Logout = () => {
    gestionarLogOut();
    navegar("/");
  };
  const login = () => {
    navegar("/");
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
  const casas = () => {
    navegar("/misCasas");
  };
  const armarios = () => {
    navegar("/misarmarios");
  };

  const toggleMenuDesplegable = () => {
    setMenuDesplegable(!menuDesplegable);
  };
  const contraerMenuDesplegable = () => {
    setMenuDesplegable(false);
  };

  return (
    <div>
      <div className="BarraNavegacion">
        <div className="Logo">Logo</div>

        <div className="Botones">
          {isLoggedIn ? (
            <>
              <button>Bienvenido/a {nombreUsuario}</button>
              <button onClick={() => adjuntar()}>Añadir Casa</button>
              <button onClick={() => casas()}>Ver mis casas</button>
              <button onClick={() => habitacion()}>Añadir Habitacion</button>
              <button onClick={() => armarios()}>Ver mis armarios</button>
              <button onClick={Logout}>Log Out</button>
            </>
          ) : (
            <>
              <button>Bienvenido/a</button>
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
              <Link to="/adjuntar" onClick={() => contraerMenuDesplegable()}>
                {" "}
                Añadir Casa
              </Link>
            </li>
            <li>
              <Link
                to="AdjuntarHabitacion"
                onClick={() => contraerMenuDesplegable()}
              >
                Añadir Habitacion
              </Link>
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
