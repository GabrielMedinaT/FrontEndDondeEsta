import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useForm } from "react-hook-form";

const MisArmarios = () => {
  const [armarios, setArmarios] = useState([]);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(true);
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
  const getArmarios = async () => {
    try {
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/armarios/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Todo correcto", response.data);
      setArmarios(response.data);
    } catch (error) {
      console.log("Error al obtener armarios", error.message);
    }
  };

  const eliminarArmario = (nombre) => {
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
        window.location.reload();
        console.log(nombre);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

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
  const addArmarios = async (data) => {
    axios
      .post("https://whereis-7n5l.onrender.com/api/armarios/nuevo", {
        nombre: data.nombre,
        casa: data.casa,
        habitacion: data.habitacion,

        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: userId,
        },
      })
      .then((res) => {
        console.log(data.nombre);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Mis armarios</h1>

      <ul className="armariosLista">
        {armarios.map((armario) => (
          <li key={armario.id}>
            {armario.nombre}
            <br />
            {armario.ciudad}
            <br />
            <button onClick={() => editarArmario(armario.nombre)}>
              Editar
            </button>
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
        <input
          type="text"
          placeholder="Habitacion"
          {...register("habitacion", { required: true })}
        />
        {errors.habitacion && <span>Este campo es obligatorio</span>}
        <input
          type="text"
          placeholder="Casa"
          {...register("casa", { required: true })}
        />
        {errors.casa && <span>Este campo es obligatorio</span>}
        <button onClick={addArmarios}>Añadir armario</button>
      </form>
    </div>
  );
};

export default MisArmarios;
