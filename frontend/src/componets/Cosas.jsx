import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";

const Cosas = () => {
  const [cosas, setCosas] = useState([]);
  const [isLoadingCosas, setLoadingCosas] = useState(false);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(false);
  const [habitaciones, setHabitaciones] = useState([]);
  const [shouldReload, setShouldReload] = useState(false); // variable para determinar si se debe recargar la lista de cosas
  const navigate = useNavigate();
  const [armarios, setArmarios] = useState([]);
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
  //*AÑADIR COSAS
  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setLoadingCosas(true);
    await axios
      .post(
        process.env.REACT_APP_API_URL + "/api/cosas/nuevo",
        {
          nombre: data.nombre,
          descripcion: data.descripcion,
          clasificacion: data.clasificacion,
          cajon: data.cajon,
          armario: data.armario,
          habitacion: data.habitacion,
          casa: data.casa,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setLoadingCosas(false);
        setShouldReload(true); // actualizar la variable para que se recargue la lista de cosas
      })
      .catch((err) => {
        console.log(err);
        setLoadingCosas(false);
      });
  };

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate.push("/login");
    }
  };
  //*VER COSAS
  const verCosas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/cosas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCosas(response.data);
      console.log(cosas);
      setLoadingCosas(false);
    } catch (error) {
      console.log(error);
      setLoadingCosas(false);
    }
  };

  //*ELIMINAR COSAS
  const eliminarCosas = async (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();

    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + "/api/cosas/" + nombre,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setLoadingCosas(true);
      setShouldReload(true); // actualizar la variable para que se recargue la lista de cosas
      setLoadingCosas(false);
    } catch (error) {
      console.log(error);

      setLoadingCosas(false);
    }
  };

  //*OBTENER HABITACIONES

  const obtenerHabitaciones = async () => {
    setIsLoadingArmarios(true);
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/habitaciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        }
      );
      console.log(response);
      setHabitaciones(response.data);
      setIsLoadingArmarios(false);
    } catch (error) {
      console.log(error);
      setIsLoadingArmarios(false);
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
    verCosas();
  }, []);

  return (
    <div>
      <h1>Cosas</h1>

      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <input
          type="text"
          placeholder="Nombre"
          {...register("nombre", { required: true })}
        />
        <br />
        <label>Desccripcion</label>
        <br />
        <select
          {...register("descripcion", { required: true })}
          name="descripcion"
        >
          <option value="">Selecciona una descripción</option>
          <option value="Herramienta">Herramienta</option>
          <option value="Escolar">Escolar</option>
          <option value="Informática">Informática</option>
          <option value="Cocina">Cocina</option>
          <option value="Ropa">Ropa</option>
          <option value="Jueguetes">Juguetes</option>
          <option value="Salun y bienestar">Salud y Bienestar</option>
          <option value="Jardineria">Jardineria</option>
          <option value="Cine y peliculas">Cine y Peliculas</option>
          <option value="Arte y manualidades">Arte y manualidades</option>
          <option value="Libros">Libros</option>
          <option value="Comics, manga y novela gráfica">
            Comics, manga y novela gráfica
          </option>
        </select>

        <select
          {...register("clasificacion", { required: true })}
          name="clasificacion"
        >
          <option value="">Selecciona una clasificación</option>
          <option value="Importante">Importante</option>
          <option value="Imprescindible">Imprescindible</option>
          <option value="Normal">Normal</option>
        </select>
        <input
          type="text"
          placeholder="Casa"
          {...register("casa", { required: false })}
        />

        <input
          type="text"
          placeholder="Cajon"
          {...register("cajon", { required: false })}
        />
        <input
          type="text"
          placeholder="Armario"
          {...register("armario", { required: false })}
        />
        <select
          {...register("habitacion", { required: false })}
          onChange={handleHabitacionChange}
        >
          <option value="">Seleccione una habitación</option>
          {habitaciones.map((habitacion) => (
            <option key={habitacion._id} value={habitacion._id}>
              {habitacion.nombre}
            </option>
          ))}
        </select>
        <button>Añadir</button>
      </form>
      <div className="cosas">
        {cosas.map((cosa, index) => {
          return (
            <div key={cosa._id}>
              <h2>{cosa.nombre}</h2>
              <button onClick={() => eliminarCosas(cosa.nombre)}>
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cosas;
