import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "react-modal";
import { useState, useEffect } from "react";

Modal.setAppElement("#root");

const Addhab = ({ isOpen, setIsOpen, ...props }) => {
  const { t } = useTranslation("global");
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [notificacionVisible, setNotificacionVisible] = useState(false); // Estado de visibilidad de la notificación
  const [value, setValue] = useState(""); // Estado del valor del select
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const habitacionesLength = habitaciones.length;

  const cerrarModalHabitacion = () => {
    setIsOpen(false);
  };
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
    obtenerHabitaciones();
    if (habitacionesLength > 0) {
      setValue("tipo", habitaciones[0].tipo, { shouldDirty: true });
    }
  }, [habitacionesLength, habitaciones, setValue]);

  useEffect(() => {
    obtenerHabitaciones();
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
          tipo: habitacionesLength === 0 ? data.tipo : habitaciones[0].tipo,
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

  //*------------------OBTENER HABITACIONES------------------*//
  const obtenerHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitaciones(true);
    await axios
      .get(process.env.REACT_APP_API_URL + `/api/habitaciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setHabitaciones(response.data);
        setIsLoadingHabitaciones(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setIsLoadingHabitaciones(false);
      });
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
      isOpen={isOpen}
      onRequestClose={cerrarModalHabitacion}
      className="modal"
      overlayClassName="overlay"
      style={modalStyles}>
      {habitaciones.length > 0 && <h1>Nueva {habitaciones[0].tipo}</h1>}

      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        {habitacionesLength === 0 ? (
          <input
            type="text"
            placeholder="Tipo"
            {...register("tipo", { minLength: 3, required: true })}
          />
        ) : (
          <input
            type="text"
            placeholder="Tipo"
            {...register("tipo", { minLength: 3, required: false })}
            defaultValue={habitaciones[0].tipo}
            readOnly
            hidden
          />
        )}
        {errors.tipo && errors.tipo.type === "required" && (
          <p className="error">El tipo es obligatorio</p>
        )}
        {errors.tipo && errors.tipo.type === "minLength" && (
          <p className="error">El tipo debe tener al menos 3 caracteres</p>
        )}

        <select {...register("nombre", { required: true })}>
          {isLoadingCasas ? (
            <option value="">{t("loading")}</option>
          ) : (
            casas &&
            casas.length > 0 &&
            casas.map((casa) => (
              <option key={casa._id} value={casa.nombre}>
                {casa.direccion}
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
