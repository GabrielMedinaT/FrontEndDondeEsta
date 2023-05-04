import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";
import { AuthContext } from "../componets/context/AuthContext";
import Addcasa from "../componets/Addcasa";
import Habitaciones from "../componets/Habitaciones";
import MisArmarios from "../componets/MisArmarios";
import Addhab from "../componets/Addhab";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);

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
      // console.log(datosRecuperar.token);
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
      // console.log("Todo correcto", response.data);
      setCasas(response.data);
    } catch (error) {
      // console.log("Error al obtener casas", error.message);
    }
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
        window.location.reload();
        console.log(id);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
    // console.log(id);
  };

  const casasLength = casas.length;
  const habitacionesLentgth = casas.map((casa) => {
    return casa.habitaciones.length;
  });
  console.log(habitacionesLentgth);

  //*NAVEGAR A HABITACIONES
  const habitacione = () => {
    navigate("/habitaciones");
  };
  return (
    <div className="miscasas">
      <h1>Mis casas</h1>
      <ul className="casasLista">
        {casasLength === 0 && (
          <h1>
            No tienes casas añadidas, añada una con el siguiente formulario
          </h1>
        )}
        {casas.map((casa) => (
          <li key={casa._id}>
            <h1>Nombre de la casa : {casa.nombre}</h1>

            <h1>Ciudad : {casa.ciudad} </h1>
            <br />
            <Addcasa />

            <button onClick={() => eliminarCasa(casa._id)}>Eliminar</button>
          </li>
        ))}
        <div className="Habitaciones">
          <Habitaciones />
          <Addhab />
        </div>
      </ul>
    </div>
  );
};

export default MisCasas;
