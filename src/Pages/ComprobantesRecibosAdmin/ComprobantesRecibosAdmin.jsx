import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import SubirArchivoUser from '../../Components/SubirArchivoUser/SubirArchivoUser'
import SubirArchivo from '../../Components/SubirArchivo/SubirArchivo'
import axios from 'axios'
import Cookies from 'js-cookie'
import CardReciboUsuario from '../../Components/CardReciboUsuario/CardReciboUsuario'

function ComprobantesRecibosAdmin() {

    const [users, setUsers] = useState({})
    const [comprobantes, setComprobantes] = useState([])
    const [recibos, setRecibos] = useState([])
    const [expensas, setExpensas] = useState([])
    const { id } = useParams();
    const idUser = id
    const tokenAdmin = Cookies.get('token');

    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }

    useEffect(() => {
        if (idUser !== undefined) {
            axios.get(`https://serpaadministracionback.onrender.com/users/${idUser}`)
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                })

            const getPdfs = async () => {
                const response = await axios.get(`https://serpaadministracionback.onrender.com/uploads/getpdf/${idUser}`);
                setComprobantes(response.data.comprobantes);
                setRecibos(response.data.recibos);
                setExpensas(response.data.expensas);
            }

            getPdfs()
        }
    }, [idUser])

    const handleGoBack = () => {
        window.location.replace(`/Administracion/Perfil/${idUser}`)
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
                <div className='d-flex flex-wrap contenedorTituloYSubirDocumento'>
                    <h4 className='pt-2'>Expensas</h4>
                    <div className='d-flex justify-content-center'>
                        <SubirArchivo usuario={users} />
                    </div>
                </div>
                <div className='contenedorComprobantes'>
                    {expensas === undefined ? (
                        <div className='noHayDocumento'>No hay expensas subidas.</div>
                    ) : (
                        expensas.map(comprobante => (
                            <CardReciboUsuario comprobante={comprobante} user={users} key={comprobante.id} />
                        ))
                    )}
                </div>
            </div>
            <div className='divComprobantes'>
                <div className='d-flex flex-wrap contenedorTituloYSubirDocumento'>
                    <h4 className='pt-2'>RECIBOS</h4>
                    <div className='d-flex justify-content-center'>
                        {/* <SubirArchivo usuario={users} /> */}
                    </div>
                </div>
                <div className='contenedorComprobantes'>
                    {recibos === undefined ? (
                        <div className='noHayDocumento'>No hay comprobantes subidos.</div>
                    ) : (
                        recibos.map(comprobante => (
                            <CardReciboUsuario comprobante={comprobante} user={users} key={comprobante.id} />
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

export default ComprobantesRecibosAdmin