import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "react-modal";
import { useState, useEffect } from "react";

Modal.setAppElement("#root");

const Addhab = ({ modalAbiertoHabitacion, cerrarModalHabitacion }) => {
  const { t } = useTranslation("global");
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [notificacionVisible, setNotificacionVisible] = useState(false); // Estado de visibilidad de la notificación

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //*----------------------Obtener casas----------------------*//
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
  //*----------------------UseEffect----------------------*//
  useEffect(() => {
    obtenerCasas();
  }, []);
  //*----------------------Extraer datos de usuario----------------------*//
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };
  //*----------------------Gestor Formulario----------------------*//
  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitaciones(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/habitaciones/nueva",
        {
          tipo: data.tipo,
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
      console.log(response.data);

      if (response.status === 200) {
        setHabitaciones([...habitaciones, { nombre: data.habitacion }]);
        setNotificacionVisible(true); // Mostrar la notificación
        setTimeout(() => {
          window.location.reload("/home");
        }, 1000);
        setTimeout(() => {
          setIsLoadingHabitaciones(true);
        }, 1500);
      } else {
        alert("Error al crear la casa");
      }
    } catch (error) {
      setIsLoadingHabitaciones(false);
      console.log(error.response.data);
    }
  };

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999, // Asegúrate de que el valor del zIndex sea mayor que cualquier otro elemento en la página
    },
    content: {
      position: "absolute",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      borderRadius: "4px",
      backgroundColor: "#fff",
      padding: "20px",
      maxWidth: "500px",
      margin: "0 auto",
      zIndex: 99999, // Asegúrate de que el valor del zIndex sea mayor que cualquier otro elemento en la página
    },
  };

  return (
    <Modal
      isOpen={modalAbiertoHabitacion}
      onRequestClose={cerrarModalHabitacion}
      className="modal"
      overlayClassName="overlay"
      style={modalStyles}>
      <h1>Nueva Habitación</h1>
      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <input
          type="text"
          placeholder="Tipo"
          {...register("tipo", { minLength: 3, required: true })}
        />
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
          placeholder="Nombre de la habitación"
          {...register("habitacion", { minLength: 3, required: true })}
        />

        <button type="submit">{t("btn1.btn1")}</button>
      </form>

      {notificacionVisible && (
        <div className="notificacion">
          <p>Habitación creada con éxito.</p>
          <button onClick={() => setNotificacionVisible(false)}>Cerrar</button>
        </div>
      )}
    </Modal>
  );
};

export default Addhab;
