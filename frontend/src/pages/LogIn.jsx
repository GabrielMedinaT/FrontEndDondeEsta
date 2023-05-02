import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";
import { useState } from "react";
import { send } from "emailjs-com";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Registro from "./Registro";

const LogIn = () => {
  const [passwordError, setPasswordError] = useState("");
  const { gestionarLogIn } = useContext(AuthContext);
  const { REACT_APP_BACKEND_URL } = process.env;
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  console.log(showLogin);
  const gestorFormulario = async (data) => {
    try {
      const response = await axios.post(
        "https://whereis-7n5l.onrender.com/api/usuarios/login",
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
    <div className="principal">
      <div className="present">
        <h1 className="titulo">Encuentra tus cosas en segundos con Where Is</h1>
        <h2 className="subtitulo">
          Crea tu propia base de datos de tu casa y organiza tus cosas como
          nunca antes
        </h2>
        <br />
        <p className="descripcion">
          ¿Alguna vez has perdido algo en tu casa y no sabes por dónde empezar a
          buscar? Where is es la solución que estabas buscando. Con nuestra
          aplicación, podrás crear tu propia base de datos de tu casa y
          organizar todas tus cosas de manera fácil y sencilla. ¿Cómo funciona?
          Primero, crea tu perfil y agrega tus habitaciones, armarios y cajones.
          Luego, agrega tus cosas a cada uno de ellos. Podrás agregar detalles
          como descripción, foto, fecha de adquisición y más. Una vez que hayas
          agregado tus cosas, podrás buscarlas fácilmente en nuestra aplicación.
          Simplemente ingresa el nombre de lo que estás buscando y te
          mostraremos dónde está. ¡No más perder tiempo buscando cosas perdidas!
          Pero eso no es todo, nuestra aplicación también te permite crear
          listas de cosas que necesitas comprar, llevar un registro de tus cosas
          prestadas y mucho más. ¡Descubre lo fácil que es organizar tu casa con
          Where is ! Regístrate ahora y comienza a disfrutar de una vida más
          organizada.
        </p>
      </div>
      <div className="formularios">
        {showLogin ? (
          <div className="login">
            <form
              className="formulario"
              action=""
              onSubmit={handleSubmit(gestorFormulario)}
            >
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
              <br />
              <button type="submit">Enviar</button>
              <br />
              <br />
              <button onClick={toggleForm}>Sign up</button>
            </form>
          </div>
        ) : (
          <div className="formulario">
            <Registro />
            <br />
            <br />
            <button onClick={toggleForm}>Log in</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
