import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Habitaciones.css";
import { useForm } from "react-hook-form";

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [armarios, setArmarios] = useState([]);
  const [isloadingarmarios, setIsLoadingArmarios] = useState(true);
  const navigate = useNavigate();
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [verFormulario, serVerFormulario] = useState(true);

  const verElFormulario = () => {
    serVerFormulario(!verFormulario);
  };

  //*FUNCION QUE ABRE VENTANA PARA CONFIRMAR LA ELIMINACIÓN DEL ARMARIO
  const obtenerConfirmacion = (nombre) => {
    const ventanaAncho = 300;
    const ventanaAlto = 300;
    const pantallaAncho = window.innerWidth;
    const pantallaAlto = window.innerHeight;
    const left = Math.max(0, (pantallaAncho - ventanaAncho) / 2);
    const top = Math.max(0, (pantallaAlto - ventanaAlto) / 2);
    const opcionesVentana = `width=${ventanaAncho},height=${ventanaAlto},left=${left},top=${top}`;
    const nuevaVentana = window.open("", "_blank", opcionesVentana);
    nuevaVentana.document.write(
      `<h1 style="color: red;">¿Seguro que quieres eliminar ${nombre}? Esta acción no se podrá revertir</h1>`
    );
    nuevaVentana.document.write(
      "<button style=\"padding: 10px 20px; font-size: 16px; background-color: red; color: white; border-radius: 5px; margin-right: 10px; transition: transform 0.5s;\" onclick=\"window.opener.postMessage('si', '*'); window.close()\" onmouseover=\"this.style.backgroundColor = 'darkred'; this.style.transform = 'scale(1.1)'; this.style.cursor = 'pointer'\" onmouseout=\"this.style.backgroundColor = 'red'; this.style.transform = 'scale(1)'; this.style.cursor = 'default'\">Sí</button>"
    );
    nuevaVentana.document.write(
      "<button style=\"padding: 10px 20px; font-size: 16px; background-color: green; color: white; border-radius: 5px; margin-right: 10px; transition: transform 0.5s;\" onclick=\"window.opener.postMessage('no', '*'); window.close()\" onmouseover=\"this.style.backgroundColor = 'darkgreen'; this.style.transform = 'scale(1.1)'; this.style.cursor = 'pointer'\" onmouseout=\"this.style.backgroundColor = 'green'; this.style.transform = 'scale(1)'; this.style.cursor = 'default'\">No</button>"
    );
    window.addEventListener("message", (event) => {
      if (event.data === "si") {
        eliminarHabitacion(nombre);
        // console.log("El usuario ha seleccionado 'Sí'" + casa_id);
      } else if (event.data === "no") {
        // console.log("El usuario ha seleccionado 'No'");
      }
    });
  };

  const slide = (amount) => {
    const newSlideIndex = slideIndex + amount;
    const maxSlideIndex = (habitaciones.length - 1) * -100;

    if (newSlideIndex > 0 || newSlideIndex < maxSlideIndex) {
      // Si la nueva posición estaría fuera de los límites, no actualizamos el estado
      return;
    }

    setSlideIndex(newSlideIndex);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getHabitaciones();
  }, []);
  //*EXTRAER DATOS DE USUARIO
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };
  //*OBTENER HABITACIONES PARA MOSTRAR EN LA LISTA
  const getHabitaciones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Todo correcto", response.data);
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
  };
  //*ELIMINAR HABITACION
  const eliminarHabitacion = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(
        process.env.REACT_APP_API_URL + `/api/habitaciones/borrar/${nombre}`,
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
        console.log(nombre);
        console.log(res.data);
        // Actualizar la lista de habitaciones después de eliminar una habitación
        setHabitaciones(habitaciones.filter((h) => h.nombre !== nombre));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="Habitaciones">
      <h1>Habitaciones</h1>
      {habitaciones.length === 0 && (
        <h1>No tiene habitaciones puede añadir una </h1>
      )}
      <div className="carousel-container">
        <div
          className="carousel-items"
          style={{ transform: `translateX(${slideIndex}%)` }}
        >
          <div className="listaHabitaciones">
            {habitaciones.map((habitacion) => (
              <ul className="habitacionConcreta" key={habitacion._id}>
                <h2>{habitacion.nombre}</h2>
                <br />
                <button onClick={() => obtenerConfirmacion(habitacion.nombre)}>
                  Eliminar
                </button>
              </ul>
            ))}
          </div>
        </div>
        <button
          className="carousel-button carousel-button-left"
          onClick={() => slide(10)}
        >
          ◀
        </button>
        <button
          className="carousel-button carousel-button-right"
          onClick={() => slide(-10)}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Habitaciones;
