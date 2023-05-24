import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import "../pages/Home.css";
import { useNavigate } from 'react-router-dom';

const Buscador = ({darkmode}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loadingCosas, setLoadingCosas] = useState(false);
  const [cosas, setCosas] = useState([]);
  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const navigate = useNavigate();

  const extraerDatosDeUsuario = () => {
    const datosRecuperar = JSON.parse(localStorage.getItem("datosUsuario"));
    if (datosRecuperar && datosRecuperar.token) {
      return [datosRecuperar.token, datosRecuperar.userId];
    } else {
      navigate("/");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query) {
      search(query);
      
    }
  };

  const handleChange = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    search(searchQuery); // Realizar búsqueda en cada cambio
  };

  const handleRecentSearch = (searchQuery) => {
    setQuery(searchQuery);
    search(searchQuery);
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
  
        const results = response.data;
        // Comprueba si hay resultados con un nombre diferente al término de búsqueda
        const matchedResults = results.filter(result => result.nombre.toLowerCase() === searchQuery.toLowerCase());
  
        if (matchedResults.length === 0) {
          // Si no hay coincidencias exactas, busca en los resultados por otros nombres
          const otherNamedResults = results.filter(result => result.otrosNombres.some(nombre => nombre.toLowerCase() === searchQuery.toLowerCase()));
          setCosas(otherNamedResults);
        } else {
          setCosas(matchedResults);
        }
        addRecentSearch(searchQuery);
        setLoadingCosas(false);
      } catch (error) {
        console.log(error);
        setLoadingCosas(false);
        setTimeout(() => {

        setError('No se han encontrado resultados');
        }, 2000);
        
      }
    }
  };

  const addRecentSearch = (searchQuery) => {
    setBusquedasRecientes(prevBusquedas => [searchQuery, ...prevBusquedas.slice(0, 6)]);
  };
  console.log(busquedasRecientes)

 

return (
  <div className={darkmode? "contenedorBuscador-Dark":'contenedorBuscador'}>
    <div className='buscador'>
      <form onSubmit={handleSubmit}>
        <input placeholder='Introduce término a buscar' type="text" value={query} onChange={handleChange} />
        <button className='botonBuscar' type="submit">Buscar</button>
      </form>
    </div>
    {cosas.length > 0 ? (
      cosas.map((result) => (
        <div className={darkmode? "resultados-Dark":'resultados'} key={result.id}>
          <h1>{result.nombre}</h1>
          <h2>están en {result.nombreCasa}</h2>
          {result.nombreHabitacion && <h2>en la habitación {result.nombreHabitacion}</h2>}
          {result.nombreArmario && <h2>en el mueble {result.nombreArmario}</h2>}
          {result.nombreCajon && <h2>en el cajón {result.nombreCajon}</h2>}
          
        </div>
      ))
    ) : (
      <div className="error-message">{error}</div>
    )}
    {busquedasRecientes.length > 0 && (
      <div className="recientes">
        <h3>Búsquedas recientes:</h3>
        <ul>
          {busquedasRecientes.map((busqueda, index) => (
            <li key={index}>
              <button onClick={() => handleRecentSearch(busqueda)}>
                {busqueda}
                
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
          };


export default Buscador;
