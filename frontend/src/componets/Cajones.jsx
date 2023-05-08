import React from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

export const Cajones = () => {
  const [cajones, setCajones] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isLoadingCajones, setIsloadingCajojes] = useState(false);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(false);
  const navigate = useNavigate();
  const [selectedHabitacion, setSelectedHabitacion] = useState("");
  const handleHabitacionChange = (event) => {
    setSelectedHabitacion(event.target.value);
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

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };
  //*VER CAJONES
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
  //*VER HABITACIONES
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
  //* VER ARMARIOS
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

  useEffect(() => {
    obtenerCajones();
    obtenerHabitaciones();
    obtenerArmarios();
  }, []);

  //*CREAR CAJONES
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

  //*AGRUPAR CAJONES POR ARMARIO
  const cajonesPorArmario =
    cajones.length > 0
      ? cajones.reduce((groups, cajon) => {
          const nombreArmario = cajon.nombre;
          if (groups[nombreArmario]) {
            groups[nombreArmario].push(cajon);
          } else {
            groups[nombreArmario] = [cajon];
          }
          return groups;
        }, {})
      : {};

  //*ELIMINAR CAJONES
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

  return (
    <div>
      <h1>Cajones</h1>
      <div className="cajones">
        {Object.entries(cajonesPorArmario).map(
          ([nombreArmario, cajonesArmario]) => (
            <div key={nombreArmario} className="cajones-armario">
              <h2>{nombreArmario}</h2>
              <div className="cajones-armario-list">
                {Array.isArray(cajonesArmario) &&
                  cajonesArmario.map((cajon) => (
                    <div key={cajon._id} className="cajones-armario-item">
                      <button onClick={() => eliminarCajon(cajon.nombre)}>
                        Eliminar
                      </button>
                      <div className="cajones-armario-item-text">
                        <h2>{cajon.nombre}</h2>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>
      <div className="cajones-form">
        <form onSubmit={handleSubmit(gestorFormulario)}>
          <input
            type="text"
            placeholder="Nombre"
            {...register("nombre", { required: true })}
          />
          <select
            {...register("habitacion", { required: true })}
            onChange={handleHabitacionChange}
          >
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
    </div>
  );
};

export default Cajones;
