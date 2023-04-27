import axios from "axios";
import { reloadResources } from "i18next";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.BACK_URL}/api/casas/`)
      .then((res) => {
        console.log(res.data);
        setCasas(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      // Si existe algo que recuperar y dentro de lo recuperado existe la propiedad token
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };

  const eliminarCasa = (id) => {
    axios.delete(`http://localhost:5000/api/casas/borrar/${id}`).then((res) => {
      window.location.reload();
      console.log(res.data);
      setCasas(casas.filter((casa) => (casa.id = id)));
    });
  };

  return (
    <div>
      <h1>Mis casas</h1>
      <ul className="casas">
        {casas.map((casa) => (
          <li key={casa.id}>
            <li>{casa.nombre}</li>
            <li>{casa.ciudad}</li>
            <li>{casa.direccion}</li>
            <button onClick={() => eliminarCasa(casa.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisCasas;
