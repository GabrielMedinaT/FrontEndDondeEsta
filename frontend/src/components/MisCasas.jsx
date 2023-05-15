import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Home.css";
import { AuthContext } from "../context/AuthContext";
import Addcasa from "./Addcasa";

import ConfirmacionModal from "./ConfirmacionModal";

const MisCasas = ({ darkmode }) => {
  const [casas, setCasas] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casaId, setCasaId] = useState(null);

  const mostrarModal = (id) => {
    setCasaId(id);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCasaId(null);
  };

  const mostrarBoton = () => {
    setMostrar(!mostrar);
  };

  const navigate = useNavigate();
  const { IsLoggedIn } = React.useContext(AuthContext);

  useEffect(() => {
    getCasas();
  }, []);

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate.push("/login");
    }
  };

  const getCasas = async () => {
    const [token, userId] = extraerDatosDeUsuario();
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/casas/",
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
      setCasas(response.data);
    } catch (error) {}
  };
  //*ELIMINAR CASA
  const eliminarCasa = (id) => {
    const [token, userId] = extraerDatosDeUsuario();
    axios
      .delete(process.env.REACT_APP_API_URL + `/api/casas/borrar/${id}`, {
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
        cerrarModal();
      })
      .catch((error) => console.log(error));
    // console.log(id);
  };
  console.log(darkmode);
  const casasLength = casas.length;

  return (
    <div className={darkmode ? "miscasas-Dark" : "miscasas"}>
      <div className="casas">
        <ul className="casasLista">
          {casasLength === 0 && (
            <li>
              <h1>
                No tienes casas añadidas, añade una con el siguiente formulario
              </h1>
              <button onClick={() => mostrarBoton()}>Agregar</button>
              {mostrar === false && (
                <div>
                  <Addcasa />
                </div>
              )}
            </li>
          )}
          {casas &&
            casas.length > 0 &&
            casas.map((casa) => (
              <li key={casa._id}>
                <h1>Mi casa</h1>
                <div className="misCasas">
                  <div className="casasExistentes">
                    <div className="CasaConcreta">
                      <h1>Nombre de la casa : {casa.nombre}</h1>{" "}
                      <h1>Ciudad : {casa.ciudad} </h1>
                    </div>
                    <div className="botones">
                      <div>
                        <button onClick={() => mostrarModal(casa._id)}>
                          Eliminar
                        </button>

                        <ConfirmacionModal
                          casaId={casaId}
                          isOpen={modalAbierto}
                          onClose={cerrarModal}
                          onConfirm={eliminarCasa}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MisCasas;
