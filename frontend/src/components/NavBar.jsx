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
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [resultadoMostrarCasas, setResultadoMostrarCasas] = useState(false);
  const [resultadoMostrarHabitacion, setResultadoMostrarHabitacion] =
    useState(false);
  const [resultadoMostrarArmario, setResultadoMostrarArmario] = useState(false);
  const [resultadoMostrarCajones, setResultadoMostrarCajones] = useState(false);
  const [resultadoMostrarCosas, setResultadoMostrarCosas] = useState(false);
  const [resultadoMostrarBuscador, setResultadoMostrarBuscador] =
    useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [casa, setCasas] = useState([]);
  const [isLoadingCasas, setIsLoadingCasas] = useState(true);
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(true);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  useEffect(() => {
    getCasas();
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
      return {
        token: datosRecuperar.token,
        userId: datosRecuperar.userId,
        nombre: datosRecuperar.nombre,
      };
    } else {
      // navigate("/");
      return { token: null, userId: null, nombre: null };
    }
  };

  const verUsuario = async () => {
    try {
      const { token, userId } = extraerDatosDeUsuario();
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/usuarios/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId,
          },
        }
      );
      const usuario = response.data.usuarios.find((u) => u._id === userId);

      setNombreUsuario(usuario.nombre);
    } catch (error) {
      console.log("no se puede obtener el usuario");
    }
  };

  //*OBTENER CASAS

  const getCasas = async () => {
    const { token, userId } = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/casas/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
            casaId: casa._id,
          },
        }
      );
      setCasas(response.data);
      setIsLoadingCasas(false);
    } catch (error) {
      console.log("no se puede obtener las casas");
    }
  };
  //*OBTENER HABITACIONES

  const getHabitaciones = async () => {
    const { token, userId } = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        }
      );
      setHabitaciones(response.data);
      setIsLoadingHabitaciones(false);
    } catch (error) {
      console.log("no se puede obtener las habitaciones");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      verUsuario();
      getCasas();
      getHabitaciones();
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
  const home = () => {
    navegar("/home");
  };

  const toggleMenuDesplegable = () => {
    setMenuDesplegable(!menuDesplegable);
  };
  const contraerMenuDesplegable = () => {
    setMenuDesplegable(false);
  };
  const casasLength = casa.length;
  const habitacionesLength = habitaciones.length;

  return (
    <div className="NavBarSuperior">
      {isLoggedIn ? (
        <>
          <div
            className={isExpanded ? "lateral-expandido" : "lateral"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className="cambiarTema">
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
            <button
              id="iconosBarraLateral"
              className={`verUsuario ${
                resetAnimation ? "reset-animation" : ""
              }`}
              onClick={() => home()}>
              <h3 className="textoDeIconos">{nombreUsuario}</h3>
            </button>
            {isExpanded ? <div className="textoLateralExpandido"></div> : null}
            <button
              id="iconosBarraLateral"
              onClick={mostrarBuscadorFuncion}
              className="verBuscar">
              <h3 className="textoDeIconos">Buscar</h3>
            </button>

            <button
              id="iconosBarraLateral"
              onClick={mostrarCasasFuncion}
              className={`verCasa ${darkmode ? "reset-animation" : ""}`}>
              <h3 className="textoDeIconos">
                {casasLength === 0 ? (
                  "Nivel 1"
                ) : isLoadingCasas ? (
                  <div className="arc"></div>
                ) : (
                  casa[0].nombre
                )}
              </h3>
            </button>

            <button
              id="iconosBarraLateral"
              onClick={mostrarHabitacionFuncion}
              className={`verHabitacion ${darkmode ? "reset-animation" : ""}`}>
              <h3 className="textoDeIconos">
                {habitacionesLength === 0
                  ? "Nivel 2"
                  : isLoadingHabitaciones
                  ? "Cargando "
                  : habitaciones[0].tipo}
              </h3>
            </button>
            <button
              id="iconosBarraLateral"
              onClick={mostrarArmariosFuncion}
              className={`verMueble ${darkmode ? "reset-animation" : ""}`}>
              <h3 className="textoDeIconos">Muebles</h3>
            </button>
            <button
              id="iconosBarraLateral"
              onClick={mostrarCajonesFuncion}
              className={`verCajones ${darkmode ? "reset-animation" : ""}`}>
              <h3 className="textoDeIconos">Cajones</h3>
            </button>
            <button
              id="iconosBarraLateral"
              onClick={mostrarCosasFuncion}
              className={`verCosas ${darkmode ? "reset-animation" : ""}`}>
              <h3 className="textoDeIconos">Cosas</h3>
            </button>

            <button
              id="iconosBarraLateral"
              className={`verSalir ${resetAnimation ? "reset-animation" : ""}`}
              onClick={Logout}>
              <h3 className="textoDeIconos">Salir</h3>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={darkmode ? "NavBar-Dark" : "NavBar"}>
            <div
              className={darkmode ? "BarraNavegacion-Dark" : "BarraNavegacion"}>
              <div className={darkmode ? "logo-Dark" : "Logo"}></div>
              <div className="botonessinlogear">
                <button className="botonlogin" onClick={() => login()}>
                  Login
                </button>
                <button className="botonbienvenido">Bienvenido/a</button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="MenuHamburguesa" onClick={() => toggleMenuDesplegable()}>
        &#9776;
      </div>

      {isLoggedIn && (
        <div>
          <div
            className={`MenuDesplegable ${
              menuDesplegable ? "MenuDesplegable--activo" : ""
            }`}>
            <ul>
              <li>
                <a onClick={() => mostrarCasasFuncion()}>
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
          }`}>
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
