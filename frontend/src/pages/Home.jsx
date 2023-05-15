import React, { useState, useEffect } from "react";
import MisCasas from "../pages/MisCasas";
import Habitaciones from "../components/Habitaciones";
import MisArmarios from "../components/MisArmarios";
import Cajones from "../components/Cajones";
import Cosas from "../components/Cosas";
import Addhab from "../components/Addhab";
// import "./DarkMode.css";
import "./Home.css";

const Home = ({ mostrarDatos, darkmode }) => {
  const {
    mostrarCasas,
    mostrarHabitacion,
    mostrarArmarios,
    mostrarCajones,
    mostrarCosas,
  } = mostrarDatos || {};

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

  return (
    <div className={"principalSuperiorHome"}>
      {/* DIV DONDE SE MUESTRAN U OCULTAN LOS ELEMENTOS CASA, HABITACION, ARMARIO, CAJON, COSAS */}

      <div
        className={darkmode ? "principalHomeHome-Dark" : "principalHomeHome"}
      >
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
              <>
                <Habitaciones />
                {/* <Addhab /> */}
              </>
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
