import React, { useState, useEffect } from 'react'
import './administrador.css'
import axios from 'axios'
import CardEdificio from '../../Components/CardEdificio/CardEdificio'
import Cookies from 'js-cookie'

const Administrador = () => {

  const [edificios, setEdificios] = useState([])
  const tokenAdmin = Cookies.get('token');
  if (tokenAdmin === undefined) {
    window.location.replace('/')
  }

  const cerrarSesion = () => {
    Cookies.remove('id');
    Cookies.remove('token');
    window.location.replace('/')
  }

  useEffect(() =>{
    const response = axios.get(`http://serpaadministrador.com.ar:8000/edificio/get-edificio`)
    .then((response) =>{
      setEdificios(response.data);
    })
    .catch((error) =>{
      console.error(error);
    })

  }, [tokenAdmin])

  document.body.classList.add('bg-white');

  return (
    <>
      <div className="mt-5 cajaGrandeEdificios mx-auto">
        <div className='w-100'>
          <h2 className='tituloEdificios'>MIS EDIFICIOS</h2>
          <div className="cajaEdificiosBorde w-100 d-flex flex-wrap px-5">
          {
            edificios.sort((a, b) => (a.name > b.name) ? 1 : -1).map((edificio) => (<CardEdificio key={edificio._id} edificio={edificio} />))
          }
          </div>
        </div>
        <div className='divCrearEdificio mt-4'>
          <a href='/Crear/Edificio'>
            <button className="botonAgregarEdificio mt-4 ">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              Nuevo Edificio
            </button>
          </a>
        </div>
      </div>
    </>
  )
}


export default Administrador;