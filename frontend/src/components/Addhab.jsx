import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
// import Config from "@cloudinary/url-gen/config/BaseConfig";
import { useEffect } from "react";
import { useState } from "react";
// import Addcasa from "../componets/Addcasa";
// import MisArmarios from "../componets/MisArmarios";
// import Habitaciones from "../componets/Habitaciones";

const Addhab = () => {
  const { t } = useTranslation("global");
  // const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  // const [addHabi, setddHabi] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingCasas(true);

    await axios
      .get(process.env.REACT_APP_API_URL + `/api/casas`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    obtenerCasas();
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };

  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitaciones(true); // Inicia el estado de carga de las habitaciones

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/habitaciones/nueva",
        {
          casa: data.nombre,
          nombre: data.habitacion,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            nombre: data.nombre,
          },
        }
      );

      setIsLoadingHabitaciones(false); // Finaliza el estado de carga de las habitaciones

      if (response.status === 200) {
        // Actualizar la lista de habitaciones después de agregar una nueva habitación
        setHabitaciones([...habitaciones, { nombre: data.habitacion }]);
        window.location.reload("/Addhab");
      } else {
        alert("Error al crear la casa");
      }
    } catch (error) {
      setIsLoadingHabitaciones(false);
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <select {...register("nombre", { required: true })}>
          <option value="">Seleccione casa</option>
          {isLoadingCasas ? (
            <option value="">{t("loading")}</option>
          ) : (
            casas &&
            casas.length > 0 &&
            casas.map((casa) => (
              <option key={casa._id} value={casa.nombre}>
                {casa.nombre}
              </option>
            ))
          )}
        </select>

        <input
          type="text"
          placeholder="Nombre de la habitacion"
          {...register("habitacion", { minLength: 3, required: true })}
        />

        <button type="submit">{t("btn1.btn1")}</button>
      </form>
    </div>
  );
};

export default Addhab;