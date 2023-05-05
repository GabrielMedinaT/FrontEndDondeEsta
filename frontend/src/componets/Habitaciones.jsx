import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Habitaciones.css";
import { useForm } from "react-hook-form";

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const navigate = useNavigate();
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const slide = (amount) => {
    const newSlideIndex = slideIndex + amount;
    const maxSlideIndex = (habitaciones.length - 1) * -100;

    if (newSlideIndex > 0 || newSlideIndex < maxSlideIndex) {
      // Si la nueva posición estaría fuera de los límites, no actualizamos el estado
      return;
    }

    setSlideIndex(newSlideIndex);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getHabitaciones();
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate.push("/login");
    }
  };

  const getHabitaciones = async () => {
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
      // console.log("Todo correcto", response.data);
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
        console.log(nombre);
        console.log(res.data);
        // Actualizar la lista de habitaciones después de eliminar una habitación
        setHabitaciones(habitaciones.filter((h) => h.nombre !== nombre));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="Habitaciones">
      <h1>Habitaciones</h1>
      {habitaciones.length === 0 && (
        <h1>No tiene habitaciones puede añadir una </h1>
      )}
      <div className="carousel-container">
        <div
          className="carousel-items"
          style={{ transform: `translateX(${slideIndex}%)` }}
        >
          <div className="listaHabitaciones">
            {habitaciones.map((habitacion) => (
              <ul className="habitacionConcreta" key={habitacion._id}>
                <h2>{habitacion.nombre}</h2>
                <br />
                <button onClick={() => eliminarHabitacion(habitacion.nombre)}>
                  Eliminar
                </button>
              </ul>
            ))}
          </div>
        </div>
        <button
          className="carousel-button carousel-button-left"
          onClick={() => slide(10)}
        >
          ◀
        </button>
        <button
          className="carousel-button carousel-button-right"
          onClick={() => slide(-10)}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Habitaciones;
