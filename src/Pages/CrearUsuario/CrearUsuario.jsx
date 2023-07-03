import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { createRouter } from '@remix-run/router';
import { useParams } from 'react-router-dom';
import './crearUsuario.css'
import Cookies from 'js-cookie'


const CrearUsuario = () => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { edificioName } = useParams();
    const [edificios, setEdificios] = useState([]);
    const [error, setError] = useState(false);
    const [edificio, setEdificio] = useState(null);

    const tokenAdmin = Cookies.get('token');
    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }

    const handleGoBack = () => {
        window.location.href = document.referrer;
    };

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

    const onSubmit = async (data) => {
        setError(false)
        setLoading(true);
        if(!data.name){
            data.name = '-'
        }
        if(!data.surname){
            data.surname = '-'
        }
        if(!data.baulera){
            data.baulera = '-'
        }
        if(!data.dni){
            data.dni = '-'
        }
        if(!data.piso){
            data.piso = '-'
        }
        if(!data.puerta){
            data.puerta = '-'
        }
        const respuesta = await axios.post(
            `http://localhost:8000/users/crear-user`,
            {
                name: data.name.trim(),
                surname: data.surname.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password.trim(),
                dni: data.dni.trim(),
                edificio: edificioName,
                piso: data.piso.trim(),
                puerta: data.puerta.trim(),
                tipo: data.tipo,
                baulera: data.baulera.trim()
            }
        );
        if (respuesta.status === 200) {
            window.location.replace(`/Edificio/${edificioName}`);
        }
        if (respuesta.status === 206) {
            setLoading(false);
            setError(true)
        }
    };

    document.body.classList.add('crear-usuario');

    return (
        <>
        {edificio ? (
            <div>
                <div className='container-fluid p-0'>
                    <div className='divBotonVolverAtras mt-4 ms-4 d-flex justify-content-start'>                        
                        <button className="botonAgregarEdificio px-2 py-0" onClick={handleGoBack}>
                            <i className="bi bi-arrow-left-short"></i>
                        </button>
                    </div>
                </div>
                <h1 className='text-center text-dark'>{edificioName}</h1>
                <div className="row w-100 justify-content-center m-0">
                    <div className=' col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 container-crear-usuario pt-2 pb-2'>
                        <h3 className='text-center mt-2 mb-4 text-white'>Nuevo Usuario</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                <input
                                    type="text"
                                    placeholder='Nombre'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.name ? "is-invalid" : ""}`}
                                    {...register("name", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Apellido'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.name ? "is-invalid" : ""}`}
                                    {...register("surname", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Documento'
                                    className={`form-control  ${errors.dni ? "is-invalid" : ""} mt-2`}
                                    {...register("dni", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Correo Electrónico'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.email ? "is-invalid" : ""}`}
                                    {...register("email", {
                                        required: true,
                                    })}
                                />
                                {errors.email && errors.email.type === "required" && (
                                    <div className="invalid-feedback">Correo requerido</div>
                                )}

                                { error ? <div className='text-danger'>Correo en uso. (Se usara para iniciar sesión, por lo que no se puede repetir)</div> : <></>}
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                <input
                                    type="text"
                                    placeholder='Contraseña'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.password ? "is-invalid" : ""}`}
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                                {errors.password && errors.password.type === "required" && (
                                    <div className="invalid-feedback">Contraseña requerida</div>
                                )}
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Piso'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.piso ? "is-invalid" : ""}`}
                                    {...register("piso", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Puerta'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.puerta ? "is-invalid" : ""}`}
                                    {...register("puerta", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    placeholder='Baulera'
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.baulera ? "is-invalid" : ""}`}
                                    {...register("baulera", {
                                        required: false,
                                    })}
                                />
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto mt-1">
                                <select className="form-select mt-2 mb-2 pt-2 pb-2"
                                    {...register("tipo", { required: false })}
                                    id="tipo"
                                    name="tipo"
                                >
                                    <option className='text-dark' value="-">Tipo</option>
                                    <option className='text-dark' value="Departamento">Departamento</option>
                                    <option className='text-dark' value="Local">Local</option>
                                    <option className='text-dark' value="Oficina">Oficina</option>
                                    <option className='text-dark' value="Cochera">Cochera</option>
                                </select>
                            </div>
                            <button className="btn-crear-usuario mt-3 mb-3">
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm mr-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    "Agregar"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
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

export default CrearUsuario;