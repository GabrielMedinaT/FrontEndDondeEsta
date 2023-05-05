import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MisCasas.css";
import { AuthContext } from "../context/AuthContext";
import Addcasa from "../componets/Addcasa";
import Habitaciones from "../componets/Habitaciones";
import MisArmarios from "../componets/MisArmarios";
import Addhab from "../componets/Addhab";
import Cajones from "../componets/Cajones";
import Cosas from "../componets/Cosas";

const MisCasas = () => {
  const [casas, setCasas] = useState([]);
  const [verHab, setVerHab] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [verCasa, setVerCasa] = useState(true);
  const [addHabi, setddHabi] = useState(true);
  const mostrarBoton = () => {
    setMostrar(mostrar);
  };
  const mostrarHabitacion = () => {
    setVerHab(!verHab);
  };
  const mostrarCasa = () => {
    setVerCasa(!verCasa);
  };
  const AgregarHab = () => {
    setddHabi(!addHabi);
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

  const habitacione = () => {
    navigate("/habitaciones");
  };
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
                <button
                  className={verCasa ? "ocultar" : "mostrar"}
                  onClick={() => mostrarCasa()}
                >
                  {verCasa ? "Ocultar" : "Mostrar casa"}
                </button>
                {verCasa === true && (
                  <div className="misCasas">
                    <div className="casasExistentes">
                      <h1>Nombre de la casa : {casa.nombre}</h1>{" "}
                      <h1>Ciudad : {casa.ciudad} </h1>
                      <button onClick={() => eliminarCasa(casa._id)}>
                        Eliminar
                      </button>
                      <button onClick={() => mostrarHabitacion()}>
                        {verHab ? "Ocultar habitaciones" : "Ver habitaciones"}
                      </button>
                    </div>
                    <br />
                    {/* <h1>Añadir mas casas</h1> */}
                    <div>
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
                    <div className="Habitaciones">
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
                      {/* <MisArmarios /> */}

                      {/* <Addhab />
                        
                        <Cajones /> */}
                    </div>
                    {/* <Cosas /> */}
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
