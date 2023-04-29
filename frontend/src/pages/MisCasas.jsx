import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCasas();
    eliminarCasa();
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
        console.log(nombre);
        console.log(res.data);

        // setCasas(casas.filter((casa) => casa.nombre === nombre));
      })
      .catch((error) => console.log(error));
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
            <button onClick={() => eliminarCasa(casa.nombre)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisCasas;
