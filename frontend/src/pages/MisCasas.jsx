import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";
import { AuthContext } from "../context/AuthContext";
import Addcasa from "../components/Addcasa";
import Habitaciones from "../components/Habitaciones";
import MisArmarios from "../components/MisArmarios";
import Addhab from "../components/Addhab";
import Cajones from "../components/Cajones";
import Cosas from "../components/Cosas";
import ConfirmacionModal from "../components/ConfirmacionModal";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [verCasa, setVerCasa] = useState(true);
  const [verFormulario, serVerFormulario] = useState(true);
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
  //que se recargue la pagina una vez al entrar en la pagina

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
      // console.log("Todo correcto", response.data);
      setCasas(response.data);
    } catch (error) {
      // console.log("Error al obtener casas", error.message);
    }
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

  return (
    <div className="miscasas">
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
                {/* <button
                  className={verCasa ? "ocultar" : "mostrar"}
                  onClick={() => mostrarCasa()}
                >
                  {verCasa ? "Ocultar" : "Mostrar casa"}
                </button> */}
                {verCasa === true && (
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
                    <div>
                      {/* <h1>Añadir mas casas</h1> */}
                      {/* TO DO PARA AÑADIR EL CONDICIONAL DE SI EL USUARIO ES PREMIUM O NO */}
                      {/* <button onClick={() => mostrarBoton()}>
                        {mostrar ? "Ocultar" : "Agregar"}
                      </button> */}
                      {/* {mostrar === true && (
                        <div>
                          <Addcasa />
                        </div>
                      )} */}
                    </div>
                    {/* ---------------------------HABITACIONES-------------------------------------------------- */}
                    {/* <div className="HabitacionesGeneral">
                      <h1>Habitaciones</h1>
                      <div className="botonesLogIn">
                        <button
                          className={verHab ? "v1" : "v2"}
                          onClick={() => mostrarHabitacion()}
                        >
                          {verHab ? "Ocultar habitaciones" : "Ver habitaciones"}
                        </button>
                      </div>
                      {verHab === true && (
                        <div>
                          <Habitaciones />
                          <br />
                          <button onClick={() => AgregarHab()}>
                            {addHabi ? "Ocultar" : "Agregar habitacion"}
                          </button>
                          {addHabi === true && (
                            <div className="AgregarHab">
                              <Addhab />
                            </div>
                          )}
                        </div>
                      )}
                    </div> */}
                    {/* ------------------------------------- ARMARIOS ------------------------------------------------  */}
                    {/* <div className="Armarios">
                      <h1>Armarios</h1>
                      <button onClick={() => mostrarArmarios()}>
                        {verArmarios ? "Ocultar armarios" : "Ver armarios"}
                      </button>
                      {verArmarios === true && <MisArmarios />}
                    </div> */}
                    {/* -------------------------------------CAJONES ---------------------------------------------------- */}
                    {/* <div className="Cajones">
                      <h1>Cajones</h1>
                      <button onClick={() => mostrarCajones()}>
                        {verCajones ? "Ocultar cajones" : "Ver cajones"}
                      </button>
                      {verCajones === true && <Cajones />}
                    </div> */}
                    {/* ------------------------------------- COSAS ----------------------------------------------------- */}
                    {/* <div className="Cosas">
                      <h1>Cosas</h1>
                      <button onClick={() => mostrarCosas()}>
                        {verCosas ? "Ocultar cosas" : "Ver cosas"}
                      </button>
                      {verCosas === true && <Cosas />}
                    </div> */}
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MisCasas;
