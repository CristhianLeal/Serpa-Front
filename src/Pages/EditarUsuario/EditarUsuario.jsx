import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { createRouter } from '@remix-run/router';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'


const EditarUsuario = () => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { id, edificioName } = useParams();
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const [edificio, setEdificio] = useState(null);

    const tokenAdmin = Cookies.get('token');
    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }

    const handleGoBack = () => {
        window.location.replace(`/Administracion/Perfil/${id}`)
    };

    useEffect(() => {

        const getUser = async () =>{
        const respuesta = await axios
        .get(`https://serpaadministrador.com.ar:8001/users/${id}`)
        .then((response) => {
            setUser(response.data);
            if (response.status === 200) {
                if (response.data.name !== "-"){
                    setValue("name", response.data.name);
                }
                if (response.data.surname !== "-"){
                    setValue("surname", response.data.surname);
                }
                if (response.data.email !== "-"){
                    setValue("email", response.data.email);
                }
                if (response.data.password !== "-"){
                    setValue("password", response.data.password);
                }
                if (response.data.baulera !== "-"){
                    setValue("baulera", response.data.baulera);
                }
                if (response.data.dni !== "-"){
                    setValue("dni", response.data.dni);
                }
                if (response.data.piso !== "-"){
                    setValue("piso", response.data.piso);
                }
                if (response.data.puerta !== "-"){
                    setValue("puerta", response.data.puerta);
                }
                if (response.data.tipo !== "-"){
                    setValue("tipo", response.data.tipo);
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
        }

        getUser()
      }, [id]);

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
        const respuesta = await axios.patch(
            `https://serpaadministrador.com.ar:8001/users/editar-user`,
            {
                id,
                name: data.name.trim(),
                surname: data.surname.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password.trim(),
                dni: data.dni.trim(),
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
        {id ? (
            <div>
                <div className='container-fluid p-0'>
                    <div className='divBotonVolverAtras mt-4 ms-4 d-flex justify-content-start'>                        
                        <button className="botonAgregarEdificio px-2 py-0" onClick={handleGoBack}>
                            <i className="bi bi-arrow-left-short"></i>
                        </button>
                    </div>
                </div>
                <div className="row w-100 justify-content-center m-0">
                    <div className=' col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 container-crear-usuario pt-2 pb-2'>
                        <h3 className='text-center mt-2 mb-4 text-white'>Editar usuario</h3>
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
                                    "Editar"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div className='mx-auto text-center mt-5'>
                    <a href={`/Edificio/${edificioName}`} className=''><button className="btn-edificio-2 mt-2 ms-2">Volver atras</button></a>
                </div>
            </>
        )}
        </>
    )
}

export default EditarUsuario;