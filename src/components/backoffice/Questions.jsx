import { CloseCircleFilled, LoadingOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";

const Questions = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [errors, setErrors] = useState('')
    const [errorsUpdate, setErrorsUpdate] = useState('')
    const [currentVacant, setCurrentVacant] = useState({})

    const navigate = useNavigate()

    const { setNotification, setRefreshData, refreshData } = useStateContext()

    const refQuestion = createRef()
    const refStatus = createRef()

    useEffect( () => {
        setLoading(true)

        axiosClient.get(`/vacancies/${id}`)
            .then( ({data}) => {
                setLoading(false)
                setCurrentVacant(data.data[0])
            })
            .catch( err =>{
                const response = err.response
                setLoading(false)
                console.log(response)
            })

    }, [refreshData])


    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            question: refQuestion.current.value,
            vacant_id: parseInt(id)
        }

        axiosClient.post(`/questions`, payload).then( ({data}) => {
            setSaving(true)

            setNotification('La pregunta ha sido creada satisfactoriamente')
            setRefreshData(Math.random())

            refQuestion.current.value = '';
            setSaving(false)

        }).catch(err => {
            setSaving(false)
            const response = err.response;
            if( response && response.status === 422){
                setErrors(response.data.errors)
            }else{
                setNotification(response.data.message);
                console.log(response.data);
            }
        })

    }

    const onSubmitUpdate = (ev) => {
        ev.preventDefault();

        setUpdating(true)

        const payload = {
            status: parseInt(refStatus.current.value),
            vacant_id: parseInt(id)
        }

        axiosClient.put(`/vacancies/${currentVacant.id}`, payload)
            .then( () => {
                setUpdating(false)
                setNotification("Vacante actualizada satisfactoriamente.")
                navigate('/account/vacancies')
            })
            .catch( err => {
                setUpdating(false)
                const response = err.response;
                if( response && response.status === 422){
                    setErrorsUpdate(response.data.errors)
                }else{
                    console.log(err);
                }
            })
    }


    const deleteQuestion = (que) => {
        setLoading(true)

        axiosClient.delete(`/questions/${que.id}`).then( ({data})=>{
            
            setLoading(false)
            setNotification('La pregunta fue eliminada satisfactoriamente.')
            setRefreshData(Math.random())

        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }


    return (<>
    
    <section className="wrapContentCV">
        <div className="container">
            <div className="block">
                <h3>NUEVA PREGUNTA: {currentVacant.title}
                    <Link className="btnAddCTA" to={'/account/vacancies'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                <div className="content">
                    <div className="row g-2 p-4 pt-0 pb-0">

                        <form onSubmit={onSubmit} onChange={ ()=>setErrors(null)}>
                            <div className="row g-2">
                                <div className="col-12">
                                    {errors && <div className="alert alert-warning">
                                        {Object.keys(errors).map( key => (
                                            <p key={key} className="m-0">{errors[key][0]}</p>
                                        ))}
                                    </div>}
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-floating">
                                        <input type="text" ref={refQuestion} placeholder="Escriba la pregunta aquí" className="form-control" required="required" />
                                        <label>Escriba la pregunta aquí</label>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <button type="submit" className="btn btn-success btnSaveRecord"
                                                disabled={saving ? true : ''}

                                            >{ saving ? <LoadingOutlined /> : <SaveOutlined /> }  GUARDAR</button>
                                        </div>
                                        <div className="col-6">
                                            <Link to={location.search === '?backto=users' ? '/account/users' : '/account/vacancies'} className="btn btn-block btnCancel">&larr; Cancelar</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>


            {currentVacant?.questions?.length > 0 && !loading &&
            <div className="block">
                <h3>Listado de preguntas <Link className="btnAddCTA" to={'/account/vacancies'}><CloseCircleFilled /> Cerrar</Link></h3>

                {loading && <p className="text-center p-4">
                    <LoadingOutlined /> cargando preguntas
                </p>}

                <div className="content">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <td></td>
                            <td><strong>PREGUNTA</strong></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVacant?.questions.map( (que, i) => (
                            <tr key={que.id}>
                                <td align="center" valign="middle" width={50}>{i+1}</td>
                                <td>{que.question}</td>
                                <td width={70} align="center">
                                    <button 
                                        className="ctaActions ctaDelete"
                                        title="ELIMINAR PREGUNTA"
                                        onClick={ () => Swal.fire({
                                                        title: '¿Deseas eliminar esta pregunta?',
                                                        'icon' : 'warning',
                                                        'showCancelButton': 'true',
                                                        'cancelButtonText' : 'NO',
                                                        'confirmButtonText' : 'SI'
                                                    }).then( (result) => {
                                                        if( result.isConfirmed){
                                                            deleteQuestion(que)
                                                        }
                                                    })
                                                }
                                    ><DeleteOutlined /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>}

            {currentVacant?.questions?.length > 0 && !loading &&
            <div className="block">
                <h3>ACTUALIZAR VACANTE
                    <Link className="btnAddCTA" to={'/account/vacancies'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                <div className="content">
                
                    <form onSubmit={onSubmitUpdate}>
                        <div className="row g-2">
                            <div className="col-12">
                                {errorsUpdate && <div className="alert alert-warning">
                                    {Object.keys(errorsUpdate).map( key => (
                                        <p key={key} className="m-0">{errorsUpdate[key][0]}</p>
                                    ))}
                                </div>}
                            </div>
                            <div className="col-6">
                                <div className="form-floating">
                                    <select ref={refStatus} className="form-control"
                                        defaultValue={currentVacant.status === 'Activa' ? 1 : 0} 
                                        onChange={ev => setCurrentVacant({...currentVacant, status:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="1">Activa</option>
                                        <option value="0">Inactiva</option>
                                    </select>
                                    <label htmlFor="status">Status</label>
                                </div>
                            </div>
                            <div className="col-6">
                                <button type="submit" className="btn btn-success btnSaveRecord p-3"
                                    disabled={updating ? true : ''}
                                >{ updating ? <LoadingOutlined /> : <SaveOutlined /> }  ACTUALIZAR</button>
                            </div>
                        </div>
                    </form>
                
                </div>
            </div>}
        </div>
    </section>

    </>);
}
 
export default Questions;