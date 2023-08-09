import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import './cambiarContraseñaEmail.css'

const CambiarContraseñaEmail = () => {

    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const password = watch("password", "");

    const onSubmit = async (data) => {
        setLoading(true);
        const response = await axios.post(
            `https://serpaadministrador.com.ar:8001/users/recuperar-password`,
            {
                email: data.email
            }
        );
        if (response.status === 200) {
            setEnviado(true)
        } else {
            setError(true)
        }
        setLoading(false);
    };

    return (
        <>
            <div className="container-fluid container-body">
                <div className='divBotonVolverAtras'>
                    <a href={`/Administracion`}>
                        <button className="botonAgregarEdificio m-5 px-4">
                            <i className="bi bi-arrow-left-short"></i>
                        </button>
                    </a>
                </div>
                <div className="row">
                    <div className='col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 container-cambiar-contraseña pt-2 pb-2'>
                        <h3 className='text-center mt-2 text-white'>Correo electrónico del usuario</h3>
                        <h3 className='text-center text-white text-opacity-75 fs-6 mb-4'>Enviaremos un enlace a su correo.</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7  mx-auto">
                                <input
                                    type="text"
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.email ? "is-invalid" : ""}`}
                                    {...register("email", {
                                        required: true,
                                        pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i,
                                        maxLength: 40,
                                    })}
                                />
                                {errors.email && errors.email.type === "required" && (
                                    <div className="invalid-feedback">Correo requerido</div>
                                )}
                                {errors.email && errors.email.type === "pattern" && (
                                    <div className="invalid-feedback">Correo invalido</div>
                                )}
                                {errors.email && errors.email.type === "maxLength" && (
                                    <div className="invalid-feedback">
                                        No puede contener más de 40 caracteres
                                    </div>
                                )}
                            </div>
                            <button className="btn-crear-usuario mt-3 mb-3" disabled={enviado}>
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm mr-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    "Enviar"
                                )}
                            </button>
                        </form>
                        {
                            enviado ? <><p className='fs-5 text-opacity-75 text-dark'>Revise su correo.</p></> : <></>
                        }                        
                        {
                            error ? <><p className='fs-5 text-opacity-75 text-dark'>El e-mail no esta registrado.</p></> : <></>
                        }                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default CambiarContraseñaEmail;