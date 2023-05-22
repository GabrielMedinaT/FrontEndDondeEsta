import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import "../pages/Home.css";
import { useNavigate } from 'react-router-dom';

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loadingCosas, setLoadingCosas] = useState(false);
  const [cosas, setCosas] = useState([]);
  const navigate = useNavigate();

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };

  const { isLoggedIn } = useContext(AuthContext);

  const handleChange = (event) => {
    const trimmedQuery = event.target.value.trim();
    setQuery(trimmedQuery);
    search(trimmedQuery);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    setQuery(trimmedQuery);
    search(trimmedQuery);
  };

  const search = async (searchQuery) => {
    if (searchQuery === '') {
      setError('Por favor, introduce un término de búsqueda');
      setCosas([]);
    } else {
      setError('');

      const [token, userId] = extraerDatosDeUsuario();
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/api/cosas/buscar/" + searchQuery,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCosas(response.data);
        setLoadingCosas(false);
      } catch (error) {
        console.log(error);
        setLoadingCosas(false);
      }
    }
  };

  return (
    <div className='buscador'>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleChange} />
        <button type="submit">Buscar</button>
      </form>

      {cosas.length > 0 ? (
        cosas.map((result) => (
          <div className='resultados' key={result.id}>
            <h1>{result.nombre}</h1>
            <h2>estan en {result.nombreCasa}</h2>
            <h2>en el {result.nombreHabitacion}</h2>
            <h2>dentro de {result.nombreArmario}</h2>
            <h2>en el cajon  {result.nombreCajon}</h2>
          </div>
        ))
      ) : (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default Buscador;
