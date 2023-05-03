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
  const getHabitaciones = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Todo correcto", response.data);
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
  };
  const eliminarHabitacion = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(
        `https://whereis-7n5l.onrender.com/api/habitaciones/borrar/${nombre}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId: userId,
          },
        }
      )
      .then((res) => {
        // window.location.reload();
        console.log(nombre);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Habitaciones</h1>
      <div>
        {habitaciones.map((habitacion) => {
          return (
            <div>
              <h2>{habitacion.nombre}</h2>
              <button onClick={() => eliminarHabitacion(habitacion.nombre)}>
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Habitaciones;
