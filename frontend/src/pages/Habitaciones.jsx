import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Habitaciones.css";
const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getHabitaciones();
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate.push("/login");
    }
  };
  const getHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        "http://localhost:5000/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
        }
      );
      console.log("Todo correcto", response.data);
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
  };
  const eliminar = async (id) => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/habitaciones/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {},
        }
      );
      console.log("Todo correcto", response.data);
      getHabitaciones();
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
  };

  return (
    <div>
      <h1>Habitaciones</h1>
      <div>
        {habitaciones.map((habitacion) => {
          return (
            <div>
              <h2>{habitacion.nombre}</h2>
              <button onClick={() => eliminar()}>Eliminar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Habitaciones;
