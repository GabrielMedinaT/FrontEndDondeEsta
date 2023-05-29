import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ConfirmacionModalHabitacion from "./ConfirmacionModalHabitacion";
import Addhab from "./Addhab";
import Modal from "react-modal";
import "./Habitaciones.css";

const Habitaciones = ({ darkmode }) => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState("");
  const [modalAbiertoHabitacion, setModalAbiertoHabitacion] = useState(false);
  const [modalAbiertoArmarios, setModalAbiertoArmarios] = useState(false);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState("");
  const carouselContainerRef = useRef(null);

  const verArmarios = (habitacionId) => {
    setSelectedHabitacionId(habitacionId);
    setModalAbiertoArmarios(true);
    getArmarios(habitacionId);
  };

  const obtenerConfirmacion = (nombre) => {
    setHabitacionAEliminar(nombre);
    setModalAbierto(true);
  };

  const abrirModalHabitacion = () => {
    setModalAbiertoHabitacion(true);
  };
  const cerrarModalHabitacion = () => {
    setModalAbiertoHabitacion(false);
  };
  const slide = (amount) => {
    const newSlideIndex = slideIndex + amount;
    const maxSlideIndex = (habitaciones.length - 1) * -10;

    if (newSlideIndex > 0 || newSlideIndex < maxSlideIndex) {
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
    getArmarios();

    const handleScroll = () => {
      if (carouselContainerRef.current) {
        const { scrollTop, clientHeight, scrollHeight } =
          carouselContainerRef.current;

        const scrollPercentage =
          (scrollTop / (scrollHeight - clientHeight)) * 100;

        setSlideIndex(scrollPercentage);
      }
    };

    if (carouselContainerRef.current) {
      carouselContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (carouselContainerRef.current) {
        carouselContainerRef.current.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, []);

  //*EXTRAER DATOS DE USUARIO
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };

  //*OBTENER HABITACIONES PARA MOSTRAR EN LA LISTA
  const getHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
  };

  //*ELIMINAR HABITACION
  const eliminarHabitacion = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(
        process.env.REACT_APP_API_URL + `/api/habitaciones/borrar/${nombre}`,
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
        setHabitaciones(habitaciones.filter((h) => h.nombre !== nombre));
      })
      .catch((error) => console.log(error));
  };

  //*OBTENER ARMARIOS
  const getArmarios = async (habitacionId) => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/armarios/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
            habitacion: habitacionId,
          },
        }
      );
      setArmarios(response.data);
      setIsLoadingArmarios(false);
    } catch (error) {
      console.log("Error al obtener armarios", error.message);
    }
  };

  // ...

  return (
    <div className={"Habitaciones"}>
      <h1>Habitaciones</h1>
      <button className="Crear"> </button>
      <div className="carousel-container" ref={carouselContainerRef}>
        <div
          className="carousel-items"
          style={{ transform: `translateY(${slideIndex}%)` }}>
          {habitaciones.map((habitacion) => (
            <div className="carousel-item" key={habitacion._id}>
              <div className="carousel-item-content">
                <div className="carousel-item-header">
                  <h2>{habitacion.nombre}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Habitaciones;
