import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home";
import light from "./NavBar.css";
import axios from "axios";
import Dark from "../components/Darkmode.css";
import { set } from "react-hook-form";

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

  const [resultadoMostrarCasas, setResultadoMostrarCasas] = useState(false);
  const [resultadoMostrarHabitacion, setResultadoMostrarHabitacion] =
    useState(false);
  const [resultadoMostrarArmario, setResultadoMostrarArmario] = useState(false);
  const [resultadoMostrarCajones, setResultadoMostrarCajones] = useState(false);
  const [resultadoMostrarCosas, setResultadoMostrarCosas] = useState(false);

  const [resetAnimation, setResetAnimation] = useState(false);

  const mostrarCasasFuncion = () => {
    setMostrarCasas(!mostrarCasas);
    setResetAnimation(true);
    setMostrarHabitacion(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarCosas(false);

    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarCasas(!mostrarCasas);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
  };

  const mostrarHabitacionFuncion = () => {
    setMostrarHabitacion(!mostrarHabitacion);
    setMostrarCasas(false);
    setMostrarArmarios(false);
    setMostrarCajones(false);
    setMostrarCosas(false);

    setResetAnimation(true);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarHabitacion(!mostrarHabitacion);
    setResultadoMostrarCasas(false);
    setResultadoMostrarArmario(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
  };

  const mostrarArmariosFuncion = () => {
    setMostrarArmarios(!mostrarArmarios);
    setMostrarCasas(false);
    setMostrarHabitacion(false);
    setMostrarCajones(false);
    setMostrarCosas(false);

    setResetAnimation(true);
    contraerMenuDesplegable();
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
    setResultadoMostrarArmario(!mostrarArmarios);
    setResultadoMostrarCasas(false);
    setResultadoMostrarHabitacion(false);
    setResultadoMostrarCajones(false);
    setResultadoMostrarCosas(false);
  };

  const mostrarCajonesFuncion = () => {
    setMostrarCajones(!mostrarCajones);
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
  };

  const mostrarCosasFuncion = () => {
    setMostrarCosas(!mostrarCosas);
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
  };

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
    navegar("/");
  };
  const login = () => {
    navegar("/");
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
    <div style={Dark}>
      <div className="BarraNavegacion">
        <div className="Logo"></div>

        <div className="Botones">
          {isLoggedIn ? (
            <>
              <button
                onClick={mostrarCasasFuncion}
                className={`VerUOculta ${
                  resetAnimation ? "reset-animation" : ""
                }`}
              >
                {mostrarCasas ? "Ocultar Casa" : "Ver Casa"}
              </button>
              <button
                onClick={mostrarHabitacionFuncion}
                className={`VerUOculta ${
                  resetAnimation ? "reset-animation" : ""
                }`}
              >
                {mostrarHabitacion
                  ? "Ocultar Habitaciones"
                  : "Ver Habitaciones"}
              </button>
              <button
                onClick={mostrarArmariosFuncion}
                className={`VerUOculta ${
                  resetAnimation ? "reset-animation" : ""
                }`}
              >
                {mostrarArmarios ? "Ocultar Armarios" : "Ver Armarios"}
              </button>
              <button
                onClick={mostrarCajonesFuncion}
                className={`VerUOculta ${
                  resetAnimation ? "reset-animation" : ""
                }`}
              >
                {mostrarCajones ? "Ocultar Cajones" : "Ver Cajones"}
              </button>
              <button
                onClick={mostrarCosasFuncion}
                className={`VerUOculta ${
                  resetAnimation ? "reset-animation" : ""
                }`}
              >
                {mostrarCosas ? "Ocultar Cosas" : "Ver Cosas"}
              </button>
              <button onClick={() => casas()}>
                Bienvenido/a {nombreUsuario}
              </button>
              <button onClick={Logout}>Log Out</button>
            </>
          ) : (
            <>
              <button onClick={() => login()}>Login</button>
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
        }}
      />
    </div>
  );
};

export default NavBar;
