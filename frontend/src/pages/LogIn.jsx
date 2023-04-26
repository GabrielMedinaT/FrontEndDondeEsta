import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import "./LogIn.css";

const LogIn = () => {
  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      console.log(datosRecuperar.token);
      return [datosRecuperar.token, datosRecuperar.userId];
    }
  };
  const fileInput = useRef(null);
  const [urlImagen, setUrlImagen] = useState("");

  const handleButtonClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFileInputChange = async (event) => {
    const fileName = event.target.files[0].name;
    document.getElementById("file-label").innerHTML = fileName;
    await subeImagen(event.target.files[0]);
  };

  const subeImagen = async (imagen) => {
    const formImagen = new FormData();
    formImagen.append("file", imagen);
    formImagen.append("upload_preset", "hozgtasq");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dizfdxu5o/image/upload",
        formImagen
      );
      setUrlImagen(response.data.url);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      navigate("/misCasas");
    } catch (error) {
      console.log("algo falló");
    }
  };

  return (
    <div>
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
        <button type="submit">Enviar</button>

        <input
          type="file"
          name="foto"
          id="file-input"
          ref={fileInput}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        <button type="button" onClick={handleButtonClick}>
          <label htmlFor="file-input" id="file-label">
            Subir cosillas
          </label>
        </button>
        <button type="submit">enviar</button>
      </form>
    </div>
  );
};

export default LogIn;
