import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";
import emailJS from "emailjs-com";
import { useState } from "react";

const Alta = () => {
  //*DECLARAR NAVEGAR PARA REDIRECCIONAR
  const navegar = useNavigate();
  //*DECLARAR USEFORM PARA VALIDAR FORMULARIO
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //*DECLARAR FUNCION PARA EL REGISTRO DE USUARIO
  const gestorFormulario = async (data) => {
    await axios
      .post("http://localhost:5000/api/usuarios/registro", {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log("Todo correcto", response.data);
        navegar("/login");
      })
      .catch((error) => console.log(error.response.data));
    console.log("algo falló");
  };

  const [numeros, setNumeros] = useState(""); //*ESTADO PARA GUARDAR EL NUMERO ALEATORIO
  //*FUNCION PARA ENVIAR EMAIL
  const sendEmail = (data) => {
    const numerosAleatorios = Math.floor(Math.random() * 100000); //*Generar un número aleatorio de 5 dígitos
    const mensaje = "Su código de verificación es  " + numerosAleatorios; //*Crear el mensaje con el número aleatorio
    setNumeros(numerosAleatorios);

    const templateParams = {
      nombre: data.nombre, //*Enviar el mensaje con el número aleatorio al email del usuario
      email: data.email, //*Enviar el mensaje con el número aleatorio al email del usuario
      message: mensaje, //*Enviar el mensaje con el número aleatorio al email del usuario
    };
    console.log(mensaje);

    emailJS
      .send(
        "service_sonionh",
        "template_ju37jhy",
        templateParams,
        "BjAUYemuslYd41-PL"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Mensaje enviado correctamente");
          const codigoVerificacion = prompt(
            "Por favor ingrese el código de verificación enviado a su correo electrónico"
          );
          if (
            codigoVerificacion !== null &&
            codigoVerificacion === numerosAleatorios.toString()
          ) {
            // console.log("Código de verificación correcto");
            //*Si el código ingresado coincide con el generado aleatoriamente, continuar con el registro del usuario
            gestorFormulario(data);
          } else {
            // console.log("Código de verificación incorrecto");
            alert(
              "El código ingresado es incorrecto. Por favor intenta nuevamente." //*Si el código ingresado no coincide con el generado aleatoriamente, mostrar mensaje de error
            );
          }
        },
        (error) => {
          console.log(error.text);
          alert("Error al enviar el mensaje");
        }
      );
  };
  //*FUNCION PARA ENVIAR FORMULARIO Y LLAMAR A LA FUNCION DE ENVIAR EMAIL PARA VALIDAR EL EMAIL DEL USUARIO
  const onSubmit = (data) => {
    sendEmail(data);
  };

  return (
    <div className="Form">
      <div className="title">Crear cuenta</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {" "}
        //*LLAMAR A LA FUNCION DE ENVIAR FORMULARIO
        <div className="user-details">
          <div className="input-box">
            <span className="details">Nombre</span>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              {...register("nombre", {
                required: true,
              })}
            />
            {errors.nombre && errors.nombre.type === "required" && (
              <p>Campo requerido</p>
            )}
          </div>
          <div className="input-box">
            <span className="details">Email</span>
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
              <p>Campo requerido</p>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <p>Formato de email incorrecto</p>
            )}
          </div>
          <div className="input-box">
            <span className="details">Contraseña</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              {...register("password", {
                required: true,
                minLength: 8,
              })}
            />
            {errors.password && errors.password.type === "required" && (
              <p>Campo requerido</p>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <p>La contraseña debe tener al menos 8 caracteres</p>
            )}
          </div>
          <div className="input-box">
            <span className="details">Confirmar contraseña</span>
            <input
              type="password"
              name="confirmarPassword"
              placeholder="Confirmar contraseña"
              {...register("confirmarPassword", {
                required: true,
                minLength: 8,
              })}
            />
            {errors.confirmarPassword &&
              errors.confirmarPassword.type === "required" && (
                <p>Campo requerido</p>
              )}
            {errors.confirmarPassword &&
              errors.confirmarPassword.type === "minLength" && (
                <p>La contraseña debe tener al menos 8 caracteres</p>
              )}
          </div>
        </div>
        <div className="button">
          <input type="submit" value="Registrarse" />
        </div>
      </form>
    </div>
  );
};

export default Alta;
