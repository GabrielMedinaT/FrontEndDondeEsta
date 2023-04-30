import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Config from "@cloudinary/url-gen/config/BaseConfig";

const Addhab = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
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

  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();

    await axios
      .post(
        "http://localhost:5000/api/habitaciones/nueva",
        {
          casa: data.nombre,
          nombre: data.habitacion,
          userId: userId, // Agrega el id del usuario al objeto que se envía al servidor
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token de autorización en el objeto de configuración de axios
          },
        }
      )
      .then((response) => {
        console.log("Todo correcto", response.data);
        if (response.status === 200) navigate("/MisCasas");
        else alert("Error al crear la casa");
      })
      .catch((error) => console.log(error.response.data));
  };

  return (
    <div>
      <br />

      <button onClick={() => navigate("/AdjuntarHabitacion")}>
        {t("btn2.btn2")}
      </button>
      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <input
          type="text"
          placeholder="Nombre de casa"
          {...register("nombre", { minLength: 2, required: true })}
        />
        <input
          type="text"
          placeholder="Nombre de la habitacion"
          {...register("habitacion", { minLength: 5, required: true })}
        />

        <button type="submit">{t("btn1.btn1")}</button>
      </form>
    </div>
  );
};

export default Addhab;
