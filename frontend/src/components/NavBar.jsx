import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home";
import axios from "axios";
import Buscador from "./Buscador";
import "./NavBar.css";



const NavBar = () => {
  const navegar = useNavigate();
  const { gestionarLogOut, isLoggedIn } = useContext(AuthContext);
  const [menuDesplegable, setMenuDesplegable] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mostrarCasas, setMostrarCasas] = useState(false);
  const [mostrarHabitacion, setMostrarHabitacion] = useState(false);
  const [mostrarArmarios, setMostrarArmarios] = useState(false);
  const [mostrarCajones, setMostrarCajones] = useState(false);
  const [mostrarCosas, setMostrarCosas] = useState(false);
  const [mostrarBuscador , setMostrarBuscador] = useState(false);
  const [resultadoMostrarCasas, setResultadoMostrarCasas] = useState(false);
  const [resultadoMostrarHabitacion, setResultadoMostrarHabitacion] =
    useState(false);
  const [resultadoMostrarArmario, setResultadoMostrarArmario] = useState(false);
  const [resultadoMostrarCajones, setResultadoMostrarCajones] = useState(false);
  const [resultadoMostrarCosas, setResultadoMostrarCosas] = useState(false);
  const [resultadoMostrarBuscador , setResultadoMostrarBuscador] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loadingCosas, setLoadingCosas] = useState(false);
  const [cosas, setCosas] = useState([]);
 
  useEffect(() => {
    localStorage.setItem("darkMode", darkmode);
  }, [darkmode]);

  const toggleDarkMode = () => {
    setDarkmode(!darkmode);
  };

  const mostrarBuscadorFuncion = () => {
    setMostrarBuscador(!mostrarBuscador);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarCosas(false);

    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarBuscador(!mostrarBuscador);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);

    contraerMenuDesplegable();
  };

  const mostrarCasasFuncion = () => {
    setMostrarCasas(!mostrarCasas);
    setResetAnimation(true);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarCosas(false);
    setMostrarBuscador(false);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarCasas(!mostrarCasas);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
    setResultadoMostrarBuscador(false);
  };

  const mostrarHabitacionFuncion = () => {
    setMostrarHabitacion(!mostrarHabitacion);
    setMostrarCasas(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarCosas(false);
    setResetAnimation(true);
    setMostrarBuscador(false);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarHabitacion(!mostrarHabitacion);
    setResultadoMostrarCasas(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
    setResultadoMostrarBuscador(false);
  };

  const mostrarArmariosFuncion = () => {
    setMostrarArmarios(!mostrarArmarios);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarCajones(false);
    setMostrarCosas(false);
    setResetAnimation(true);
    setMostrarBuscador(false);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarArmario(!mostrarArmarios);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
    setResultadoMostrarBuscador(false);
  };

  const mostrarCajonesFuncion = () => {
    setMostrarCajones(!mostrarCajones);
    setMostrarBuscador(false);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCosas(false);
    setResetAnimation(true);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarCajones(!mostrarCajones);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCosas(false);
    setResultadoMostrarBuscador(false);
  };

  const mostrarCosasFuncion = () => {
    setMostrarCosas(!mostrarCosas);
    setMostrarBuscador(false);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setResetAnimation(true);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarCosas(!mostrarCosas);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarBuscador(false);
  };

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      // navigate("/");
    }
  };
  const verUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const { userId, nombre } = extraerDatosDeUsuario(token);
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/usuarios/",
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
    }
  }, [isLoggedIn]);

  const Logout = () => {
    gestionarLogOut();
    setResultadoMostrarCosas(false);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarBuscador(false);
    setMostrarCosas(false);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarBuscador(false);
    navegar("/");
  };
  const login = () => {
    navegar("/home");
  };

  const registro = () => {
    navegar("/registro");
  };
  const casas = () => {
    navegar("/home");
  };

  const toggleMenuDesplegable = () => {
    setMenuDesplegable(!menuDesplegable);
  };
  const contraerMenuDesplegable = () => {
    setMenuDesplegable(false);
  };

  return (
    <div className={darkmode ? "darkmode" : "NavBar"}>
      
      <div className={darkmode ? "BarraNavegacion-Dark" : "BarraNavegacion"}>
        <div className={darkmode ? "logo-Dark" : "Logo"}></div>
        <div className="Botones">
          {isLoggedIn ? (
            <>
              <div className="CambiarTema">
                <label htmlFor="theme" className="theme">
                  <span className="theme__toggle-wrap">
                    <input
                      id="theme"
                      className="theme__toggle"
                      type="checkbox"
                      role="switch"
                      name="theme"
                      value="dark"
                      checked={darkmode}
                      onChange={toggleDarkMode}
                    />
                    {/* <span className="theme__fill"></span> */}
                    <span className="theme__icon">
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                      <span className="theme__icon-part"></span>
                    </span>
                  </span>
                </label>
              </div>
              <button onClick={mostrarBuscadorFuncion}
              className={
                darkmode
                  ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                  : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
              }
              >Buscar</button>
              <button
                onClick={mostrarCasasFuncion}
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
              >
                {mostrarCasas ? "Ocultar Casa" : "Ver Casa"}
              </button>
              <button
                onClick={mostrarHabitacionFuncion}
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
              >
                {mostrarHabitacion
                  ? "Ocultar Habitaciones"
                  : "Ver Habitaciones"}
              </button>
              <button
                onClick={mostrarArmariosFuncion}
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
              >
                {mostrarArmarios ? "Ocultar Mueble" : "Ver Mueble"}
              </button>
              <button
                onClick={mostrarCajonesFuncion}
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
              >
                {mostrarCajones ? "Ocultar Cajones" : "Ver Cajones"}
              </button>
              <button
                onClick={mostrarCosasFuncion}
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
              >
                {mostrarCosas ? "Ocultar Cosas" : "Ver Cosas"}
              </button>
              <button
                className={
                  darkmode
                    ? `VerUOcultar ${resetAnimation ? "reset-animation" : ""}`
                    : `VerUOculta ${resetAnimation ? "reset-animation" : ""}`
                }
                onClick={() => casas()}
              >
                Bienvenido/a {nombreUsuario}
              </button>
              <button
                className={
                  darkmode
                    ? `btn ${resetAnimation ? "reset-animation" : ""}`
                    : `btn ${resetAnimation ? "reset-animation" : ""}`
                }
                onClick={Logout}
              >
                 <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
  
              <div className="text">Logout</div>
              </button>
            </>
          ) : (
            <>
              <div className="botonessinlogear">
                <button className="botonlogin" onClick={() => login()}>
                  Login
                </button>
                <button className="botonbienvenido">Bienvenido/a</button>
              </div>
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
        <div>
          <div
            className={`MenuDesplegable ${
              menuDesplegable ? "MenuDesplegable--activo" : ""
            }`}
          >
            <ul>
              <li>
                <a onClick={() => mostrarCasasFuncion()}>
                  {" "}
                  {mostrarCasas ? "Ocultar Casa" : "Ver Casa"}
                </a>
              </li>
              <li>
                <a onClick={() => mostrarHabitacionFuncion()}>
                  {mostrarHabitacion
                    ? "Ocultar Habitaciones"
                    : "Ver Habitaciones"}
                </a>
              </li>
              <li>
                <a onClick={() => mostrarArmariosFuncion()}>
                  {mostrarArmarios ? "Ocultar Armarios" : "Ver Armarios"}
                </a>
              </li>
              <li>
                <a onClick={() => mostrarCajonesFuncion()}>
                  {mostrarCajones ? "Ocultar Cajones" : "Ver Cajones"}
                </a>
              </li>
              <li>
                <a onClick={() => mostrarCosasFuncion()}>
                  {mostrarCosas ? "Ocultar Cosas" : "Ver Cosas"}
                </a>
              </li>
            </ul>
          </div>
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
      <Home
        mostrarDatos={{
          mostrarCasas: resultadoMostrarCasas,
          mostrarHabitacion: resultadoMostrarHabitacion,
          mostrarArmarios: resultadoMostrarArmario,
          mostrarCajones: resultadoMostrarCajones,
          mostrarCosas: resultadoMostrarCosas,
          mostrarBuscador: resultadoMostrarBuscador,
        }}
        darkmode={darkmode}
      />
    </div>
  );
};

export default NavBar;
