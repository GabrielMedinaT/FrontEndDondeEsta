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
  const [isloadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const navigate = useNavigate();
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
      setIsLoadingHabitaciones(true);
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
    <div className="habitaciones">
      <button
        id="crear"
        className="Crear"
        onClick={abrirModalHabitacion}></button>
      <div id="textoEmergente">Crear</div>
      <div className="cabeceraHabitaciones">
        {habitaciones.length === 0 && <h1>Agregar nivel 2</h1>}
        <h1 className="h1Habitaciones">{habitaciones.nombre}</h1>
      </div>

      <div className="listaSuperiorHabitaciones">
        {habitaciones.map((habitacion) => (
          <ul className="habitacionConcreta" key={habitacion._id}>
            <h1 onClick={() => verArmarios(habitacion._id)}>
              {habitacion.nombre}
            </h1>
            <br />
            <button
              className="eliminarHabitacion"
              onClick={() => obtenerConfirmacion(habitacion.nombre)}></button>
          </ul>
        ))}
      </div>
      {modalAbierto && (
        <ConfirmacionModalHabitacion
          modalAbierto={modalAbierto}
          cerrarModal={() => setModalAbierto(false)}
          eliminarHabitacion={eliminarHabitacion}
          nombreHabitacion={habitacionAEliminar}
        />
      )}

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
        overlayClassName="overlay">
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
