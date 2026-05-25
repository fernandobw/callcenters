import { CloseCircleFilled, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

const VacanciesForm = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const [localityList, setLocalityList] = useState([])
    const [ validationError, setValidationError ] = useState({})
    const { setNotification, cities, complements, refreshData, setRefreshData } = useStateContext()

    const [currentVacant, setCurrentVacant] = useState({
        id: null,
        title: '',
        slug: '',
        description: '',
        benefits: '',
        requeriments: '',
        currency: '',
        salary: '',
        showSalary: '',
        confidential: '',
        workday: '',
        contractType: '',
        city: '',
        modality: '',
        featured: '',
        area: '',
        status: '',
        locality_id: '',
        client_id: ''
    })

    const refStatus = createRef()
    const refTitle = createRef()
    const refDescription = createRef()
    const refBenefits = createRef()
    const refRequirements = createRef()
    const refCurrency = createRef()
    const refSalary = createRef()
    const refShowSalary = createRef()
    const refConfidential = createRef()
    const refWorkday = createRef()
    const refContractType = createRef()
    const refCity = createRef()
    const refModality = createRef()
    const refArea = createRef()
    const refLocalityId = createRef()


    const onSubmit = (ev) => {
		ev.preventDefault()
		setValidationError({})

        setTimeout(() => {
            window.scrollTo(0,300);
        }, 500);

        // UPDATE
        if(currentVacant.id){

            setSaving(true)

            const payload = {
                ...currentVacant
            }

			axiosClient.put(`/vacancies/${currentVacant.id}`, payload)
				.then( () => {
                    setSaving(false)
					setNotification("Vacante actualizada satisfactoriamente.")
                    navigate('/account/vacancies')
				})
				.catch( err => {
                    setSaving(false)
					const response = err.response;
					if( response && response.status === 422){
						setValidationError(response.data.errors)
                        console.log(response.data.errors);
					}else{
						setNotification(response.data.message);
						console.log(response.data);
					}
				})

        // NEW
        }else{ 

            setSaving(true)

            const payload = {
                title: refTitle.current.value,
                description: refDescription.current.value,
                benefits: refBenefits.current.value,
                requirements: refRequirements.current.value,
                currency: refCurrency.current.value,
                salary: parseFloat(refSalary.current.value),
                showSalary: parseInt(refShowSalary.current.value),
                confidential: refConfidential.current.value,
                workday: refWorkday.current.value,
                contractType: refContractType.current.value,
                city: refCity.current.value,
                modality: refModality.current.value,
                area: refArea.current.value,
                locality_id: refLocalityId.current.value
            }

            axiosClient.post('/vacancies', payload).then( ({data}) => {

                setSaving(false)
                setNotification('Vacante creada satisfactoriamente.')
                setRefreshData(Math.random())
                navigate(`/account/vacant/${data.id}/questions`)

            }).catch( err => {
                setSaving(false)
                const response = err.response;
                if( response && response.status === 422){
                    setValidationError(response.data.errors);
                }else{
                    setNotification(response.data.message);
                    console.log(response.data);
                }
            })

        }
    }


    if( id ){
		useEffect( () => {
			getVacantDetail()
            getLocalities()
		}, [refreshData])
	}else{
        useEffect( () => {
			getLocalities()
		}, [])
    }

    const getLocalities = () => {
        setLoading(true)
        axiosClient.get(`/localities?nopagination=true`)
            .then( ({data}) => {
                setLoading(false)
                setLocalityList(data.data)
            })
            .catch( err =>{
                const response = err.response
                setLoading(false)
                console.log(response)
            })
    }

    const getVacantDetail = () => {
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
    }


    return (
        <section className="wrapContentCV">
        <div className="container">
            <div className="block">
                <h3>{id ? 'Editar vacante' : 'Nueva vacante'}

                    <Link className="btnAddCTA" to={'/account/vacancies'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando formulario
                </p>}

                {!loading &&
                <div className="content">
                    <form onSubmit={onSubmit} onChange={ () => setValidationError({})}>
                        <div className="row g-2 p-4">
                            {id &&
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refStatus} className="form-control"
                                        defaultValue={currentVacant.status === 'Activa' ? 1 : 0} 
                                        onChange={ev => setCurrentVacant({...currentVacant, status:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="1">Activa</option>
                                        <option value="0">Inactiva</option>
                                    </select>
                                    <label htmlFor="status">Status <span className="required">*</span> { validationError.status ? <span className="tip-warning">{validationError.status[0]}</span> : null }</label>
                                </div>
                            </div>}
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <input type="text" placeholder="Titulo de la vacante" className="form-control" 
                                        ref={refTitle}
                                        defaultValue={currentVacant.title} 
                                        onChange={ev => setCurrentVacant({...currentVacant, title:ev.target.value})}  
                                    />
                                    <label htmlFor="title">Título de la vacante <span className="required">*</span> { validationError.title ? <span className="tip-warning">{validationError.title[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <textarea placeholder="Descripción" className="mb-0 form-control" 
                                        ref={refDescription}
                                        defaultValue={currentVacant.description} 
                                        onChange={ev => setCurrentVacant({...currentVacant, description:ev.target.value})}  
                                    ></textarea>
                                    <label htmlFor="description">Descripción de la posición <span className="required">*</span> { validationError.description ? <span className="tip-warning">{validationError.description[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <textarea placeholder="Beneficios" className="mb-0 form-control" 
                                        ref={refBenefits}
                                        defaultValue={currentVacant.benefits} 
                                        onChange={ev => setCurrentVacant({...currentVacant, benefits:ev.target.value})}  
                                    ></textarea>
                                    <label htmlFor="benefits">Beneficios de la posición (cada beneficio en una nueva línea) <span className="required">*</span> { validationError.benefits ? <span className="tip-warning">{validationError.benefits[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <textarea placeholder="Requerimientos" className="mb-0 form-control" 
                                        ref={refRequirements}
                                        defaultValue={currentVacant.requirements} 
                                        onChange={ev => setCurrentVacant({...currentVacant, requirements:ev.target.value})}  
                                    ></textarea>
                                    <label htmlFor="requirements">Requerientos y requisitos (cada requisito en una nueva línea) <span className="required">*</span> { validationError.requirements ? <span className="tip-warning">{validationError.requirements[0]}</span> : null }</label>
                                </div>
                            </div>
                            {!id &&
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refLocalityId} className="form-control"
                                        defaultValue={currentVacant.locality?.id} 
                                        onChange={ev => setCurrentVacant({...currentVacant, locality_id:ev.target.value})}  
                                    >
                                        <option value="">Seleccione</option>
                                        {localityList.map( loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="locality_id">Localidad <span className="required">*</span> { validationError.locality_id ? <span className="tip-warning">{validationError.locality_id[0]}</span> : null }</label>
                                </div>
                            </div>
                            }
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refCity} className="form-control"
                                        defaultValue={currentVacant.city} 
                                        onChange={ev => setCurrentVacant({...currentVacant, city:ev.target.value})}  
                                    >
                                        <option value="">Seleccione</option>
                                        {cities.length > 0 && cities.map( cit => (
                                            <option key={cit.id} value={cit.city}>{cit.city}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="city">Ciudad <span className="required">*</span> { validationError.city ? <span className="tip-warning">{validationError.city[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refWorkday} className="form-control"
                                        defaultValue={currentVacant.workday} 
                                        onChange={ev => setCurrentVacant({...currentVacant, workday:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        {complements.length > 0 && complements.filter(it => (it.type === 'workday')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="workday">Jornada <span className="required">*</span> { validationError.workday ? <span className="tip-warning">{validationError.workday[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refContractType} className="form-control"
                                        defaultValue={currentVacant.contractType} 
                                        onChange={ev => setCurrentVacant({...currentVacant, contractType:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        {complements.length > 0 && complements.filter(it => (it.type === 'contractType')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="contractType">Tipo de contrato <span className="required">*</span> { validationError.contractType ? <span className="tip-warning">{validationError.contractType[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select ref={refCurrency} className="form-control"
                                        defaultValue={currentVacant.currency} 
                                        onChange={ev => setCurrentVacant({...currentVacant, currency:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="RD$">RD$</option>
                                        <option value="US$">US$</option>
                                    </select>
                                    <label htmlFor="currency">Moneda <span className="required">*</span> { validationError.currency ? <span className="tip-warning">{validationError.currency[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <input type="text" ref={refSalary} autoComplete="off" placeholder="Sueldo" className="form-control"
                                        defaultValue={currentVacant.salary} 
                                        onChange={ev => setCurrentVacant({...currentVacant, salary:ev.target.value})}
                                    />
                                    <label htmlFor="salary">Sueldo { validationError.salary ? <span className="tip-warning">{validationError.salary[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select className="form-control" ref={refShowSalary}
                                        defaultValue={currentVacant.showSalary} 
                                        onChange={ev => setCurrentVacant({...currentVacant, showSalary:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label htmlFor="showSalary">Mostrar salario <span className="required">*</span> { validationError.showSalary ? <span className="tip-warning">{validationError.showSalary[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select className="form-control" ref={refConfidential}
                                        defaultValue={currentVacant.confidential} 
                                        onChange={ev => setCurrentVacant({...currentVacant, confidential:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label htmlFor="confidential">Empresa confidencial <span className="required">*</span> { validationError.confidential ? <span className="tip-warning">{validationError.confidential[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select className="form-control" ref={refModality}
                                        defaultValue={currentVacant.modality} 
                                        onChange={ev => setCurrentVacant({...currentVacant, modality:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        {complements.length > 0 && complements.filter(it => (it.type === 'modality')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="modality">Modalidad <span className="required">*</span> { validationError.modality ? <span className="tip-warning">{validationError.modality[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-6">
                                <div className="form-floating">
                                    <select className="form-control" ref={refArea}
                                        defaultValue={currentVacant.area} 
                                        onChange={ev => setCurrentVacant({...currentVacant, area:ev.target.value})}
                                    >
                                        <option value="">Seleccione</option>
                                        {complements.length > 0 && complements.filter(it => (it.type === 'area')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="area">Área de la vacante <span className="required">*</span> { validationError.area ? <span className="tip-warning">{validationError.area[0]}</span> : null }</label>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <button type="submit" className="btn btn-success btnSaveRecord"
                                            disabled={saving ? true : ''}

                                        >{ saving ? <LoadingOutlined /> : <SaveOutlined /> }  CONTINUAR</button>
                                    </div>
                                    <div className="col-6">
                                        <Link to={'/account/vacancies'} className="btn btn-block btnCancel">&larr; Cancelar</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <br /><br />
                </div>
                }
            </div>
        </div>
        </section>
    );
}
 
export default VacanciesForm;