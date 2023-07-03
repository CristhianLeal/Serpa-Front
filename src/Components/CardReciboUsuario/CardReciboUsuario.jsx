import React, { useState, useEffect } from 'react'
import icono from '../../assets/pdf.png'
import Swal from "sweetalert2";
import axios from 'axios'
import Cookies from 'js-cookie'

function CardReciboUsuario(props) {

    const comprobante = props.comprobante
    const users = props.user
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEliminar, setIsLoadingEliminar] = useState(false);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    const deletePdf = async () => {
        setIsLoadingEliminar(true);
        try {
          const response = await axios.delete(`http://localhost:8000/uploads/delete-pdf/${comprobante.id}`);
          if (response.status === 200) {    
            setIsLoadingEliminar(false);
          } else if (response.status === 206) {
            setIsLoadingEliminar(false);
          }
          } catch (error) {
            console.error(error);
          }
    };

    const downloadPdf = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:8000/uploads/getpdf-especifico/${comprobante.id}`, {
            responseType: 'blob',
          });
      
          if (response.status === 200) {
      
            const fileExtension = response.data.type.split('/')[1];
      
            const downloadFilename = `Comprobante Serpa - ${users.name} ${users.surname} - ${comprobante.date}.${fileExtension}`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            setIsLoading(false);
          } else if (response.status === 206) {
            setIsLoading(false);
          }
          } catch (error) {
            console.error(error);
          }
        };

  const Apretado = async () => {
    swalWithBootstrapButtons
      .fire({
        title: `¿Estas seguro que quieres eliminar este archivo?`,
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
          await deletePdf();
          swalLoading.close();
          swalWithBootstrapButtons
            .fire(
              "¡Archivo eliminado!",
              "Se elimino el archivo con éxito.",
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



    return (
        <>
        <div className='cardComprobante'>
            <div className='imagenPDFComprobante'><img src={icono} alt="Comprobante Serpa Administración" /></div>
            <div className='fechaCardComprobante fs-6'>{comprobante.date}</div>
            <div className='d-flex justify-content-center gap-2'>
                <div className='botonEliminarCardComprobante'>
                    <button onClick={Apretado}>
                        {isLoadingEliminar ? (
                            <span
                                className="spinner-border spinner-border-sm mr-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : (
                            <>
                                <i className="bi bi-trash3-fill"></i>
                            </>
                        )}   
                    </button>
                </div>
                <div className='botonDescargarCardComprobante'><button onClick={downloadPdf}>                                      
                {isLoading ? (
                    <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                ) : (
                    <>
                    <i className="bi bi-download"></i>
                    </>
                )}           
                </button></div>
            </div>
        </div>
        </>
    )
}

export default CardReciboUsuario