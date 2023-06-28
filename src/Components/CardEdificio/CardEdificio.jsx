import React from 'react'
import icono from '../../assets/building.png'
import './cardEdificio.css'

function CardEdificio(edificio) {

    const irAEdificio = () => {
        const edificioName = edificio.edificio.name;
        window.location.replace(`/Edificio/${edificioName}`);
    };

    return (
        <>
            <div className='cardEdificio d-flex flex-column' onClick={irAEdificio}>
                <div className='text-center fs-1 iconoEdificios mx-auto'><img src={icono} className='iconoEdificioImagen' /></div>
                <div className="card-body px-2 border rounded-4">
                    <div className=''><h4 className="card-title text-center">{edificio.edificio.name}</h4></div>
                </div>
            </div>
        </>
    )

}

export default CardEdificio

{/*

<div className='cardEdificio d-flex flex-column' onClick={irAEdificio}>
    <div className='text-center fs-1 iconoEdificios mx-auto'><img src={icono} className='iconoEdificioImagen' /></div>
    <div className="card-body px-2 border rounded-4">
        <div className=''><h4 className="card-title text-center">{edificio.edificio.name}</h4></div>
    </div>
</div> 

<div className='cardEdificio d-flex flex-column' onClick={irAEdificio}>
    <div className='d-flex align-items-center px-2 border rounded-4 m-2'>
        <div className='text-center fs-1 iconoEdificios me-3'><img src={icono} className='iconoEdificioImagen' /></div>
        <div className="card-body">
            <h4 className="card-title ms-2">{edificio.edificio.name}</h4>
        </div>
    </div>
</div>

*/}

