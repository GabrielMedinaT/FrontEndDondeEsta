import React, { useState, useEffect } from "react";
import "./Home.css";
import MisCasas from "../pages/MisCasas";
import Habitaciones from "../components/Habitaciones";
import MisArmarios from "../components/MisArmarios";
import Cajones from "../components/Cajones";
import Cosas from "../components/Cosas";

const Home = () => {
  const [mostrarCasas, setMostrarCasas] = useState(false);
  const [mostrarHabitacion, setMostrarHabitacion] = useState(false);
  const [mostrarArmarios, setMostrarArmarios] = useState(false);
  const [mostrarCajones, setMostrarCajones] = useState(false);
  const [mostrarCosas, setMostrarCosas] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(true);
  const [isLoadingHabitacion, setIsLoadingHabitacion] = useState(true);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(true);
  const [isLoadingCajones, setIsLoadingCajones] = useState(true);
  const [isLoadingCosas, setIsLoadingCosas] = useState(true);

  //*SIMULACION DE CARGA ASINCRONA DEBIDO A LA LENTITUD DEL SERVIDOR
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingCasas(false);
      setIsLoadingHabitacion(false);
      setIsLoadingArmarios(false);
      setIsLoadingCajones(false);
      setIsLoadingCosas(false);
    }, 2000);
  }, []);

  const mostrarCasasFuncion = () => {
    setMostrarCasas(!mostrarCasas);
    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
  };

  const mostrarHabitacionFuncion = () => {
    setMostrarHabitacion(!mostrarHabitacion);
    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
  };
  const mostrarArmariosFuncion = () => {
    setMostrarArmarios(!mostrarArmarios);
    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
  };

  const mostrarCajonesFuncion = () => {
    setMostrarCajones(!mostrarCajones);
    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
  };

  const mostrarCosasFuncion = () => {
    setMostrarCosas(!mostrarCosas);
    setResetAnimation(true);
    setTimeout(() => {
      setResetAnimation(false);
    }, 500);
  };

  return (
    <div className="principalSuperior">
      {/* BOTONES PARA VER U OCULTAR */}
      <div className="botonesVerOcultar">
        <button
          onClick={mostrarCasasFuncion}
          className={`VerUOcultar ${resetAnimation ? "reset-animation" : ""}`}
        >
          {mostrarCasas ? "OCULTAR CASA" : "VER CASA"}
        </button>
        <button
          onClick={mostrarHabitacionFuncion}
          className={`VerUOcultar ${resetAnimation ? "reset-animation" : ""}`}
        >
          {mostrarHabitacion ? "Ocultar Habitaciones" : "Ver Habitaciones"}
        </button>
        <button
          onClick={mostrarArmariosFuncion}
          className={`VerUOcultar ${resetAnimation ? "reset-animation" : ""}`}
        >
          {mostrarArmarios ? "Ocultar Armarios" : "Ver Armarios"}
        </button>
        <button
          onClick={mostrarCajonesFuncion}
          className={`VerUOcultar ${resetAnimation ? "reset-animation" : ""}`}
        >
          {mostrarCajones ? "Ocultar Cajones" : "Ver Cajones"}
        </button>
        <button
          onClick={mostrarCosasFuncion}
          className={`VerUOcultar ${resetAnimation ? "reset-animation" : ""}`}
        >
          {mostrarCosas ? "Ocultar Cosas" : "Ver Cosas"}
        </button>
      </div>
      {/* DIV DONDE SE MUESTRAN U OCULTAN LOS ELEMENTOS CASA, HABITACION, ARMARIO, CAJON, COSAS */}
      <div className="principalHome">
        {mostrarCasas && (
          <div className="verLaCasa">
            {isLoadingCasas ? <div>Cargando casas...</div> : <MisCasas />}
          </div>
        )}
        {mostrarHabitacion && (
          <div className="VerLaHabitacion">
            {isLoadingHabitacion ? (
              <div>Cargando habitaciones...</div>
            ) : (
              <Habitaciones />
            )}
          </div>
        )}
        {mostrarArmarios && (
          <div className="VerLosArmarios">
            {isLoadingArmarios ? (
              <div>Cargando armarios...</div>
            ) : (
              <MisArmarios />
            )}
          </div>
        )}
        {mostrarCajones && (
          <div className="VerLosCajones">
            {isLoadingCajones ? <div>Cargando cajones...</div> : <Cajones />}
          </div>
        )}
        {mostrarCosas && (
          <div className="VerLasCosas">
            {isLoadingCosas ? <div>Cargando cosas...</div> : <Cosas />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
