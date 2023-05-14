import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../components/Addcasa.css";

const Addcasa = () => {
  const { t } = useTranslation("global");
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // formState: {},
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
        process.env.REACT_APP_API_URL + "/api/casas/nueva",
        {
          nombre: data.nombre,
          direccion: data.direccion,
          ciudad: data.ciudad,
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
        if (response.status === 200) window.location.reload();
        else alert("Error al crear la casa");
      })
      .catch((error) => console.log(error.response.data));
  };

  return (
    <div>
      <form
        className="addCasa"
        action=""
        onSubmit={handleSubmit(gestorFormulario)}
      >
        <input
          type="text"
          placeholder="Nombre de casa"
          {...register("nombre", { minLength: 2, required: true })}
        />
        <br />
        <input
          type="text"
          placeholder="Dirección"
          {...register("direccion", { minLength: 5, required: true })}
        />
        <br />
        <input
          type="text"
          placeholder="Ciudad"
          {...register("ciudad", { minLength: 5, required: true })}
        />
        <br />
        <button type="submit">{t("btn1.btn1")}</button>
      </form>
    </div>
  );
};

export default Addcasa;
