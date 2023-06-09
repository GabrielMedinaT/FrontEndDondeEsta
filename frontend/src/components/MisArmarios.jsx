import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import "../pages/Home.css";
import Modal from "react-modal";

const MisArmarios = ({ darkmode }) => {
  //*CONST NECESARIAS PARA LA LÓGICA DEL COMPONENTE
  const [armarios, setArmarios] = useState([]);
  const [isLoadingHabitacion, setIsLoadingHabitacion] = useState(false);
  const [habitacion, setHabitacion] = useState([]);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const { token, userId } = useContext(AuthContext);
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [nombreArmario, setNombreArmario] = useState("");

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const verElFormulario = (nombre) => {
    setNombreArmario(nombre);
    setModalEliminar(true);
  };

  //*USE EFECCT
  useEffect(() => {
    getArmarios();
    obtenerHabitaciones();
    obtenerCasas();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //*EXTRAER LOS DATOS DE LOS USUARIOS PARA HACER LA VERIFICACIÓN DE USUARIO
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };

  //*OBTENER ARMARIOS
  const getArmarios = async () => {
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
            armarioId: armarios._id,
          },
        }
      );
      setArmarios(response.data);
    } catch (error) {}
  };
  //*OBTENER CASAS
  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingCasas(true);
    await axios
      .get(process.env.REACT_APP_API_URL + `/api/casas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: userId,
        },
      })
      .then((response) => {
        // console.log("Todo correcto", response.data);
        setCasas(response.data);
        setIsLoadingCasas(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setIsLoadingCasas(false);
      });
  };
  //*ELIMINAR ARMARIOS
  const eliminarArmario = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(
        process.env.REACT_APP_API_URL + `/api/armarios/borrar/${nombre}`,
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
        // console.log(nombre);
        console.log(res.data);
        setArmarios(armarios.filter((h) => h.nombre !== nombre));
        setModalEliminar(false);
      })
      .catch((error) => console.log(error));
  };
  //*EDITAR ARMARIOS
  const editarArmario = (nombre) => {
    axios
      .patch(process.env.REACT_APP_API_URL + `/api/armarios/editar/${nombre}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: userId,
        },
      })
      .then((res) => {
        window.location.reload();
        console.log(nombre);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };
  //*CREAR ARMARIOS
  const addArmarios = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .post(
        process.env.REACT_APP_API_URL + "/api/armarios/nuevo",
        {
          nombre: data.nombre,
          casa: data.casa,
          habitacion: data.habitacion,
          usuario: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => console.log(error + " " + userId));
  };
  //*VER HABITACIONES
  const obtenerHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitacion(true);
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/habitaciones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setHabitacion(response.data);
        setIsLoadingHabitacion(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingHabitacion(false);
      });
  };
  //*VER ARMARIOS AGRUPADOS POR HABITACIONES
  const armariosGroupedByHabitacion = armarios.reduce((groups, armario) => {
    const nombreHabitacion = armario.nombreHabitacion;
    if (groups[nombreHabitacion]) {
      groups[nombreHabitacion].push(armario);
    } else {
      groups[nombreHabitacion] = [armario];
    }
    return groups;
  }, {});

  const armariosLength = armarios.length;
  return (
    <div className={darkmode ? "Armarios-Dark" : "Armarios"}>
      <div className="tituloArmarios">
        <h1 className="h1muebles">Mis muebles</h1>
        <button
          className="agregarMueble"
          onClick={() => setModalAbierto(true)}
        ></button>
      </div>
      <div className="listaArmarios">
        {Object.entries(armariosGroupedByHabitacion).map(
          ([nombreHabitacion, armarios]) => (
            <div
              className={
                darkmode ? "armariosHabitacion-Dark" : "armariosHabitacion"
              }
              key={nombreHabitacion}
            >
              <h1 className="nombrehabitacion">{nombreHabitacion}</h1>
              {armarios.map((armario) => (
                <div
                  className={
                    darkmode ? "armarioConcreto-Dark" : "armarioConcreto"
                  }
                  key={armario._id}
                >
                  <h4>{armario.nombre}</h4>
                  <button
                    className="eliminarArmario"
                    onClick={() => verElFormulario(armario.nombre)}
                  ></button>
                </div>
              ))}
              <Modal
                className="modal"
                isOpen={modalEliminar}
                isClose={cerrarModal}
              >
                <h1>¿Estás seguro de que quieres eliminarlo?</h1>
                <button onClick={() => eliminarArmario(nombreArmario)}>
                  Sí
                </button>
                <button onClick={() => setModalEliminar(false)}>No</button>
              </Modal>
            </div>
          )
        )}
      </div>
      {armariosLength === 0 && <h1>No tiene armarios </h1>}
      {/* //*CREAR ARMARIOS */}

      <br />
      <br />
      <Modal className="modal" isOpen={modalAbierto}>
        <form action="" onSubmit={handleSubmit(addArmarios)}>
          <input
            type="text"
            placeholder="Nombre del armario"
            {...register("nombre", { required: true })}
          />
          {errors.nombre && <span>Este campo es obligatorio</span>}
          <select {...register("casa", { required: true })}>
            {isLoadingCasas ? (
              <option>Cargando...</option>
            ) : (
              casas.map((casa) => (
                <option key={casa.id} value={casa.id}>
                  {casa.nombre}
                </option>
              ))
            )}
          </select>
          <select {...register("habitacion", { required: true })}>
            <option value="">Seleccione una habitación</option>
            {isLoadingHabitacion ? (
              <option>Cargando...</option>
            ) : (
              habitacion.map((habitacion) => (
                <option key={habitacion.id} value={habitacion.id}>
                  {habitacion.nombre}
                </option>
              ))
            )}
          </select>

          <button onClick={addArmarios}>Añadir armario</button>
        </form>
        <button onClick={() => setModalAbierto(false)}>Cerrar</button>
      </Modal>

      {/* //*MIS ARMARIOS */}
    </div>
  );
};

export default MisArmarios;
