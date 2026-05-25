import { createRef, useState } from "react";
import Swal   from 'sweetalert2';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";
import ctaAddIcon from '../../assets/images/cta_add.svg';

const Softwares = () => {
    const [ adding, setAdding ] = useState(false);
    const [saving, setSaving] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const {user, setNotification, setRefreshData, complements, cities} = useStateContext()

    const softwareRef = createRef()
    const levelRef = createRef()

    const onSubmit = (ev) =>{
        ev.preventDefault()
        setSaving(true)

        const payload = {
            software: softwareRef.current.value,
            level: levelRef.current.value,
            resume_id: user.resume.id
        }

        axiosClient.post('/softwares', payload).then( ({data}) => {
            
            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Se ha agregado satisfactoriamente.')
            setAdding(false)

        }).catch( err => {
            setSaving(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(response.data);
            }
        })
    }

    const deleteSoftware = (id) => {
        setSaving(true)

        axiosClient.delete(`/softwares/${id}`).then( ({data}) => {
            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Se ha eliminado satisfactoriamente.')

        }).catch( err => {
            setSaving(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(response.data);
            }
        })
    }

    return (
        <div className="block blockLanguages">
            <h3>Otras habilidades</h3>
            <div className="content">
                <table className="table">
                <tbody>
                    {user.resume && user.resume.softwares.map( (row, i) => (
                        <tr key={row.id}>
                            <td>{row.software}</td>
                            <td>{row.level}</td>
                            <td>
                                <button className="ctaAction"
                                    onClick={ () => Swal.fire({
                                                title: '¿Está seguro que desea eliminarlo?',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                cancelButtonText: "Cancelar",
                                                confirmButtonText: '¡Si, elimínalo!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    deleteSoftware( row.id );
                                                }
                                            })
                                        }
                                ><DeleteOutlined /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>

                
                {adding ? 

                <form onSubmit={onSubmit} className="formAddEducation">
                    <div className="row g-2">
                        <div className="col-12">
                            <hr/>
                            <h2>Añadir habilidad</h2>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                            <input type="text" ref={softwareRef} placeholder="Habilidad" className="form-control" />
                                <label htmlFor="language">Habilidad { validationError && validationError.software ? <span className="tip-warning">* {validationError.software[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                                <select ref={levelRef} className="form-control">
                                    <option value="">Seleccione</option>
                                    {complements && complements.filter(it => (it.type === 'level')).map( itm => (
                                        <option value={itm.title} key={itm.id}>{itm.title}</option>
                                    ))}
                                </select>
                                <label htmlFor="level">Nivel { validationError && validationError.level ? <span className="tip-warning">* {validationError.level[0]}</span> : null }</label> 
                            </div>
                        </div>
                        
                        <div className="col-6">
                            <button type="submit" className="btn btn-success btnAddEduc" disabled={saving ? true : ''}>{ saving ? <LoadingOutlined /> : null } Agregar</button>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-default btnCancelar" onClick={ () => setAdding(false) }>Cancelar</button>
                        </div>
                    </div>
                </form>

                :
                <img src={ctaAddIcon} alt="Add" className="ctaAddIcon" width="30" height="30"
                    onClick={ () => setAdding(true) }
                />
                }
            </div>
        </div>
    );
}
 
export default Softwares;