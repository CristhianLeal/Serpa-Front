import React, { useState, useEffect } from 'react'
import './perfilportero.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import SubirArchivoUser from '../../Components/SubirArchivoUser/SubirArchivoUser'

function PerfilPortero() {

  const [users, setUsers] = useState({})
  const [error, setError] = useState(false)
  const [error3, setError3] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading3, setIsLoading3] = useState(false);
  const idUser = Cookies.get('id');  
  const [edificio, setEdificio] = useState(null);
  if (idUser === undefined) {
      window.location.replace('/')
  }

  useEffect(() =>{
    const fetchUser = async () => {
      if (idUser !== undefined) {
        try {
          const response = await axios.get(`http://serpaadministrador.com.ar:8000/users/${idUser}`);
          setUsers(response.data);
          const response2 = await axios.get(`http://serpaadministrador.com.ar:8000/edificio/getEdificioName/${response.data.edificio}`)
          setEdificio(response2.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
  fetchUser();
}, [idUser])


const downloadPdf = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`http://serpaadministrador.com.ar:8000/uploads/getpdf-ultimo/${idUser}`, {
      responseType: 'blob',
    });

    if (response.status === 200) {
      const date = new Date();
      const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);

      const fileExtension = response.data.type.split('/')[1];

      const downloadFilename = `Recibo de sueldo Serpa - ${users.name} ${users.surname} - ${month}.${fileExtension}`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadFilename);
      document.body.appendChild(link);
      link.click();
      setIsLoading(false);
    } else if (response.status === 206) {
      setIsLoading(false);
      setError(true);
    }
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarSesion = () => {
    Cookies.remove('id');
    Cookies.remove('token');
    window.location.replace('/')
  }

    return (
      <div>
        <div className='cardPerfil mx-auto mt-5 pt-5 pb-5 px-2' >
          <div className='text-center'>
            <h1 className='tituloPerfil'>Mi Perfil</h1>
          </div>
          <div className='text-center mb-3'>
            <h3 className='fs-6 text-muted'>{users.tipo}</h3>
          </div>
          <div className='d-flex flex-column justify-content-center text-center'>
            <div>
              <i className="bi bi-buildings-fill text-muted fs-3"></i> Edificio {users.edificio}
            </div>          
            <div>
              <button className='botonDocumentosPerfil' onClick={downloadPdf}>
                { !isLoading ?
                <>DESCARGAR ULTIMO RECIBO</>
                :
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                </>
                }
              </button>
              {
                error ? <div className='text-center text-muted fs-6'>¡No hay recibo cargado!</div> : <></>
              }
            </div>            
            <div>
              <a href="/Perfil/Documentos">
                <button className='botonDocumentosPerfil colorDiferente'>
                  VER ANTERIORES
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default PerfilPortero