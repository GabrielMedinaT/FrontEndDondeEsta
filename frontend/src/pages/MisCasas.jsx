import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCasas();
  }, []);

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
      const response = await axios.get("http://localhost:5000/api/casas/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: userId,
        },
      });
      console.log("Todo correcto", response.data);
      setCasas(response.data);
    } catch (error) {
      console.log("Error al obtener casas", error.message);
    }
  };

  const getHabitaciones = async (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    setIsLoadingHabitaciones(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/habitaciones/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            nombreCasa: nombre, // cambié el parámetro a 'nombreCasa' para que coincida con el backend
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

  const eliminarCasa = (nombre) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(`http://localhost:5000/api/casas/borrar/${nombre}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: userId,
        },
      })
      .then((res) => {
        window.location.reload();
        console.log(nombre);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleClick = async (casaNombre) => {
    await getHabitaciones(casaNombre);
  };

  //*NAVEGAR A HABITACIONES
  const habitacione = () => {
    navigate("/habitaciones");
  };
  return (
    <div>
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
            <button onClick={() => eliminarCasa(casa.nombre)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisCasas;
