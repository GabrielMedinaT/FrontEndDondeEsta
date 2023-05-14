import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Habitaciones.css";
import { useForm } from "react-hook-form";
import ConfirmacionModalHabitacion from "./ConfirmacionModalHabitacion";
import Addhab from "./Addhab";
import Modal from "react-modal";

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const navigate = useNavigate();
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState("");
  const [modalAbiertoHabitacion, setModalAbiertoHabitacion] = useState(false);
  const [modalAbiertoArmarios, setModalAbiertoArmarios] = useState(false);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState("");

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
    getArmarios();
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
      // console.log("Todo correcto", response.data);
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
        // Actualizar la lista de habitaciones después de eliminar una habitación
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
      // console.log("Todo correcto", response.data);
      setArmarios(response.data);
      setIsLoadingArmarios(false);
      // console.log(armarios);
    } catch (error) {
      // console.log("Error al obtener armarios", error.message);
    }
  };
  //*AGRUPAR ARMARIOS POR HABITACION
  const armariosGroupedByHabitacion = armarios.reduce((groups, armario) => {
    const habitacionId = armario.habitacion;
    const habitacion = habitaciones.find((h) => h._id === habitacionId);

    if (habitacion) {
      const nombreHabitacion = habitacion._id;

      if (groups[nombreHabitacion]) {
        groups[nombreHabitacion].push(armario);
      } else {
        groups[nombreHabitacion] = [armario];
      }
    }

    return groups;
  }, {});

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
              <ul
                // className="VerArmarioenHabitacion"
                onClick={() => verArmarios(habitacion._id)}
                className="habitacionConcreta"
                key={habitacion._id}
              >
                <h2>{habitacion.nombre}</h2>
                <br />
                <button onClick={() => obtenerConfirmacion(habitacion.nombre)}>
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
      {modalAbierto && (
        <ConfirmacionModalHabitacion
          modalAbierto={modalAbierto}
          cerrarModal={() => setModalAbierto(false)}
          eliminarHabitacion={eliminarHabitacion}
          nombreHabitacion={habitacionAEliminar}
        />
      )}
      <button onClick={abrirModalHabitacion}>Añadir habitación</button>
      {modalAbiertoHabitacion && (
        <Addhab
          modalAbiertoHabitacion={modalAbiertoHabitacion}
          cerrarModalHabitacion={cerrarModalHabitacion}
          getHabitaciones={getHabitaciones}
        />
      )}
      <Modal
        isOpen={modalAbiertoArmarios}
        onRequestClose={() => setModalAbiertoArmarios(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Armarios de la habitación </h2>
        {isloadingarmarios ? (
          <p>Cargando armarios...</p>
        ) : armariosGroupedByHabitacion[selectedHabitacionId] ? (
          armariosGroupedByHabitacion[selectedHabitacionId].map((armario) => (
            <div key={armario._id}>
              <p>Nombre: {armario.nombre}</p>
            </div>
          ))
        ) : (
          <p>No hay armarios disponibles para esta habitación.</p>
        )}
      </Modal>
    </div>
  );
};

export default Habitaciones;
