import React from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export const Cajones = () => {
  const [cajones, setCajones] = useState([]);
  const [isLoadingCajones, setIsloadingCajojes] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      // console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };
  const obtenerCajones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get("https://whereis-7n5l.onrender.com/api/cajones", {
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
  useEffect(() => {
    const delay = setTimeout(() => {
      obtenerCajones();
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsloadingCajojes(true);
    await axios
      .post(
        "https://whereis-7n5l.onrender.com/api/cajones/nuevo",
        {
          nombre: data.nombre,
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
      })
      .catch((error) => {
        setIsloadingCajojes(false);

        console.log(error);
      });
  };

  return (
    <div>
      <h1>Cajones</h1>
      <div className="cajones">
        <div className="cajones-list">
          {cajones.map((cajon) => {
            return (
              <div key={cajon._id} className="cajones-item">
                <div className="cajones-item-text">
                  <h2>{cajon.nombre}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cajones-form">
        <form onSubmit={handleSubmit(gestorFormulario)}>
          <input
            type="text"
            placeholder="Nombre"
            {...register("nombre", { required: true })}
          />
          <input
            type="text"
            placeholder="Armario"
            {...register("armario", { required: true })}
          />
          <button type="submit">Guardar </button>
        </form>
      </div>
    </div>
  );
};

export default Cajones;
