import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const gestionarLogIn = (token, userId) => {
    localStorage.setItem("datosUsuario", JSON.stringify({ token, userId }));
    setIsLoggedIn(true);
  };

  const gestionarLogOut = () => {
    localStorage.removeItem("datosUsuario");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, gestionarLogIn, gestionarLogOut }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};