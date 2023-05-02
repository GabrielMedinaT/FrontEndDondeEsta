import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";
import { AuthContext } from "../context/AuthContext";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const navigate = useNavigate();
  const { IsLoggedIn } = React.useContext(AuthContext);

  useEffect(() => {
    getCasas();
  }, []);
  //que se recargue la pagina una vez al entrar en la pagina

  const recargarPagina = () => {
    window.location.reload();
  };

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate.push("/login");
    }
  };

  const getCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();

    try {
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/casas/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
            casaId: casas._id,
          },
        }
      );
      console.log("Todo correcto", response.data);
      setCasas(response.data);
    } catch (error) {
      console.log("Error al obtener casas", error.message);
    }
  };

  const getHabitaciones = async (data) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitaciones(true);
    try {
      const response = await axios.get(
        "https://whereis-7n5l.onrender.com/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            idCasa: casas._id,
          },
        }
      );
      console.log("Todo correcto", response.data);
      setHabitaciones(response.data);
    } catch (error) {
      console.log("Error al obtener habitaciones", error.message);
    }
    setIsLoadingHabitaciones(false);
  };

  const eliminarCasa = (id) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(`https://whereis-7n5l.onrender.com/api/casas/borrar/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: userId,
        },
      })
      .then((res) => {
        // window.location.reload();
        console.log(id);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
    console.log(id);
  };

  const handleClick = async (casaNombre) => {
    await getHabitaciones(casaNombre);
  };

  //*NAVEGAR A HABITACIONES
  const habitacione = () => {
    navigate("/habitaciones");
  };
  return (
    <div className="miscasas">
      <h1>Mis casas</h1>
      <ul className="casasLista">
        {casas.map((casa) => (
          <li key={casa.id}>
            {casa.nombre}
            <br />
            {casa.ciudad}
            <br />
            <button onClick={() => handleClick(casa.nombre)}>
              Ver habitaciones
            </button>
            {habitaciones.length > 0 && (
              <div>
                <button onClick={() => setHabitaciones([])}>
                  Ocultar habitaciones
                </button>
                <ul>
                  {habitaciones.map((habitacion) => (
                    <li key={habitacion.id}>
                      {habitacion.nombre} - {habitacion.tipo}
                    </li>
                  ))}
                  <button onClick={() => habitacione()}>
                    Ver todas las Habitaciones
                  </button>
                </ul>
              </div>
            )}
            <button onClick={() => eliminarCasa(casa._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisCasas;
