import React from "react";
import "./personalPage.css";

const PersonalPage = () => {
  return (
    <div>
      PersonalPage
      <div className="galeria">
        <div className="casa" style={{ backgroundColor: "red" }}></div>
        <div className="habitacion" style={{ backgroundColor: "blue" }}></div>
        <div className="armario" style={{ backgroundColor: "red" }}></div>
        <div className="cajones" style={{ backgroundColor: "blue" }}></div>
        <div className="cosas" style={{ backgroundColor: "red" }}></div>
      </div>
    </div>
  );
};

export default PersonalPage;
