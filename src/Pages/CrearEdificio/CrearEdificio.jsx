import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import { createRouter } from '@remix-run/router';
import Cookies from 'js-cookie'
import './crearEdificio.css'

const CrearEdificio = () => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const name = watch("name", "");

    const tokenAdmin = Cookies.get('token');
    if (tokenAdmin === undefined) {
        window.location.replace('/')
    }

    const handleGoBack = () => {
        window.location.href = document.referrer;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const respuesta = await axios.post(
            `http://localhost:8000/edificio/crear-edificio`,
            {
                name: data.name.trim(),
            }
        );
        if (respuesta.status === 200) {
            window.location.replace('/Administracion')
        }
        if (respuesta.status === 206) {
            setLoading(false);
        }
    };

    document.body.classList.add('crear-edificio');

    return (
        <>
            <div className='divBotonVolverAtras'>
                <button className="botonAgregarEdificio mt-4 ms-4  px-2 py-0" onClick={handleGoBack}>
                    <i className="bi bi-arrow-left-short"></i>
                </button>
            </div>
            <div className="d-flex align-items-center mt-4">
                <div className="container">
                    <div className="row justify-content-center mx-2">
                        <div className=' col-11 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 container-crear-usuario mt-5 pt-2 pb-2'>
                            <h1 className='text-center text-white p-3'>Crear edificio</h1>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                    <input
                                        type="text"
                                        placeholder='Nombre del Edificio'
                                        className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""} mt-2`}
                                        {...register("name", {
                                            required: true,
                                            maxLength: 40,
                                        })}
                                    />
                                    {errors.name && errors.name.type === "required" && (
                                        <div className="invalid-feedback">Nombre requerido</div>
                                    )}
                                    {errors.name && errors.name.type === "maxLength" && (
                                        <div className="invalid-feedback">
                                            No puede contener más de 40 caracteres
                                        </div>
                                    )}
                                </div>
                                <div className="form-group col-12 col-sm-12 col-md-9 col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                                    <input
                                        type="name2"
                                        placeholder='Repetir nombre'
                                        className={`form-control form-control-lg ${errors.name2 ? "is-invalid" : ""} mt-2`}
                                        {...register("name2", {
                                            required: true,
                                            validate: value => value === name || "Los nombres no coinciden."
                                        })}
                                    />
                                    {errors.name2 && errors.name2.type === "required" && (
                                        <div className="invalid-feedback">Nombre requerida</div>
                                    )}
                                    {errors.name2 && errors.name2.message && (
                                        <div className="invalid-feedback">{errors.name2.message}</div>
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
                                        "Crear"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CrearEdificio;