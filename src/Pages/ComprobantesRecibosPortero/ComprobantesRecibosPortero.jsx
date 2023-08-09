import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import SubirArchivoUser from '../../Components/SubirArchivoUser/SubirArchivoUser'
import SubirArchivo from '../../Components/SubirArchivo/SubirArchivo'
import axios from 'axios'
import Cookies from 'js-cookie'
import CardReciboUsuario from '../../Components/CardReciboUsuario/CardReciboUsuario'

function ComprobantesRecibosPortero() {

  const [users, setUsers] = useState({})
  const [comprobantes, setComprobantes] = useState([])
  const [recibos, setRecibos] = useState([])
  const [expensas, setExpensas] = useState([])
  const { id } = useParams();
  const idUser = id
  const tokenAdmin = Cookies.get('token');
  const [selectedEdificio, setSelectedEdificio] = useState(null);

  if (tokenAdmin === undefined) {
    window.location.replace('/')
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (idUser !== undefined) {
        try {
          const response = await axios.get(`http://serpaadministrador.com.ar:8000/users/${idUser}`);
          setUsers(response.data);
          const response2 = await axios.get(`http://serpaadministrador.com.ar:8000/edificio/getEdificioName/${response.data.edificio}`)
          setSelectedEdificio(response2.data);
          const response3 = await axios.get(`http://serpaadministrador.com.ar:8000/uploads/getpdf/${idUser}`);
          setComprobantes(response3.data.comprobantes);
          setRecibos(response3.data.recibos);
          const response4 = await axios.get(`http://serpaadministrador.com.ar:8000/uploads/getpdf/${response2.data._id}`);
          setExpensas(response4.data.expensas);
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    fetchUser();
  }, [idUser]);

    const handleGoBack = () => {
        window.location.replace(`/Edificio/Prueba`)
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
                    <h4 className='pt-2'>RECIBOS DE SUELDO</h4>
                    <div className='d-flex justify-content-center'>
                        <SubirArchivo usuario={users} />
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
        </>
    )
}

export default ComprobantesRecibosPortero