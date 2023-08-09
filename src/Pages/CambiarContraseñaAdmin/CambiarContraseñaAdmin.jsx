import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from "axios";
import './cambiarContraseñaAdmin.css'

const CambiarContraseñaAdmin = () => {

    const [loading, setLoading] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { user } = useParams();

    const tokenAdmin = Cookies.get('token');
    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }
    
    const password = watch("password", "");

    const handleGoBack = () => {
        window.location.href = document.referrer;
      };

  

    const onSubmit = async (data) => {
        setLoading(true);
        const respuesta = await axios.post(
            `https://serpaadministrador.com.ar:8001/users/recuperar-password-admin`,
            {
                id: user,
                password:data.password
            }
        );
        if (respuesta.status === 200) {
            window.location.replace('/Administracion')
        }
        setLoading(false);
    };

    return (
        <>
            <div className="container-fluid container-body">
                <div className='divBotonVolverAtras'>
                    <button className="botonAgregarEdificio m-5 px-4" onClick={handleGoBack}>
                        <i className="bi bi-arrow-left-short"></i>
                    </button>
                </div>
                <div className="row">
                    <div className='col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 container-cambiar-contraseña pt-2 pb-2'>
                        <h3 className='text-center mt-2 mb-4 text-white'>Nueva contraseña</h3>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                <input
                                    type="password"
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.password ? "is-invalid" : ""} mt-2`}
                                    placeholder="Escriba su contraseña"
                                    {...register("password", { 
                                        required: true,
                                        pattern: /^[a-z0-9]{6,25}$/i,
                                        maxLength: 25, 
                                        minLength: 6, 
                                    })}
                                />
                                {errors.password && errors.password.type === "required" && (
                                    <div className="invalid-feedback">Contraseña requerida</div>
                                )}
                                {errors.password && errors.password.type === "pattern" && (
                                    <div className="invalid-feedback">Contraseña invalida</div>
                                )}
                                {errors.password && errors.password.type === "minLength" && (
                                    <div className="invalid-feedback">
                                        No puede contener menos de 6 caracteres
                                    </div>
                                )}
                                {errors.password && errors.password.type === "maxLength" && (
                                    <div className="invalid-feedback">
                                        No puede contener más de 25 caracteres
                                    </div>
                                )}
                            </div>
                            <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                <input
                                    type="password"
                                    className={`form-control mt-2 mb-2 pt-2 pb-2 ${errors.password2 ? "is-invalid" : ""} mt-2`}
                                    placeholder="Confirmar contraseña"
                                    {...register("password2", {
                                        required: true,
                                        validate: value => value === password || "Las contraseñas no coinciden."
                                    })}
                                />
                                {errors.password2 && errors.password2.type === "required" && (
                                    <div className="invalid-feedback">Contraseña requerida</div>
                                )}
                                {errors.password2 && errors.password2.message && (
                                    <div className="invalid-feedback">{errors.password2.message}</div>
                                )}
                            </div>
                            <button className="btn-crear-usuario mt-3 mb-3">
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm mr-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    "Cambiar"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CambiarContraseñaAdmin;