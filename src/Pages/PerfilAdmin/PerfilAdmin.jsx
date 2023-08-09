import React, { useState, useEffect } from 'react'
import './perfilAdmin.css'
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'js-cookie'

function PerfilAdmin() {

  const [users, setUsers] = useState({})
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const idUser = id

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  useEffect(() =>{
    if (idUser !== undefined){
        axios.get(`http://serpaadministrador.com.ar:8000/users/${idUser}`)
        .then((response) =>{
            setUsers(response.data);
        })
        .catch((error) =>{
            console.error(error);
        })
    }
}, [idUser])

const downloadPdf = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`http://serpaadministrador.com.ar:8000/uploads/getpdf/${idUser}`, {
      responseType: 'blob',
    });

    if (response.status === 200) {
      const date = new Date();
      const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);

      const fileExtension = response.data.type.split('/')[1];

      const downloadFilename = `Comprobante Serpa - ${users.name} ${users.surname} - ${month}.${fileExtension}`;
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

  const borrarUsuario = async () => {
    await axios.delete(`http://serpaadministrador.com.ar:8000/users/eliminar-user`, {
        data: {
            id: idUser
        }})
    window.location.replace(`/Edificio/${users.edificio}`)
}

const Apretado = async () => {
  swalWithBootstrapButtons
    .fire({
      title: `¿Estas seguro que quieres eliminar este usuario?`,
      text: "¡No podrás deshacer esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const swalLoading = Swal.fire({
          title: "Procesando... ¡No cierre esta ventana!",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await borrarUsuario();
        swalLoading.close();
        swalWithBootstrapButtons
          .fire(
            "¡Usuario eliminado!",
            "Se elimino el usuario con éxito.",
            "success"
          )
          .then(() => {
            window.location.reload(true);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelado",
          "¡Estuvo cerca!",
          "error"
        );
      }
    });
  };

  const handleGoBack = () => {
    window.location.replace(`/Edificio/${users.edificio}`)
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
      <div className='cardPerfilAdmin'>
        <div className='cardPerfil pt-5 pb-5 mx-auto px-2' >
          <div className='text-center'><h1 className='tituloPerfil'>{users.name} {users.surname}</h1></div>
          <div className='emailInfoPerfil'>
            <i className="bi bi-envelope-fill text-muted fs-3 me-1 iconoPerfilAdmin"></i>{users.email}
          </div>
          <div className='text-center mb-4'><h3 className='fs-6 text-muted'>{users.tipo}</h3></div>
          <div className='d-flex flex-column justify-content-center text-center'>
            <div>
              <i className="bi bi-buildings-fill text-muted fs-4 me-1"></i> Edificio {users.edificio}
            </div>
            <div>
              <i className="bi bi-door-closed-fill text-muted fs-4 me-1"></i> Piso {users.piso} | Puerta {users.puerta}
            </div>
            <div>
              <i className="bi bi-archive-fill text-muted fs-4 me-1 iconoPerfilAdmin"></i> Baulera {users.baulera}
            </div>
            <div>
              <i className="bi bi-lock-fill text-muted fs-4 me-1 iconoPerfilAdmin"></i> {users.password}
            </div>
            <div>
              <i className="bi bi-person-vcard-fill text-muted fs-4 me-1 iconoPerfilAdmin"></i> {users.dni}
            </div>
            <div>
              <i className="bi bi-calendar-week-fill text-muted fs-4 me-1 iconoPerfilAdmin"></i> Ultimo archivo: {users.date}
            </div>
            <div>
              <a href={`/Administracion/Usuario/Documentos/${users._id}`}>
                <button className='botonDocumentosPerfil'>
                  VER DOCUMENTOS
                </button>
              </a>
            </div>
            <div className='d-flex justify-content-evenly mt-3'>
              <div className="btn-group" role="group" aria-label="Basic example">
                <a href={`/Administracion/Editar/Usuario/${users._id}/${users.edificio}`}>
                  <button className="botonDescargarPerfilAdmin">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                </a>
                <a href={`/Administracion/Recuperar-contraseña/${users._id}`}>
                  <button className="botonDescargarPerfilAdmin2">
                    <i className="bi bi-lock-fill"></i>
                  </button>
                </a>
                <button className="botonEliminarPerfilAdmin" onClick={Apretado}>
                  <i className="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }

export default PerfilAdmin