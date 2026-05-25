import { createRef, useState } from 'react';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';

import axiosClient from '../../axios-client';

const AboutMe = () => {
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validationError, setValidationError] = useState(null);
    const {user, setRefreshData, setNotification} = useStateContext()

    const presentationRef = createRef()
    const fnameRef = createRef()
    const lnameRef = createRef()
    const kidsRef = createRef()
    const hasCarRef = createRef()
    const availabilityToTravelRef = createRef()
    const driversLicenseRef = createRef()


    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            presentation: presentationRef.current.value,
            fname: fnameRef.current.value,
            lname: lnameRef.current.value,
            kids: parseInt(kidsRef.current.value),
            drivers_license: parseInt(driversLicenseRef.current.value),
            has_car: parseInt(hasCarRef.current.value),
            availability_to_travel: parseInt(availabilityToTravelRef.current.value)
        }

        axiosClient.put(`/resume/${user.resume && user.resume.id}`, payload).then( ({data}) => {
            
            setValidationError(null)
            setRefreshData(Math.random())
            setNotification('Se han guardado los cambios exitosamente.')
            setEditing(false)

        }).catch( err => {
            setLoading(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(response.data);
            }
        })
    }

    return ( 
        <div className="block">
            <h3>
                Acerca de mí

                <button className="btnEditCTA"
                    onClick={ () => setEditing(true) }
                ><EditOutlined /></button>
            </h3>
            <div className="content">

                { !editing ?
                    
                    <div contentEditable='false' onDoubleClick={ () => setEditing(true) } dangerouslySetInnerHTML={{ __html: user.resume && user.resume.presentation }}></div>
                    
                : 
                    <form onSubmit={onSubmit} onChange={()=>setValidationError(null)}>
                        {validationError && 
                            <div className='alert alert-warning'>
                                {Object.keys(validationError).map( key => (
                                    <p key={key} className='p-0 m-0'>
                                        {validationError[key][0]}
                                    </p>
                                ))}
                            </div>
                        } 
                        
                        <textarea ref={presentationRef} className="form-control" defaultValue={user.resume && user.resume.presentation}></textarea>
                        <div className="row g-2 mt-1">
                            <div className="col-6">
                                <div className="form-floating">
                                    <input type="text" ref={fnameRef} className="form-control" placeholder="Nombre" defaultValue={user.resume && user.resume.fname} />
                                    <label htmlFor="fname">Nombre <span className="requeridField">*</span></label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-floating">
                                    <input type="text" ref={lnameRef} className="form-control" placeholder="Apellidos" defaultValue={user.resume && user.resume.lname} />
                                    <label htmlFor="lname">Apellidos <span className="requeridField">*</span></label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-floating">
                                    <select ref={kidsRef} className="form-control"  defaultValue={user.resume && user.resume.kids}>
                                        <option value="">Seleccione</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                    </select>
                                    <label htmlFor="kids">¿Cuantos hijos tienes?</label>
                                </div>
                                
                            </div>
                            <div className="col-6">
                               <div className="form-floating">
                                    <select className="form-control" ref={driversLicenseRef} defaultValue={user.resume && user.resume.drivers_license}>
                                        <option value="">Seleccione</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label htmlFor="drivers_license">¿Tiene licencia de conducir?</label>
                               </div>
                            </div>
                            <div className="col-6">
                               <div className="form-floating">
                                    <select className="form-control" ref={hasCarRef} defaultValue={user.resume && user.resume.has_car}>
                                        <option value="">Seleccione</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label htmlFor="has_car">¿Tiene auto propio?</label>
                               </div>
                            </div>
                            <div className="col-6">
                               <div className="form-floating">
                                    <select className="form-control" ref={availabilityToTravelRef}  defaultValue={user.resume && user.resume.availability_to_travel}>
                                        <option value="">Seleccione</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label htmlFor="availability_to_travel">¿Disponibilidad para viajar?</label>
                               </div>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-success" disabled={loading ? true : ''}>{ loading ? <LoadingOutlined /> : null } Guardar cambios</button>
                        <button className="btn btn-default" onClick={ () => setEditing(false) }>Cancelar</button>
                    </form>
                }

            </div>
        </div>
    );
}
 
export default AboutMe;