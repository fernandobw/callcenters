import { createRef, useState } from "react";
import Swal   from 'sweetalert2';
import { isSafari, isFirefox } from "react-device-detect";
import { useStateContext } from "../../contexts/ContextProvider";
import ctaAddIcon from '../../assets/images/cta_add.svg';
import { LoadingOutlined } from '@ant-design/icons';
import Datetime from 'react-datetime';
import axiosClient from "../../axios-client";


const Experiences = () => {
    const [addingExp, setAddingExp] = useState(false)
    const {user, setNotification, setRefreshData} = useStateContext()
    const [ validationError, setValidationError ] = useState([])
    const [attachedFile, setAttachedFile] = useState()
    const [ saving, setSaving ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const [resumeData, setResumeData] = useState({
        resume_id: user.resume && user.resume.id
    });

    const companyRef = createRef()
    const positionRef = createRef()
    const descriptionRef = createRef()
    const leaderRef = createRef()
    const whyLeavingRef = createRef()
    const lastSalaryRef = createRef()

    const onFileChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setAttachedFile(reader.result)
        };
        reader.readAsDataURL(file);
    };
    
    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            company: companyRef.current.value,
            position: positionRef.current.value,
            description: descriptionRef.current.value,
            leader: leaderRef.current.value,
            why_leaving: whyLeavingRef.current.value,
            last_salary: lastSalaryRef.current.value,
            date_from: resumeData.date_from ? resumeData.date_from : dateFromRef.current.value,
            date_to: resumeData.date_to ? resumeData.date_to : dateToRef.current.value,
            resume_id: user.resume.id,
            employment_certificate: attachedFile
        }

        axiosClient.post(`/experiences`, payload).then( ({data}) => {
            
            setValidationError(null)
            setRefreshData(Math.random())
            setNotification('Ha sido agregado exitosamente.')
            setAddingExp(false)

        }).catch( err => {
            setLoading(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
                // console.log(response.data.errors);
            }else{
                console.log(response.data);
            }
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


    const deleteExperience = (id) => {
        setSaving(true)

        axiosClient.delete(`/experiences/${id}`).then(({data}) => {
            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Ha sido eliminado satisfactoriamente.')

        }).catch( err => {
            setSaving(false)
            const response = err.response
            console.log(response.data);
        })
    }



    return ( 
        <>
            <div className="block wrapExperiences">
                <h3>Experiencia laboral</h3>

                <div className="content">
                    {user.resume && user.resume.experiences.map( (row, i) => (
                        <div className="item-row row" key={row.id}>
                            <div className="col-1">
                                <span>{i+1}</span>
                                <button className="ctaAction"
                                    onClick={ () => Swal.fire({
                                                title: '¿Está seguro que desea eliminarlo?',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                cancelButtonText: "Cancelar",
                                                confirmButtonText: '¡Si, elimínalo!'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    deleteExperience( row.id );
                                                }
                                            })
                                        }
                                >(-) Eliminar</button>
                            </div>
                            <div className="col-11">
                                <h4>{row.company}</h4>
                                <p>{row.position} | <small>Desde: {row.date_from} - {row.date_to ? 'Hasta: ' + row.date_to : 'actual'} </small></p>
                                <p><strong>Último salario: </strong> {row.currency} {row.last_salary}</p>
                                <p><strong>Se reportaba a: </strong> {row.leader}</p>
                                <br/><p><strong>Descripción de sus funciones: </strong>
                                    {row.description}
                                </p><br/>
                                {row.why_leaving ? 
                                <p><strong>Motivo de salida: </strong>
                                    {row.why_leaving}
                                </p>
                                :null}
                                {row.employment_certificate ? 
                                <p><br/>
                                    <a href={`${import.meta.env.VITE_STATIC_URL}/${row.employment_certificate}`} target="_blank" rel="noreferrer">Ver constancia de salida &rarr;</a>
                                </p>
                                :null}
                            </div>
                        </div>
                    ))}

                    {addingExp ? 

                        <form onSubmit={onSubmit} className="formAddEducation" onChange={()=>setValidationError([])}>
                            <div className="row g-2">
                                <div className="col-12">
                                    <hr/>
                                    <h2>Añadir experiencia</h2>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="text" ref={companyRef} placeholder="Empresa" className="form-control" />
                                        <label htmlFor="company">Empresa { validationError && validationError.company ? <span className="tip-warning">* {validationError.company[0]}</span> : null }</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="text" ref={positionRef} placeholder="Posición desempeñada" className="form-control" />
                                        <label htmlFor="position">Posición desempeñada { validationError && validationError.position ? <span className="tip-warning">* {validationError.position[0]}</span> : null }</label> 
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        {isSafari || isFirefox ?
                                            <>
                                                <InputMask mask="99/9999" ref={dateFromRef} className="form-control" />
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
                                                <InputMask mask="99/9999" ref={dateToRef} className="form-control"
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="date_to">Fecha de salida (dejar vacío si es actual)</label>
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
                                                <label className="lblDatetime" htmlFor="date_to">Fecha de salida (dejar vacío si es actual) { validationError && validationError.date_to ? <span className="tip-warning">* {validationError.date_to[0]}</span> : null }</label>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea ref={descriptionRef} placeholder="Descripción de las funciones" className="form-control"></textarea>
                                        <label htmlFor="description">Descripción de las funciones { validationError && validationError.description ? <span className="tip-warning">* {validationError.description[0]}</span> : null }</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="text" ref={leaderRef}  placeholder="Supervisor inmediato" className="form-control" />
                                        <label htmlFor="leader">Supervisor inmediato { validationError && validationError.leader ? <span className="tip-warning">* {validationError.leader[0]}</span> : null }</label> 
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="text" ref={lastSalaryRef} placeholder="Último salario" className="form-control" />
                                        <label htmlFor="last_salary">Último salario { validationError && validationError.last_salary ? <span className="tip-warning">* {validationError.last_salary[0]}</span> : null }</label> 
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="text" ref={whyLeavingRef} placeholder="Razón de salida (dejar vacío si es actual)" className="form-control" />
                                        <label htmlFor="why_leaving">Razón de salida (dejar vacío si es actual) { validationError && validationError.why_leaving ? <span className="tip-warning">* {validationError.why_leaving[0]}</span> : null }</label> 
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input type="file" name="employment_certificate" className="form-control" onChange={onFileChoose}  />
                                        <label htmlFor="file">Constancia de trabajo { validationError && validationError.employment_certificate ? <span className="tip-warning">* {validationError.employment_certificate[0]}</span> : null }</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <button type="submit" className="btn btn-success btnAddEduc" disabled={saving ? true : ''}>{ saving ? <LoadingOutlined /> : null } Agregar</button>
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-default btnCancelar" onClick={ () => setAddingExp(false) }>Cancelar</button>
                                </div>
                            </div>
                        </form>

                        :
                        <img src={ctaAddIcon} alt="Add" className="ctaAddIcon" 
                            onClick={ () => setAddingExp(true) }
                        />
                    }
                </div>
            
            </div>
        </>
    );
}
 
export default Experiences;