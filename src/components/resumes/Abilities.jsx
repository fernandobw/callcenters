import { createRef, useEffect, useState } from 'react';
import Swal   from 'sweetalert2';
import { DeleteOutlined,  } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios-client';


const Abilities = () => {
    // const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [validationError, setValidationError] = useState([]);
    const [abilities, setAbilities] = useState({})
    const {setNotification} = useStateContext()

    const abilityRef = createRef()
    
    useEffect( ()=>{
        getAbilities()
    },[refresh])


    const getAbilities = () => {
        // setLoading(true)
        axiosClient.get('/ability').then( ({data}) => {

            setAbilities(data);
            // setLoading(false)

        }).catch( err =>{
            const response = err.response
            // setLoading(false)
            console.log(response);
        })
    }

    const deleteAbility = (id) => {
        // setLoading(true)
        axiosClient.delete('/ability/' + id).then( ()=>{

            // setLoading(false)
            setRefresh(Math.random())
            setNotification('Ha sido eliminada satisfactoriamente.')

        }).catch( err => {
            // setLoading(false)
            const response = err.response
            console.log(response);
        })
    }


    const onSubmit = (ev) =>{
        ev.preventDefault()

        // setLoading(true)

        const payload = {
            ability: abilityRef.current.value
        }
        
        axiosClient.post('/ability', payload).then( ({data}) =>{
            // setLoading(false)
            setRefresh(Math.random())
            setAdding(false)
            setValidationError({})
            setNotification('Ha sido agregado satisfactoriamente.')
        }).catch( err => {
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(response.data);
            }
        })
    }

    return ( 
        <>
        {Object.keys(abilities).length ? abilities.map( (row, i) => (
            <span key={row.id}>
                {row.ability}
                <button className="ctaAction ctaDeleteAbility"
                    onClick={ () => Swal.fire({
                                title: '¿Está seguro que desea eliminarlo?',
                                icon: 'warning',
                                showCancelButton: true,
                                cancelButtonText: "Cancelar",
                                confirmButtonText: '¡Si, elimínalo!'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteAbility( row.id );
                                }
                            })
                        }
                ><DeleteOutlined /></button> 
            </span>
        )):null}
                
        {adding ?
            <div className="formAddAbility">
                <form onSubmit={onSubmit}>
                    <div className="row g-0">
                        <div className="col-6">
                            <div className="form-floating">
                                <input type="text" ref={abilityRef} placeholder="Aptitud" className="form-control" maxLength={25} />
                                <label htmlFor="ability">Aptitud { validationError && validationError.ability ? <span className="tip-warning">* {validationError.ability[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-3">
                            <button type="submit" className="btn btn-success w-100 m-0">Guardar</button>
                        </div>
                        <div className="col-3">
                            <button className="btn btn-default m-0" onClick={ () => setAdding(false) }>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        : <button className='ctaAddIcon btn p-0' onClick={ () => setAdding(true) }>+ Agregar Aptitud</button>}

        </>
    );
}
 
export default Abilities;