import React, { useState, useEffect } from 'react'
import './comprobantesRecibos.css'
import icono from '../../assets/pdf.png'
import axios from 'axios'
import Cookies from 'js-cookie'
import SubirArchivoUser from '../../Components/SubirArchivoUser/SubirArchivoUser'
import CardComprobanteUsuario from '../../Components/CardComprobanteUsuario/CardComprobanteUsuario'
import CardReciboUsuario from '../../Components/CardReciboUsuario/CardReciboUsuario'

function ComprobantesRecibos() {


    const [users, setUsers] = useState({})
    const [comprobantes, setComprobantes] = useState([])
    const [recibos, setRecibos] = useState([])
    const [expensas, setExpensas] = useState([])
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const idUser = Cookies.get('id');

    if (idUser === undefined) {
        window.location.replace('/')
    }

    useEffect(() => {
        const fetchUser = async () => {
          if (idUser !== undefined) {
            try {
              const response = await axios.get(`https://serpaadministrador.com.ar:8001/users/${idUser}`);
              setUsers(response.data);
              const response2 = await axios.get(`https://serpaadministrador.com.ar:8001/edificio/getEdificioName/${response.data.edificio}`)
              setSelectedEdificio(response2.data);
              const response3 = await axios.get(`https://serpaadministrador.com.ar:8001/uploads/getpdf/${idUser}`);
              setComprobantes(response3.data.comprobantes);
              setRecibos(response3.data.recibos);
              const response4 = await axios.get(`https://serpaadministrador.com.ar:8001/uploads/getpdf/${response2.data._id}`);
              setExpensas(response4.data.expensas);
            } catch (error) {
              console.error(error);
            }
          }
        };
      
        fetchUser();
      }, [idUser]);

    const handleGoBack = () => {
        if(users.tipo === 'Portero'){
          window.location.replace(`/PerfilPortero`)
        }else{
          window.location.replace(`/Perfil`)
        }
    };

    return (
        <>
            <div className='container-fluid p-0'>
                <div className='divBotonVolverAtras mt-4 ms-4 d-flex justify-content-start'>
                    <button className="botonAgregarEdificio px-2 py-0" onClick={handleGoBack}>
                        <i className="bi bi-arrow-left-short"></i>
                    </button>
                </div>
            </div>
            {users.tipo !== 'Portero' ? (
              <div className='divComprobantes'>
                <h4 className='pt-2'>EXPENSAS</h4>
                <div className='contenedorComprobantes'>
                  {expensas === undefined ? (
                    <div className='noHayDocumento'>No hay expensas subidas.</div>
                  ) : (
                    expensas.map(comprobante => (
                      <CardComprobanteUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                    ))
                  )}
                </div>
              </div>
            ) : null}
            <div className='divComprobantes'>
                <h4  className='pt-2'>RECIBOS</h4>
                <div className='contenedorComprobantes'>
                    {recibos === undefined ? (
                        <div className='noHayDocumento'>No hay comprobantes subidos.</div>
                    ) : (
                        recibos.map(comprobante => (
                            <CardComprobanteUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                        ))
                    )}
                </div>
            </div>
            {users.tipo !== 'Portero' ? (
            <div className='divComprobantes'>
                <div className='d-flex flex-wrap contenedorTituloYSubirDocumento'>
                    <h4 className='pt-2'>COMPROBANTES DE PAGO</h4>
                    <div className='d-flex justify-content-center'>
                        <SubirArchivoUser usuario={users} />
                    </div>
                </div>
                <div className='contenedorComprobantes'>
                    {comprobantes === undefined ? (
                        <div className='noHayDocumento'>No hay recibos subidos.</div>
                    ) : (comprobantes.map(comprobante => (
                        <CardReciboUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                    )))}
                </div>
            </div>
            ) : null}
        </>
    )
}

export default ComprobantesRecibos