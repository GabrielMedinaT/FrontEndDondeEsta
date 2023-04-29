import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const navegar = useNavigate();
  const { gestionarLogOut } = useContext(AuthContext);

  const Logout = () => {
    gestionarLogOut();
    localStorage.removeItem("datosUsuario");
    navegar("/login");
  };

  return (
    <div>
      NavBar
      <div className="BarraNavegacion">
        <div className="Logo">Logo</div>
        <div className="Botones">
          <button onClick={Logout}>Log Out</button>
          <button>Boton2</button>
          <button>Boton3</button>
          <button>Boton4</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
