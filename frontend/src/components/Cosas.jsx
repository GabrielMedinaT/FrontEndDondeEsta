import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import "../components/Cosas.css";

const Cosas = ({darkmode}) => {
  const [cosas, setCosas] = useState([]);
  const [isLoadingCosas, setLoadingCosas] = useState(false);
  const [isLoadingArmarios, setIsLoadingArmarios] = useState(false);
  const [isLoadingCajones, setIsLoadingCajones] = useState(false);
  const [habitaciones, setHabitaciones] = useState([]);
  const [shouldReload, setShouldReload] = useState(false); // variable para determinar si se debe recargar la lista de cosas
  const navigate = useNavigate();
  const [armarios, setArmarios] = useState([]);
  const [selectedHabitacion, setSelectedHabitacion] = useState("");
  const [selectedArmario, setSelectedArmario] = useState("");
  const [isLoadingCasas, setIsLoadingCasas] = useState(false);
  const [casas, setCasas] = useState([]);
  const [cajones, setCajones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const abrirModal = () => {
    setModalIsOpen(true);
  };
  const cerrarModal = () => {
    setModalIsOpen(false);
  };
  const handleHabitacionChange = (event) => {
    setSelectedHabitacion(event.target.value);
  };
  const handleArmarioChange = (event) => {
    setSelectedArmario(event.target.value);
  };
  const filteredArmarios = armarios.filter(
    (armario) =>
      armario.nombreHabitacion === selectedHabitacion &&
      armario.nombreArmario !== ""
  );
  const filteredCajones = cajones.filter(
    (cajon) =>
      cajon.nombreArmario === selectedArmario && cajon.nombreCajon !== ""
  );
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //*AÑADIR COSAS
  const gestorFormulario = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setLoadingCosas(true);
    await axios
      .post(
        process.env.REACT_APP_API_URL + "/api/cosas/nuevo",
        {
          nombre: data.nombre,
          descripcion: data.descripcion,
          clasificacion: data.clasificacion,
          cajon: data.cajon,
          armario: data.armario,
          habitacion: data.habitacion,
          casa: data.casa,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        console.log(data.cajon);
        console.log(res.data);
        setLoadingCosas(false);
        setShouldReload(true); // actualizar la variable para que se recargue la lista de cosas
      })
      .catch((err) => {
        console.log(err);
        setLoadingCosas(false);
      });
  };

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };
  //*VER COSAS
  const verCosas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/cosas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCosas(response.data);
      console.log(cosas);
      setLoadingCosas(false);
    } catch (error) {
      console.log(error);
      setLoadingCosas(false);
    }
  };

  //*ELIMINAR COSAS
  const eliminarCosas = async (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();

    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + "/api/cosas/borrar/" + nombre,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      setLoadingCosas(true);
      setShouldReload(true); // actualizar la variable para que se recargue la lista de cosas
      setLoadingCosas(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoadingCosas(false);
    }
  };

  //*OBTENER HABITACIONES

  const obtenerHabitaciones = async () => {
    setIsLoadingArmarios(true);
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/habitaciones",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        }
      );
      console.log(response);
      setHabitaciones(response.data);
      setIsLoadingArmarios(false);
    } catch (error) {
      console.log(error);
      setIsLoadingArmarios(false);
    }
  };
  //*OBTENER CASAS
  const obtenerCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingCasas(true);
    await axios
      .get(process.env.REACT_APP_API_URL + `/api/casas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: userId,
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
  //* VER ARMARIOS
  const obtenerArmarios = async () => {
    setIsLoadingArmarios(true);
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/armarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setArmarios(response.data);
        setIsLoadingArmarios(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingArmarios(false);
      });
  };

  //*VER CAJONES
  const obtenerCajones = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    await axios
      .get(process.env.REACT_APP_API_URL + "/api/cajones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoadingCajones(false);
        setCajones(response.data);
      })
      .catch((error) => {
        setIsLoadingCajones(false);
        console.log(error);
      });
  };
  useEffect(() => {
    obtenerCajones();
    obtenerArmarios();
    obtenerCasas();
    obtenerHabitaciones();
    verCosas();
  }, []);

  return (
    <div>
      {/* VER LAS COSAS  */}
      <div className="cosas">
        {cosas.map((cosa, index) => {
          return (
            <div key={cosa._id}>
              <h2>{cosa.nombre}</h2>
              <button onClick={() => eliminarCosas(cosa.nombre)}>
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
      {/* AÑADIR COSAS  */}
      <h1>Cosas</h1>
      <button onClick={abrirModal}>Agregar Cosas</button>
        <Modal
          style={modalStyles}
          isOpen={modalIsOpen}
        >
      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <input
          type="text"
          placeholder="Nombre"
          {...register("nombre", { required: true })}
        />

        <br />
        <select
          {...register("descripcion", { required: true })}
          name="descripcion"
        >
          <option value="">Selecciona una descripción</option>
          <option value="Electronica">Electronica</option>
          <option value="Personal">Personal</option>
          <option value="Hogar">Hogar</option>
          <option value="Oficina">Oficina</option>
          <option value="Deporte">Deporte</option>
          <option value="Mascotas">Mascotas</option>
          
          <option value="Herramienta">Herramienta</option>
          <option value="Escolar">Escolar</option>
          <option value="Informática">Informática</option>
          <option value="Cocina">Cocina</option>
          <option value="Ropa">Ropa</option>
          <option value="Jueguetes">Juguetes</option>
          <option value="Salun y bienestar">Salud y Bienestar</option>
          <option value="Jardineria">Jardineria</option>
          <option value="Cine y peliculas">Cine y Peliculas</option>
          <option value="Arte y manualidades">Arte y manualidades</option>
          <option value="Libros">Libros</option>
          <option value="Comics, manga y novela gráfica">
            Comics, manga y novela gráfica
          </option>
        </select>
        <select
          {...register("clasificacion", { required: true })}
          name="clasificacion"
        >
          <option value="">Selecciona una clasificación</option>
          <option value="Importante">Importante</option>
          <option value="Imprescindible">Imprescindible</option>
          <option value="Normal">Normal</option>
        </select>
        <select {...register("casa", { required: true })}>
          {isLoadingCasas ? (
            <option>Cargando...</option>
          ) : (
            casas.map((casa) => (
              <option key={casa.id} value={casa.id}>
                {casa.nombre}
              </option>
            ))
          )}
        </select>
        <select
          {...register("habitacion", { required: false })}
          onChange={handleHabitacionChange}
        >
          <option value="">Seleccione una habitación</option>
          {habitaciones.map((habitacion) => (
            <option key={habitacion._id} value={habitacion.nombre}>
              {habitacion.nombre}
            </option>
          ))}
        </select>
        <select
          {...register("armario", { required: true })}
          onChange={handleArmarioChange}
        >
          <option value="">Seleccione un armario</option>
          {isLoadingArmarios ? (
            <option>Loading...</option>
          ) : (
            filteredArmarios.map((armario) => (
              <option key={armario.id} value={armario.id}>
                {armario.nombre}
              </option>
            ))
          )}
        </select>
        <select {...register("cajon", { required: false })}>
          <option value="">Seleccione cajón</option>
          {isLoadingCajones ? (
            <option>Loading...</option>
          ) : (
            filteredCajones.map((cajon) => (
              <option key={cajon.id} value={cajon.id}>
                {cajon.nombre}
              </option>
            ))
          )}
        </select>

        <button>Añadir</button>
        <button onClick={cerrarModal}>Cerrar</button>
      </form>
      </Modal>
    </div>
  );
};

export default Cosas;
