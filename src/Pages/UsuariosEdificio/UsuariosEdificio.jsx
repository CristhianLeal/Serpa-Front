import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import FilaUsuariosEdificio from '../../Components/FilaUsuariosEdificio/FilaUsuariosEdificio'
import './usuariosEdificio.css'
import Cookies from 'js-cookie'
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const UsuariosEdificio = () => {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    const [usuarios, setUsuarios] = useState([])
    const [usuariosPrint, setUsuariosPrint] = useState([])
    const { edificioName } = useParams();
    const [edificios, setEdificios] = useState([]);
    const [edificio, setEdificio] = useState(null);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const tokenAdmin = Cookies.get('token');
    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }

    const handleGoBack = () => {
        window.location.replace('/Administracion')
    };

    const Apretado = async () => {
        swalWithBootstrapButtons
            .fire({
                title: `¿Estas seguro que quieres eliminar este edificio?`,
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
                    await borrarEdificio();
                    swalLoading.close();
                    swalWithBootstrapButtons
                        .fire(
                            "¡Edificio eliminado!",
                            "Se elimino el edificio con éxito.",
                            "success"
                        )
                        .then(() => {
                            window.location.replace('/Administracion');
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

    const borrarEdificio = async () => {
        await axios.delete(`http://localhost:8000/edificio/delete-edificio`, {
            data: {
                name: edificioName
            }
        })
            .catch((error) => {
                console.error(error);
            })
    }

    useEffect(() => {
        const response = axios
            .get(`http://localhost:8000/edificio/get-edificio`)
            .then((response) => {
                setEdificios(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [tokenAdmin]);

    useEffect(() => {
        const selectedEdificio = edificios.find((e) => e.name === edificioName);
        setEdificio(selectedEdificio);
    }, [edificios, edificioName]);

    useEffect(() => {
        const response = axios.get(`http://localhost:8000/users/obtener-users`)
            .then((response) => {
                const filteredUsuarios = response.data.filter((usuario) => usuario.edificio === edificioName);
                setUsuarios(filteredUsuarios);
                setUsuariosPrint(filteredUsuarios);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [edificioName])

    const searchCoinciden = (busqueda) => {
        const resultados = usuarios.filter(
            (usuario) =>
                usuario.name.toUpperCase().includes(`${busqueda.toUpperCase()}`) ||
                usuario.surname.toUpperCase().includes(`${busqueda.toUpperCase()}`) ||
                usuario.dni.toLowerCase().includes(`${busqueda.toLowerCase()}`) ||
                usuario.email.toLowerCase().includes(`${busqueda.toLowerCase()}`) ||
                usuario.piso.toLowerCase().includes(`${busqueda.toLowerCase()}`) ||
                usuario.puerta.toLowerCase().includes(`${busqueda.toLowerCase()}`) ||
                usuario.tipo.toLowerCase().includes(`${busqueda.toLowerCase()}`) ||
                usuario.baulera.toLowerCase().includes(`${busqueda.toLowerCase()}`)
        );
        setUsuariosPrint(resultados);
    };

    const {
      register: registerExpensa,
      handleSubmit: handleSubmitExpensa,
      formState: { errors: errorsExpensa },
    } = useForm();

    const onSubmitExpensa = async (data) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/uploads/upload-file",
          {
            file: data.expensaFile[0],
            userId: usuario.usuario._id,
            tipo: 'expensa'
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await axios.patch("http://localhost:8000/users/actualizar-fecha",{
            id:usuario.usuario._id,
            tipo: "expensa"
        });
        setLoading(false);
        setSuccess(true);
        window.location.reload(true);
      } catch (error) {
        setLoading(false);
        setError(true);
        setErrorMessage(error.message);
      }
    };

    function handleFileInputChange(event) {
      const fileInput = event.target;
      const selectedFileName = fileInput.files[0]?.name || 'Seleccione archivo';
      fileInput.setAttribute("data-file-name", selectedFileName);
    }

    return (
        <>
            {edificio ? (
                <>
                    <div className='container-fluid p-0'>
                        <div className='divBotonVolverAtras mt-4 ms-4 d-flex justify-content-start'>
                            <button className="botonAgregarEdificio px-2 py-0" onClick={handleGoBack}>
                                <i className="bi bi-arrow-left-short"></i>
                            </button>
                        </div>
                    </div>
                    <h2 className='text-center text-white tituloEdificio mx-auto'>{edificioName}</h2>
                    <div className='d-flex responsive-tabla mt-5'>
                        <div className="pb-5 w-100">
                            <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-6">
                                <div className="d-flex flex-row">
                                    <div className='divBotonAgregarUsuario ms-1 me-1 mb-2 col-3'>
                                    <input
                                        type="text"
                                        className="form-control barraBusqueda"
                                        onInput={(event) => searchCoinciden(event.target.value)}
                                        placeholder="Buscar usuario..."
                                        aria-label="Search"
                                        aria-describedby="search-button"
                                    />
                                    </div>
                                    <div className='divBotonAgregarUsuario pt-1 ms-1 me-1 mb-2 col-3'>
                                        <a href={`/Crear/Usuario/${edificioName}`}>
                                            <button className="botonAgregarEdificio">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 18">
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                                Crear usuario
                                            </button>
                                        </a>
                                    </div>
                                    <div className='divBotonAgregarUsuario pt-1 ms-1 me-1 mb-2 col-3'>
                                    <button className="botonBorrarEdifcio" onClick={Apretado}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 10 18">
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                        </svg>
                                        <span className='ms-2'>Borrar edificio</span>
                                    </button>
                                    </div>
                                    <div className='divBotonAgregarUsuario pt-1 ms-1 me-1 mb-2 col-3'>
                                        <form onSubmit={handleSubmitExpensa(onSubmitExpensa)} className="formSubirArchivo divBotonAgregarUsuario">
                                            <div className="input-group w-100 mx-auto">
                                            <input
                                                type="file"
                                                className="form-control"
                                                {...registerExpensa("expensaFile", { required: true })}
                                                data-file-name="Select File.."
                                                onChange={handleFileInputChange}
                                            />
                                            <button type="submit" className={success ? "btn btn-success" : "btn btn-personalizado"}>
                                                {loading && (
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                )}
                                                {!loading && !success && "Subir Exp Gral"}
                                                {success && (
                                                <>
                                                    <span
                                                    className="me-2">
                                                    <i className="bi bi-check text-light"></i>
                                                    </span>
                                                </>
                                                )}
                                            </button>
                                            </div>
                                            {errorsExpensa.expensaFile && (
                                            <span className="text-danger fs-6">Seleccione un archivo.</span>
                                            )}
                                            {error && <p className="text-danger">{errorMessage}</p>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='tabla-usuarios fs-6'>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead className='align-middle'>
                                            <tr className='text-center'>
                                                <th className="fs-6">Cliente</th>
                                                <th className="fs-6">Correo</th>
                                                <th className="fs-6">Piso</th>
                                                <th className="fs-6">Puerta</th>
                                                <th className="fs-6">Tipo</th>
                                                <th className="fs-6">Subir archivo</th>
                                                <th className="fs-6">Ult. Expensas</th>
                                                <th className="fs-6">Ult. Recibo</th>
                                                <th className="fs-6">Ult. Comp. de pago</th>
                                                <th className="fs-6">Perfil</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {
                                                usuariosPrint.sort((a, b) => a.piso - b.piso).map((usuario) => (<FilaUsuariosEdificio key={usuario._id} usuario={usuario} />))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='mx-auto text-center mt-5'>
                        <a href='/Administracion' className=''><button className="btn-edificio-2 mt-2 ms-2">Volver a Administración</button></a>
                    </div>
                </>
            )}
        </>
    )
}

export default UsuariosEdificio;