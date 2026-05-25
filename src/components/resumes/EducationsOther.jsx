import Swal   from 'sweetalert2';
import { isSafari, isFirefox } from "react-device-detect";
import InputMask from 'react-input-mask';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { createRef, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import ctaAddIcon from '../../assets/images/cta_add.svg';
import { LoadingOutlined } from '@ant-design/icons';
import axiosClient from "../../axios-client";


const EducationsOther = () => {
    const [ addingEduc, setAddingEduc ] = useState(false);
    const [ validationError, setValidationError ] = useState([]);
    const [ saving, setSaving ] = useState(false);
    const {user, setNotification, setRefreshData} = useStateContext()

    const [resumeData, setResumeData] = useState({
        resume_id: user.resume && user.resume.id
    });

    const institutionRef = createRef()
    const obtainedTitleRef = createRef()
    const dateFromRef = createRef()
    const dateToRef = createRef()


    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            institution: institutionRef.current.value, 
            obtained_title: obtainedTitleRef.current.value, 
            resume_id: resumeData.resume_id ? resumeData.resume_id : user.resume.id,
            date_from: resumeData.date_from ? resumeData.date_from : dateFromRef.current.value,
            date_to: resumeData.date_to ? resumeData.date_to : dateToRef.current.value
        }

        setSaving(true)

        axiosClient.post('/othereducation', payload).then( ({data})=> {

            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Agregado satisfactoriamente.')
            setAddingEduc(false)

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

    const deleteEducation = (id) => {
        setSaving(true)
        axiosClient.delete(`/othereducation/${id}`).then( ({data}) => {
            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Eliminado satisfactoriamente.')
        }).catch( err => {
            setSaving(false)
            const response = err.response
            console.log(response.data);
        })
    }


    let inputPropsFrom = {
        // placeholder: "Fecha de inicio",
        name: 'date_from',
        autoComplete: 'off',
        required: "required"
    }

    let inputPropsTo = {
        // placeholder: "Fecha de inicio",
        name: 'date_from',
        autoComplete: 'off',
        required: "required"
    }

    return (
        <div className="content">
            
            {user.resume && user.resume.othereducations.map( (row, i) => ( 
                <div className="item-row d-flex" key={row.id}>
                    <span className="p-2">{i+1}</span>
                    <div className="p-2">
                        <button className="ctaAction"
                            onClick={ () => Swal.fire({
                                            title: '¿Está seguro que desea eliminarlo?',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            cancelButtonText: "Cancelar",
                                            confirmButtonText: '¡Si, elimínalo!'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                deleteEducation( row.id );
                                            }
                                        })
                                    }
                            >(-) Eliminar</button>
                        <h4>{row.institution} <small>{'Desde: ' + row.date_from + ' -  Hasta: ' + row.date_to}</small></h4>
                        <p>{row.obtained_title}</p>
                    </div>
                </div>
            ))}
            

            {addingEduc ? 
                <form onSubmit={onSubmit} className="formAddEducation" onChange={()=>setValidationError([])}>
                    <div className="row g-2">
                        <div className="col-12">
                            <hr/>
                            <h2>Añadir educación complementaria</h2>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                                <input ref={obtainedTitleRef} type="text" placeholder="Titulo alcanzado" className="form-control" />
                                <label htmlFor="obtained_title">Titulo alcanzado { validationError && validationError.obtained_title ? <span className="tip-warning">* {validationError.obtained_title[0]}</span> : null }</label> 
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                                <input ref={institutionRef} type="text" name="institution" placeholder="Nombre de la institución" className="form-control" />
                                <label htmlFor="institution">Nombre de la institución { validationError && validationError.institution ? <span className="tip-warning">* {validationError.institution[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                            {isSafari || isFirefox ?
                                <>
                                    <InputMask mask="99/9999" ref={dateFromRef} name="date_from" className="form-control" />
                                    <label htmlFor="date_from">Fecha de inicio</label>
                                </>
                            :
                                <>
                                <Datetime 
                                    dateFormat="MM/YYYY"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    locale="es"
                                    inputProps={inputPropsFrom}
                                    onChange={ val => (
                                        setResumeData({
                                            ...resumeData,
                                            date_from: new Date(val).getMonth()+1 + '/' + new Date(val).getUTCFullYear()
                                        })
                                    )}
                                />
                                <label className="lblDatetime" htmlFor="date_from">Fecha de inicio { validationError && validationError.date_from ? <span className="tip-warning">* {validationError.date_from[0]}</span> : null }</label>
                                </>
                            }
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                            {isSafari || isFirefox ?
                                <>
                                    <InputMask mask="99/9999" name="date_to" className="form-control"
                                        ref={dateToRef}
                                    />
                                    <label htmlFor="date_to">Fecha de finalización</label>
                                </>
                            :
                                <>
                                    <Datetime 
                                        dateFormat="MM/YYYY"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        locale="es"
                                        inputProps={inputPropsTo}
                                        onChange={ val => (
                                            setResumeData({
                                                ...resumeData,
                                                date_to: new Date(val).getMonth()+1 + '/' + new Date(val).getUTCFullYear()
                                            })
                                        )}
                                    />
                                    <label className="lblDatetime" htmlFor="date_to">Fecha de finalización { validationError && validationError.date_to ? <span className="tip-warning">* {validationError.date_to[0]}</span> : null }</label>
                                </>
                            }
                            </div>
                        </div>
                    
                        <div className="col-6">
                            <button type="submit" className="btn btn-success btnAddEduc" disabled={saving ? true : ''}>{ saving ? <LoadingOutlined /> : null } Agregar</button>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-default btnCancelar" onClick={ () => setAddingEduc(false) }>Cancelar</button>
                        </div>
                    </div>
                </form>

            :
                <img src={ctaAddIcon} alt="Add" className="ctaAddIcon" 
                    onClick={ () => setAddingEduc(true) }
                />
            }
        </div>
    );
}
 
export default EducationsOther;