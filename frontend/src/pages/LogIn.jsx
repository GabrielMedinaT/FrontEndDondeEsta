import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";
import { useState } from "react";
import { send } from "emailjs-com";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LogIn = () => {
  const [passwordError, setPasswordError] = useState("");
  const { gestionarLogIn } = useContext(AuthContext);

  const gestorFormulario = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/usuarios/login",
        {
          email: data.email,
          password: data.password,
        }
      );
      console.log("Todo correcto", response.data);
      localStorage.setItem("datosUsuario", JSON.stringify(response.data));
      gestionarLogIn(response.data.token, response.data.userId);
      navigate("/misCasas");
    } catch (error) {
      console.log("algo falló");
      if (error.response.status === 500) {
        setPasswordError("Usuario o contraseña incorrecta");
      }
    }
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="tarjeta">
      <form action="" onSubmit={handleSubmit(gestorFormulario)}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          {...register("email", {
            pattern:
              /^(?![_.-])((?![_.-][_.-])[a-zA-Z\d_.-]){0,63}[a-zA-Z\d]@((?!-)((?!--)[a-zA-Z\d-]){0,63}[a-zA-Z\d]\.){1,2}([a-zA-Z]{2,14}\.)?[a-zA-Z]{2,14}$/,
            required: true,
          })}
        />
        {errors.email && errors.email.type === "required" && (
          <p>Campo email requerido</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p>Formato de email incorrecto</p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          {...register("password", {
            minLength: 5,
            required: true,
          })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>Campo requerido</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Debe tener al menos 5 caracteres</p>
        )}
        {passwordError && <p className="error">{passwordError}</p>}

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default LogIn;
