import React, { useState, useEffect } from 'react'
import './comprobantesRecibos.css'
import icono from '../../assets/pdf.png'
import axios from 'axios'
import Cookies from 'js-cookie'
import SubirArchivoUser from '../../Components/SubirArchivoUser/SubirArchivoUser'
import SubirArchivo from '../../Components/SubirArchivo/SubirArchivo'
import CardComprobanteUsuario from '../../Components/CardComprobanteUsuario/CardComprobanteUsuario'
import CardReciboUsuario from '../../Components/CardReciboUsuario/CardReciboUsuario'

function ComprobantesRecibos() {


    const [users, setUsers] = useState({})
    const [comprobantes, setComprobantes] = useState([])
    const [recibos, setRecibos] = useState([])
    const [expensas, setExpensas] = useState([])
    const idUser = Cookies.get('id');

    if (idUser === undefined) {
        window.location.replace('/')
    }

    useEffect(() => {
        if (idUser !== undefined) {
            axios.get(`http://localhost:8000/users/${idUser}`)
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                })

            const getPdfs = async () => {
                const response = await axios.get(`http://localhost:8000/uploads/getpdf/${idUser}`);
                setComprobantes(response.data.comprobantes);
                setRecibos(response.data.recibos);
                setExpensas(response.data.expensas);
            }

            getPdfs()
        }
    }, [idUser])


    const handleGoBack = () => {
        window.location.replace(`/Perfil`)
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
            <div className='divComprobantes'>
                <h4  className='pt-2'>EXPENSAS</h4>
                <div className='contenedorComprobantes'>
                    {expensas.length === 0 ? (
                        <div className='noHayDocumento'>No hay expensas subidas.</div>
                    ) : (
                        expensas.map(comprobante => (
                            <CardComprobanteUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                        ))
                    )}
                </div>
            </div>
            <div className='divComprobantes'>
                <h4  className='pt-2'>RECIBOS</h4>
                <div className='contenedorComprobantes'>
                    {recibos.length === 0 ? (
                        <div className='noHayDocumento'>No hay comprobantes subidos.</div>
                    ) : (
                        recibos.map(comprobante => (
                            <CardComprobanteUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                        ))
                    )}
                </div>
            </div>
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
        </>
    )
}

export default ComprobantesRecibos