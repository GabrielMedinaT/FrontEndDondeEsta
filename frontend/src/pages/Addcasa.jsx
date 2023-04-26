import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Config from "@cloudinary/url-gen/config/BaseConfig";

const Addcasa = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const gestorFormulario = async (data) => {
    await axios

      .post(
        "http://localhost:5000/api/casas/nueva",

        {
          nombre: data.nombre,
          direccion: data.direccion,
          ciudad: data.ciudad,
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
      <button onClick={() => i18n.changeLanguage("es")}>ES</button>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
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
          placeholder="Dirección"
          {...register("direccion", { minLength: 5, required: true })}
        />
        <input
          type="text"
          placeholder="Ciudad"
          {...register("ciudad", { minLength: 5, required: true })}
        />
        <button type="submit">{t("btn1.btn1")}</button>
      </form>
    </div>
  );
};

export default Addcasa;
