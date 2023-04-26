import React from "react";
import { useNavigate } from "react-router";
// import { useTranslation } from "react-i18next";
import "./Howto.css";
import "./Registro";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      Home
      <br />
      <button onClick={() => navigate("/login")} className="atras">
        Log In
      </button>
      <button onClick={() => navigate("/registro")} className="atras">
        Registro
      </button>
    </div>
  );
};

export default Home;
