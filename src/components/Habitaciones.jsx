import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Addhab from "./Addhab";
import Modal from "react-modal";
import "./Habitaciones.css";

const Habitaciones = ({ darkmode }) => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const [isloadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState("");
  const [modalAbiertoHabitacion, setModalAbiertoHabitacion] = useState(false);
  const [modalAbiertoArmarios, setModalAbiertoArmarios] = useState(false);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState("");
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  const verArmarios = (habitacionId) => {
    setSelectedHabitacionId(habitacionId);
    setModalAbiertoArmarios(true);
    getArmarios(habitacionId);
  };

  const obtenerConfirmacion = (nombre) => {
    setHabitacionAEliminar(nombre);
    setModalAbierto(true);
  };

  const eliminarHabitacionModal = (nombre) => {
    setModalEliminarAbierto(true);
    setHabitacionAEliminar(nombre);
  };
  const cerrarModalEliminar = () => {
    setModalEliminarAbierto(false);
  };

  const editar = (habitacionId) => {
    setSelectedHabitacionId(habitacionId);
    setModalEditarAbierto(true);
  };
  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
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

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };

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
      console.log(response.data);
      setIsLoadingHabitaciones(true);
    } catch (error) {
      console.error("Error al obtener habitaciones", error);
    }
  };

  const eliminarHabitacion = async (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/habitaciones/borrar/${nombre}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId: userId,
          },
        }
      );
      setHabitaciones(habitaciones.filter((h) => h.nombre !== nombre));
    } catch (error) {
      console.error("Error al eliminar habitacion", error);
    }
  };

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
      console.error("Error al obtener armarios", error);
    }
  };

  const editarHabitacion = async (nombre, nuevoNombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/habitaciones/editar/${nombre}`,
        {
          nuevoNombre: nuevoNombre,
          userId: userId,
        },
        {
          headers: {
            nombre: nombre,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabitaciones(
        habitaciones.map((h) => {
          if (h.nombre === nombre) {
            h.nombre = nuevoNombre;
          }
          return h;
        })
      );
    } catch (error) {
      console.error("Error al editar habitacion", error);
    }
  };
  console.log(modalAbiertoHabitacion);
  const onEditarHabitacion = (data) => {
    editarHabitacion(
      habitaciones.find((h) => h._id === selectedHabitacionId).nombre,
      data.nombre
    );
    setModalAbiertoHabitacion(false);
  };

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

  // Aquí deberías seguir con el código de tu UI...

  return (
    <div className="habitaciones">
      <button
        id="crear"
        className="Crear"
        onClick={() => setModalAbiertoHabitacion(true)}></button>
      {habitaciones.length === 0 && (
        <div className="cabeceraHabitaciones">
          <h1>Agregar nivel 2</h1>
        </div>
      )}

      <div className="listaSuperiorHabitaciones">
        {habitaciones.map((habitacion) => (
          <ul className="habitacionConcreta" key={habitacion._id}>
            <h1 onClick={() => verArmarios(habitacion._id)}>
              {habitacion.nombre}
            </h1>
            <button onClick={() => editar(habitacion._id)}>editar</button>
            <br />
            <button
              className="eliminarHabitacion"
              onClick={() => {
                eliminarHabitacionModal(habitacion.nombre);
                setModalAbierto(true);
              }}></button>
          </ul>
        ))}
      </div>
      {/* MODAL EDITAR */}
      <Modal
        isOpen={modalEditarAbierto}
        onRequestClose={() => setModalEditarAbierto(false)}
        className="modal"
        overlayClassName="modal-fondo">
        <div className="close-modal">
          <button onClick={cerrarModalEditar}>&times;</button>
        </div>
        <h1 className="tituloModal">Editar habitación</h1>
        <form className="form" onSubmit={handleSubmit(onEditarHabitacion)}>
          <input {...register("nombre", { required: true })} />
          <button type="submit" className="modal-btn">
            Actualizar
          </button>
        </form>
      </Modal>
      {/* MODAL ELIMINAR */}
      <Modal
        isOpen={modalEliminarAbierto}
        onRequestClose={() => setModalEliminarAbierto(false)}
        className="modal"
        overlayClassName="modal-fondo">
        <div className="close-modal">
          <button onClick={cerrarModalEliminar}>&times;</button>
        </div>
        <h1 className="tituloModal">Eliminar habitación</h1>
        <p>¿Estás seguro de que quieres eliminar esta habitación?</p>
        <div className="modal-btns">
          <button onClick={cerrarModalEliminar}>Cancelar</button>
          <button onClick={() => eliminarHabitacion(habitacionAEliminar)}>
            Eliminar
          </button>
        </div>
      </Modal>

      {/* MODAL CREAR */}
      <Addhab
        isOpen={modalAbiertoHabitacion}
        setIsOpen={setModalAbiertoHabitacion}
        isloadingHabitaciones={isloadingHabitaciones}
        setIsLoadingHabitaciones={setIsLoadingHabitaciones}
        getHabitaciones={getHabitaciones}
        habitaciones={habitaciones}
        setHabitaciones={setHabitaciones}
      />
    </div>
  );
};

export default Habitaciones;
