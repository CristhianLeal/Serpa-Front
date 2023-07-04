import React, { useState, useEffect } from 'react'
import SubirArchivo from '../SubirArchivo/SubirArchivo'
import axios from 'axios'
import './filaUsuariosEdificio.css'
import Swal from "sweetalert2";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


function FilaUsuariosEdificio(usuario) {

  const [error, setError] = useState(false)
  const [error2, setError2] = useState(false)
  const [error3, setError3] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [tipo, setTipo] = useState("");

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://serpaadministracionback.onrender.com/uploads/getpdf-ultimo/${usuario.usuario._id}`, {
        responseType: 'blob',
      });
      
      if (response.status === 200) {
        const date = new Date();
        const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  
        const fileExtension = response.data.type.split('/')[1];
  
        const downloadFilename = `Recibo Serpa - ${usuario.usuario.name} ${usuario.usuario.surname} - ${month}.${fileExtension}`;
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

  const downloadPdf2 = async () => {
    setIsLoading2(true);
    try {
      const response = await axios.get(`https://serpaadministracionback.onrender.com/uploads/getpdf-ultimo-comprobante/${usuario.usuario._id}`, {
        responseType: 'blob',
      });
  
      if (response.status === 200) {
        const date = new Date();
        const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  
        const fileExtension = response.data.type.split('/')[1];
  
        const downloadFilename = `Comprobante Serpa - ${usuario.usuario.name} ${usuario.usuario.surname} - ${month}.${fileExtension}`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        setIsLoading2(false);
      } else if (response.status === 206) {
        setIsLoading2(false);
        setError2(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPdf3 = async () => {
    setIsLoading3(true);
    try {
      const response = await axios.get(`https://serpaadministracionback.onrender.com/uploads/getpdf-ultimo-expensa/${usuario.usuario._id}`, {
        responseType: 'blob',
      });
      
      if (response.status === 200) {
        const date = new Date();
        const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  
        const fileExtension = response.data.type.split('/')[1];
  
        const downloadFilename = `Expensa Serpa - ${usuario.usuario.name} ${usuario.usuario.surname} - ${month}.${fileExtension}`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        setIsLoading3(false);
      } else if (response.status === 206) {
        setIsLoading3(false);
        setError3(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (usuario.usuario.tipo === "Departamento") {
      setTipo("D");
    } else if (usuario.usuario.tipo === "Local") {
      setTipo("L");
    } else if (usuario.usuario.tipo === "Oficina") {
      setTipo("O");
    } else if (usuario.usuario.tipo === "Cochera") {
      setTipo("C");
    }
  }, [usuario])

  return (
    <>
      <tr>
        <td className="border columnaSubirArchivo">{usuario.usuario.name} {usuario.usuario.surname}</td>
        <td className="border">{usuario.usuario.email}</td>
        <td className="border">{usuario.usuario.piso}</td>
        <td className="border">{usuario.usuario.puerta}</td>
        <td className="border">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id="tooltip">{usuario.usuario.tipo}</Tooltip>}
          >
            <div style={{ display: 'inline-block', width: '100%' }}>
              {tipo}
            </div>
          </OverlayTrigger>
        </td>
        <td className="border"><SubirArchivo usuario={usuario.usuario} /></td>
        <td className='border'>
          {isLoading3 ? (
            <div className="d-flex justify-content-center mt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Descargando...</span>
              </div>
            </div>
          ) : (
            <button className="botonDescargarAdmin ps-3 pe-3 pt-1 pb-1" onClick={downloadPdf3}>
              <div className='fs-6'>
                {usuario.usuario.date !== "Sin archivo" && (
                  <>
                    <i className="bi bi-download" style={{ marginRight: '0.5rem' }}></i>
                    {usuario.usuario.date}
                  </>
                )}
                {usuario.usuario.date === "Sin archivo" && "---"}
              </div>
            </button>
          )}
          {
            error3 ? <div className='text-center text-muted fs-6'>¡No hay expensas!</div> : <></>
          }
        </td>
        <td className='border'>
          {isLoading ? (
            <div className="d-flex justify-content-center mt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Descargando...</span>
              </div>
            </div>
          ) : (
            <button className="botonDescargarAdmin ps-3 pe-3 pt-1 pb-1" onClick={downloadPdf}>
              <div className='fs-6'>
                {usuario.usuario.date !== "Sin archivo" && (
                  <>
                    <i className="bi bi-download" style={{ marginRight: '0.5rem' }}></i>
                    {usuario.usuario.date}
                  </>
                )}
                {usuario.usuario.date === "Sin archivo" && "---"}
              </div>
            </button>
          )}
          {
            error ? <div className='text-center text-muted fs-6'>¡No hay recibo!</div> : <></>
          }
        </td>
        <td>
        {isLoading2 ? (
          <div className="d-flex justify-content-center mt-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Descargando...</span>
            </div>
          </div>
        ) : (
          <button className="botonDescargarAdmin ps-3 pe-3 pt-1 pb-1" onClick={downloadPdf2}>
            <div className='fs-6'>
              {usuario.usuario.dateComprobante !== "Sin archivo" && (
                <>
                  <i className="bi bi-download" style={{ marginRight: '0.5rem' }}></i>
                  {usuario.usuario.dateComprobante}
                </>
              )}
              {usuario.usuario.dateComprobante === "Sin archivo" && "---"}
            </div>
          </button>
        )}
        {
          error2 ? <div className='text-center text-muted fs-6'>¡No hay comprobante!</div> : <></>
        }          
        </td>
        <td className='border'>
          <a href={`/Administracion/Perfil/${usuario.usuario._id}`}>
            <button className="botonDescargarAdmin">
              <i className="bi bi-person-fill"></i>
            </button>
          </a>
        </td>
      </tr>

    </>
  )
}

export default FilaUsuariosEdificio