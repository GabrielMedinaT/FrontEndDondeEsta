import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Config from "@cloudinary/url-gen/config/BaseConfig";
import { useEffect } from "react";
import { useState } from "react";
import Addcasa from "../componets/Addcasa";
import MisArmarios from "../componets/MisArmarios";
import Habitaciones from "../componets/Habitaciones";

const Addhab = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();

    setIsLoadingCasas(true);

    await axios
      .get(`https://whereis-7n5l.onrender.com/api/casas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Todo correcto", response.data);
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
    await axios
      .post(
        "https://whereis-7n5l.onrender.com/api/habitaciones/nueva",
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
      )
      .then((response) => {
        setIsLoadingHabitaciones(false); // Finaliza el estado de carga de las habitaciones
        console.log("Todo correcto", response.data);
        window.location.reload();
        if (response.status === 200) navigate("/MisCasas");
        else alert("Error al crear la casa");
      })
      .catch((error) => {
        setIsLoadingHabitaciones(false);
        console.log(error.response.data);
      });
  };

  return (
    <div>
      {habitaciones.length > 0 && (
        <div>
          <button onClick={() => setHabitaciones([])}>
            Ocultar habitaciones
          </button>
          <ul>
            <li></li>
            <button onClick={() => habitaciones()}>
              Ver todas las Habitaciones
            </button>
          </ul>
        </div>
      )}
      <br />
      {habitaciones.length > 0 && (
        <div>
          <Habitaciones />
          <button onClick={() => setHabitaciones([])}>
            Ocultar habitaciones
          </button>
          <ul>
            <li>
              <li></li>
            </li>
            <button onClick={() => habitaciones()}>
              Ver todas las Habitaciones
            </button>
          </ul>
          <div>
            <MisArmarios />
          </div>
        </div>
      )}

      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <select {...register("nombre", { required: true })}>
          {isLoadingCasas ? (
            <option value="">{t("loading")}</option>
          ) : (
            casas &&
            casas.length > 0 &&
            casas.map((casa) => (
              <option key={casa._id} value={casa.nombre}>
                {casa.nombre}
                {console.log(casa.nombre)}
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
