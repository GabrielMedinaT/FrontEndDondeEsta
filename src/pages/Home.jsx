import React, { useState, useEffect } from "react";
import Habitaciones from "../components/Habitaciones";
import MisArmarios from "../components/MisArmarios";
import Cajones from "../components/Cajones";
import Cosas from "../components/Cosas";
import MisCasas from "../components/MisCasas";
import Buscador from "../components/Buscador";
import axios from "axios";
import { useNavigate } from "react-router";

const Home = ({ mostrarDatos, darkmode }) => {
  const {
    mostrarCasas,
    mostrarHabitacion,
    mostrarArmarios,
    mostrarCajones,
    mostrarCosas,
    mostrarBuscador,
  } = mostrarDatos || {};

  const [isLoadingCasas, setIsLoadingCasas] = useState(true);
  const [isLoadingHabitacion, setIsLoadingHabitacion] = useState(true);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(true);
  const [isLoadingCajones, setIsLoadingCajones] = useState(true);
  const [isLoadingCosas, setIsLoadingCosas] = useState(true);
  const [casas, setCasas] = useState([]);
  const navigate = useNavigate();

  //* SIMULACION DE CARGA ASINCRONA DEBIDO A LA LENTITUD DEL SERVIDOR
  useEffect(() => {
    obtenerCasas();
    setTimeout(() => {
      setIsLoadingCasas(false);
      setIsLoadingHabitacion(false);
      setIsLoadingArmarios(false);
      setIsLoadingCajones(false);
      setIsLoadingCosas(false);
    }, 2000);
  }, []);

  //*OBTENER DATOS DE USUARIO

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      navigate("/home");
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
      return [null, null];
    }
  };

  //*OBTENER CASA
  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/casas/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        }
      );
      setCasas(response.data);
    } catch (error) {}
  };

  return (
    <div
      className={
        darkmode ? "principalSuperiorHome-Dark" : "principalSuperiorHome"
      }>
      {/* DIV DONDE SE MUESTRAN U OCULTAN LOS ELEMENTOS CASA, HABITACION, ARMARIO, CAJON, COSAS */}
      <div
        className={darkmode ? "principalHomeHome-Dark" : "principalHomeHome"}>
        {mostrarBuscador && (
          <div className={darkmode ? "buscador-Dark" : "buscador"}>
            <Buscador darkmode={darkmode} />
          </div>
        )}
        {mostrarCasas && (
          <div className={darkmode ? "verLaCasa-Dark" : "verLaCasa"}>
            {isLoadingCasas ? (
              <div>Cargando casas...</div>
            ) : (
              <MisCasas darkmode={darkmode} />
            )}
          </div>
        )}
        {mostrarHabitacion && (
          <div className="VerLaHabitacion">
            {isLoadingHabitacion ? (
              <div>Cargando habitaciones...</div>
            ) : (
              <>
                <Habitaciones darkmode={darkmode} />
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
              <MisArmarios darkmode={darkmode} />
            )}
          </div>
        )}
        {mostrarCajones && (
          <div className="VerLosCajones">
            {isLoadingCajones ? (
              <div>Cargando cajones...</div>
            ) : (
              <Cajones darkmode={darkmode} />
            )}
          </div>
        )}
        {mostrarCosas && (
          <div className="VerLasCosas">
            {isLoadingCosas ? (
              <div>Cargando cosas...</div>
            ) : (
              <Cosas darkmode={darkmode} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
