import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Addcasa from "./Addcasa";
import "./MisCasas.css";

const MisCasas = ({ darkmode }) => {
  const [casas, setCasas] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casaId, setCasaId] = useState(null);
  const [isLoadingCasas, setIsLoadingCasas] = useState(true);
  const [modalAgregar, setModalAgregar] = useState(false);

  const abrirModalCasas = () => {
    setModalAgregar(true);
  };
  const cerrarModalCasas = () => {
    setModalAgregar(false);
  };

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
      setIsLoadingCasas(false);
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
  const casasLength = casas.length;

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
    },
    content: {
      position: "relative",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      borderRadius: "4px",
      backgroundColor: "#fff",
      padding: "20px",
      maxWidth: "500px",
      margin: "0 auto",
    },
    bodyOpen: {
      overflow: "hidden",
    },
  };

  return (
    <div className={darkmode ? "miscasas-Dark" : "miscasas"}>
      <div className={darkmode ? "imagenCasa-Dark" : "imagenCasa"}></div>
      <div className="casas">
        {isLoadingCasas ? (
          <div className="arc"></div>
        ) : casasLength === 0 ? (
          <>
            <p>No hay casas disponibles.</p>
            <div className="agregarCasa">
              <h1>Agregue la casa</h1>
              <button onClick={abrirModalCasas}>Añadir</button>
            </div>
          </>
        ) : (
          <ul className="casasLista">
            {casas &&
              casas.length > 0 &&
              casas.map((casa) => (
                <li key={casa._id}>
                  <div className="misCasas">
                    <h1>Mi casa</h1>
                    <div className="casasExistentes">
                      <div className="CasaConcreta">
                        <h1>Nombre de la casa : {casa.nombre}</h1>{" "}
                        <h1>Ciudad : {casa.ciudad} </h1>
                      </div>
                      <div className="botones">
                        <div>
                          <button
                            className="eliminarCasa"
                            onClick={() => mostrarModal(casa._id)}></button>

                          <Modal
                            casaId={casaId}
                            isOpen={modalAbierto}
                            onClose={cerrarModal}
                            onConfirm={eliminarCasa}
                            style={modalStyles}>
                            <h1>
                              ¿Seguro que quieres eliminar la casa? Esta acción
                              no se podrá revertir
                            </h1>
                            <button
                              className="botonSi"
                              onClick={() => eliminarCasa(casaId)}>
                              Sí
                            </button>
                            <button className="botonNo" onClick={cerrarModal}>
                              No
                            </button>
                          </Modal>

                          <Modal
                            isOpen={modalAgregar}
                            onClose={cerrarModalCasas}
                            style={modalStyles}>
                            <Addcasa modalAgregar={modalAgregar} />
                          </Modal>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MisCasas;
