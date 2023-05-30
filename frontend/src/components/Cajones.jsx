import React from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Cajones.css";

export const Cajones = () => {
  const [cajones, setCajones] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isLoadingCajones, setIsloadingCajojes] = useState(false);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(false);
  const navigate = useNavigate();
  const [selectedHabitacion, setSelectedHabitacion] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleHabitacionChange = (event) => {
    setSelectedHabitacion(event.target.value);
  };

  const abrirModal = () => {
    setModalIsOpen(true);
  };
  const cerrarModal = () => {
    setModalIsOpen(false);
  };

  const filteredArmarios = armarios.filter(
    (armario) =>
      armario.nombreHabitacion === selectedHabitacion &&
      armario.nombreArmario !== ""
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    obtenerCajones();
    obtenerHabitaciones();
    obtenerArmarios();
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };

  const obtenerCajones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/cajones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCajones(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const obtenerHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/habitaciones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setHabitaciones(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const obtenerArmarios = async () => {
    setIsLoadingArmarios(true);
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/armarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setArmarios(response.data);
        setIsLoadingArmarios(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingArmarios(false);
      });
  };

  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsloadingCajojes(true);
    await axios
      .post(
        process.env.REACT_APP_API_URL + "/api/cajones/nuevo",
        {
          nombre: data.nombre,
          habitacion: data.habitacion,
          armario: data.armario,
          cosas: [data.cosas],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCajones(response.data);
        setIsloadingCajojes(true);
        window.location.reload();
      })
      .catch((error) => {
        setIsloadingCajojes(false);
        console.log(error);
      });
  };

  const eliminarCajon = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(
        process.env.REACT_APP_API_URL + `/api/cajones/eliminar/${nombre}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Agrupar los armarios por habitación
  const armariosPorHabitacion = armarios.reduce((groups, armario) => {
    const nombreHabitacion = armario.nombreHabitacion;
    if (groups[nombreHabitacion]) {
      groups[nombreHabitacion].push(armario);
    } else {
      groups[nombreHabitacion] = [armario];
    }
    return groups;
  }, {});

  return (
    <div>
      <h1>Cajones</h1>
      <div className="cajones">
        {Object.entries(armariosPorHabitacion).map(
          ([nombreHabitacion, armariosHabitacion]) => (
            <div key={nombreHabitacion} className="habitacion">
              <h2>{nombreHabitacion}</h2>
              <div className="armarios">
                {armariosHabitacion.map((armario) => (
                  <div key={armario._id} className="armario">
                    <h3>{armario.nombre}</h3>
                    <div className="cajones">
                      {cajones
                        .filter((cajon) => cajon.armario === armario._id)
                        .map((cajon) => (
                          <div key={cajon._id} className="cajon">
                            <h4>{cajon.nombre}</h4>
                            <button
                              className="eliminarCajon"
                              onClick={() =>
                                eliminarCajon(cajon.nombre)
                              }></button>
                            <button onClick={abrirModal}></button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <Modal isOpen={modalIsOpen} contentLabel="Example Modal">
        <div className="cajones-form">
          <form onSubmit={handleSubmit(gestorFormulario)}>
            <input
              type="text"
              placeholder="Nombre"
              {...register("nombre", { required: true })}
            />
            <select
              {...register("habitacion", { required: true })}
              onChange={handleHabitacionChange}>
              <option value="">Seleccione una habitación</option>
              {habitaciones.map((habitacion) => (
                <option key={habitacion.id} value={habitacion.id}>
                  {habitacion.nombre}
                </option>
              ))}
            </select>
            <select {...register("armario", { required: true })}>
              <option value="">Seleccione un armario</option>
              {isLoadingArmarios ? (
                <option>Loading...</option>
              ) : (
                filteredArmarios.map((armario) => (
                  <option key={armario.id} value={armario.id}>
                    {armario.nombre}
                  </option>
                ))
              )}
            </select>
            <button type="submit">Guardar</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Cajones;
