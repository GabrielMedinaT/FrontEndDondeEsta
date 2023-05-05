import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Habitaciones from "./Habitaciones";

const MisArmarios = () => {
  const [armarios, setArmarios] = useState([]);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(true);
  const [isLoadingHabitacion, setIsLoadingHabitacion] = useState(false);
  const [habitacion, setHabitacion] = useState([]);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);

  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);

  useEffect(() => {
    getArmarios();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };

  //*USE EFECCT
  useEffect(() => {
    obtenerHabitaciones();
    obtenerCasas();
  }, []);
  //*OBTENER ARMARIOS
  const getArmarios = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/armarios/",
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
      console.log("Todo correcto", response.data);
      setArmarios(response.data);
      console.log(armarios);
    } catch (error) {
      console.log("Error al obtener armarios", error.message);
    }
  };
  //*OBTENER CASAS
  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingCasas(true);
    await axios
      .get(`https://whereis-7n5l.onrender.com/api/casas`, {
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
        `https://whereis-7n5l.onrender.com/api/armarios/borrar/${nombre}`,
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
      })
      .catch((error) => console.log(error));
  };
  //*EDITAR ARMARIOS
  const editarArmario = (nombre) => {
    axios
      .patch(
        `https://whereis-7n5l.onrender.com/api/armarios/editar/${nombre}`,
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
        "https://whereis-7n5l.onrender.com/api/armarios/nuevo",
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
      .then((res) => {})
      .catch((error) => console.log(error + " " + userId));
  };
  //*VER HABITACIONES
  const obtenerHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitacion(true);
    await axios
      .get("https://whereis-7n5l.onrender.com/api/habitaciones", {
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
  const armariosLength = armarios.length;

  return (
    <div>
      <h1>Mis armarios</h1>
      {armariosLength === 0 && <h1>No tiene armarios </h1>}
      <ul className="armariosLista">
        {armarios.map((armario) => (
          <li key={armario._id}>
            {armario.nombre}

            <button onClick={() => eliminarArmario(armario.nombre)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <form action="" onSubmit={handleSubmit(addArmarios)}>
        <input
          type="text"
          placeholder="Nombre del armario"
          {...register("nombre", { required: true })}
        />
        {errors.nombre && <span>Este campo es obligatorio</span>}
        <select {...register("habitacion", { required: true })}>
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
        <button onClick={addArmarios}>Añadir armario</button>
      </form>
    </div>
  );
};

export default MisArmarios;
