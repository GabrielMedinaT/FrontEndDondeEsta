import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "react-modal";
import "../components/Addcasa.css";
import { useState, useEffect } from "react";

Modal.setAppElement("#root");

const Addhab = ({ modalAbiertoHabitacion, cerrarModalHabitacion }) => {
  const { t } = useTranslation("global");
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
      .get(process.env.REACT_APP_API_URL + `/api/casas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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
    setIsLoadingHabitaciones(true);

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

      setIsLoadingHabitaciones(false);

      if (response.status === 200) {
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
    <Modal
      isOpen={modalAbiertoHabitacion}
      onRequestClose={cerrarModalHabitacion}
      className="modal"
      overlayClassName="overlay"
    >
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
              </option>
            ))
          )}
        </select>

        <input
          type="text"
          placeholder="          Nombre de la habitacion"
          {...register("habitacion", { minLength: 3, required: true })}
        />

        <button type="submit">{t("btn1.btn1")}</button>
      </form>
    </Modal>
  );
};

export default Addhab;
