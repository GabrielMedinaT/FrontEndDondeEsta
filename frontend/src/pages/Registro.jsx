import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailJS from "emailjs-com";

const Alta = () => {
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const navegar = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [codigo, setCodigo] = useState(null);
  const gestorFormulario = async (data) => {
    try {
      const response = await axios.post(
        "https://whereis-7n5l.onrender.com/api/usuarios/registro",
        {
          nombre: data.nombre,
          email: data.email,
          password: data.password,
        }
      );
      console.log("Todo correcto", response.data);
      navegar("/login");
    } catch (error) {
      console.log(error.response.data);
      console.log("algo falló");
    }
  };
  const enviarCodigo = async (data) => {
    setShowVerificationInput(true);
    const codigoAleatorio = Math.floor(Math.random() * 100000);
    const mensaje = `Su código de verificación es ${codigoAleatorio}`;
    console.log(mensaje);
    setCodigo(codigoAleatorio);
    const templateParams = {
      nombre: data.nombre,
      email: data.email,
      message: mensaje,
    };
    console.log(mensaje);

    try {
      const result = await emailJS.send(
        "service_sonionh",
        "template_ju37jhy",
        templateParams,
        "BjAUYemuslYd41-PL"
      );
      console.log(result.text);
      alert("Mensaje enviado correctamente");
    } catch (error) {
      console.log(error.text);
      alert("Error al enviar el mensaje");
      return;
    }
  };
  const onSubmit = async (data) => {};
  return (
    <div className="Form">
      <div className="title">
        <h1>Crear cuenta</h1>
      </div>
      <br />
      <form onSubmit={handleSubmit(gestorFormulario)}>
        <div className="user-details">
          <div className="input-box">
            <span className="details"></span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              {...register("nombre", { required: true })}
            />
            {errors.nombre && errors.nombre.type === "required" && (
              <p>Campo requerido</p>
            )}
          </div>
          <div className="input-box">
            <span className="details"></span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              {...register("email", {
                pattern: /^[^@]+@[^@]+\.[^@]+$/,
                required: true,
              })}
            />
            {errors.email && errors.email.type === "required" && (
              <p>Campo requerido</p>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <p>Formato de email incorrecto</p>
            )}
          </div>
          <div className="input-box">
            <span className="details"></span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              {...register("password", { required: true })}
            />
            {errors.password && errors.password.type === "required" && (
              <p>Campo requerido</p>
            )}
          </div>
          {showVerificationInput && (
            <div className="input-box">
              <span className="details">Código de verificación</span>
              <input
                type="text"
                name="codigo"
                placeholder="Código de verificación"
                {...register("codigo", { required: true })}
              />
              {errors.codigo && errors.codigo.type === "required" && (
                <p>Campo requerido</p>
              )}
              {codigo && codigo !== errors.codigo && <p>Código incorrecto</p>}
            </div>
          )}
        </div>
        <div className="button">
          {!showVerificationInput && (
            <button
              type="submit"
              value="Crear cuenta"
              onClick={handleSubmit(enviarCodigo)}
            >
              Crear Cuenta{" "}
            </button>
          )}
          {showVerificationInput && (
            <button
              type="submit"
              value="Verificar"
              onClick={handleSubmit(gestorFormulario)}
            >
              {" "}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Alta;
