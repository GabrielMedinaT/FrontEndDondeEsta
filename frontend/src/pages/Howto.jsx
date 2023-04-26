import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import "./Howto.css";

const Howto = () => {
  const navigate = useNavigate();
  return (
    <div>
      How to
      <div className="botones">
        <button onClick={() => navigate("/")} className="atras">
          atras
        </button>
        <button onClick={() => navigate("/adjuntar")} className="atras">
          adelante
        </button>
      </div>
    </div>
  );
};

export default Howto;
