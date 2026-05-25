import { CloseCircleFilled, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import LocalityLogo from "../LocalityLogo";

const LocalityForm = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(false)
    const [clientList, setClientList] = useState([])
    const { setNotification, cities, refreshData, setRefreshData } = useStateContext()

    const [currentLocality, setCurrentLocality] = useState({
        id: null,
        name: '',
        client_id: '',
        phone: '',
        rnc: '',
        description: '',
        email: '',
        address: '',
        city: ''
    })

    const refClientName = createRef()
    const refClientRNC = createRef()
    const refDescription = createRef()
    const refTypeClient = createRef()
    const refPhone = createRef()
    const refemail = createRef()
    const refAddress = createRef()
    const refCity = createRef()

    const onSubmit = (ev) => {
		ev.preventDefault()
		setErrors(null)

        // UPDATE
        if(currentLocality.id){

            setSaving(true)

            const payload = {
                ...currentLocality,
                city: refCity.current.value
            }
            delete payload.logo;
            delete payload.client_id;

			axiosClient.put(`/localities/${currentLocality.id}`, payload)
				.then( () => {
                    setSaving(false)
					setNotification("Localidad actualizada satisfactoriamente.")
                    navigate('/account/localities')
				})
				.catch( err => {
                    setSaving(false)
					const response = err.response;
					if( response && response.status === 422){
						setErrors(response.data.errors)
					}else{
						setNotification(response.data.message);
						console.log(response.data);
					}
				})

        // NEW
        }else{ 

            setSaving(true)

            const payload = {
                name: refClientName.current.value,
                client_id: parseInt(refTypeClient.current.value),
                phone: refPhone.current.value,
                rnc: refClientRNC.current.value,
                description: refDescription.current.value,
                email: refemail.current.value,
                address: refAddress.current.value,
                city: parseInt(refCity.current.value)
            }

            axiosClient.post('/localities', payload).then( ({data}) => {
                setSaving(false)
                setNotification('Localidad creada satisfactoriamente.')
                setRefreshData(Math.random())
                navigate(`/account/localities`)
            }).catch( err => {
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
    }


    if( id ){
		useEffect( () => {
			getLocalityDetail()
            getClients()
		}, [refreshData])
	}else{
        useEffect( () => {
			getClients()
		}, [])
    }

    const getClients = () => {
        setLoading(true)
        axiosClient.get(`/clients?nopagination=true`)
            .then( ({data}) => {
                setLoading(false)
                setClientList(data.data)
            })
            .catch( err =>{
                const response = err.response
                setLoading(false)
                console.log(response)
            })
    }

    const getLocalityDetail = () => {
        setLoading(true)

        axiosClient.get(`/localities/${id}`)
            .then( ({data}) => {
                setLoading(false)
                setCurrentLocality(data.data)
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
                <h3>{id ? 'Editar localidad' : 'Nueva localidad'}

                    <Link className="btnAddCTA" to={'/account/localities'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando formulario
                </p>}

                {!loading &&
                <div className="content">
                    {id && <>
                    <br />
                    <div className="float-start" style={{width: '200px'}}>
                        <LocalityLogo theLocality={currentLocality} />
                    </div></>}

                    <form onSubmit={onSubmit} onChange={ ()=>setErrors(null)}>
                        <div className="row g-2 width900">
                            <div className="col-12">
                                {errors && <div className="alert alert-warning">
                                    {Object.keys(errors).map( key => (
                                        <p key={key} className="m-0">{errors[key][0]}</p>
                                    ))}
                                </div>}
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <input type="text" placeholder="Nombre de la localidad" required="required" className="form-control" 
                                        ref={refClientName}
                                        defaultValue={currentLocality.name} 
                                        onChange={ev => setCurrentLocality({...currentLocality, name:ev.target.value})}  
                                    />
                                    <label>Nombre de la localidad <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" placeholder="RNC" required="required" className="mb-0 form-control" 
                                        ref={refClientRNC}
                                        defaultValue={currentLocality.rnc}
                                        onChange={ev => setCurrentLocality({...currentLocality, rnc: ev.target.value})}
                                    />
                                    <label>RNC <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                {id ? 
                                <div className="form-floating">
                                    <select className="mb-0 form-control" disabled
                                        ref={refTypeClient}
                                        value={currentLocality.client?.id}
                                        onChange={ev=>setCurrentLocality({...currentLocality, client_id: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        {clientList && clientList.map( c => (
                                            <option value={c.id} key={c.id}>{c.client_name}</option>
                                        ))}
                                    </select>
                                    <label>Cliente <span className="required">*</span></label>
                                </div>    
                                :
                                <div className="form-floating">
                                    <select className="mb-0 form-control" required="required"
                                        ref={refTypeClient}
                                        defaultValue={currentLocality.client_id}
                                        onChange={ev=>setCurrentLocality({...currentLocality, client_id: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        {clientList && clientList.map( c => (
                                            <option value={c.id} key={c.id}>{c.client_name}</option>
                                        ))}
                                    </select>
                                    <label>Cliente <span className="required">*</span></label>
                                </div>
                                }
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="tel" placeholder="Teléfono" required="required" className="mb-0 form-control" 
                                        ref={refPhone}
                                        defaultValue={currentLocality.phone}
                                        onChange={ev=>setCurrentLocality({...currentLocality, phone: ev.target.value})}
                                    />
                                    <label>Teléfono <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="email" placeholder="Email" required="required" className="mb-0 form-control" 
                                        ref={refemail}
                                        defaultValue={currentLocality.email}
                                        onChange={ev=>setCurrentLocality({...currentLocality, email: ev.target.value})}
                                    />
                                    <label>Email <span className="required">*</span></label>
                                </div> 
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <textarea placeholder="Descripción" className="mb-0 form-control" 
                                        ref={refDescription}
                                        defaultValue={currentLocality.description}
                                        onChange={ev=>setCurrentLocality({...currentLocality, description: ev.target.value})}
                                    ></textarea>
                                    <label>Descripción</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" placeholder="Dirección" required="required" className="form-control" 
                                        ref={refAddress}
                                        defaultValue={currentLocality.address} 
                                        onChange={ev => setCurrentLocality({...currentLocality, address:ev.target.value})}  
                                    />
                                    <label>Dirección <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control" required="required"
                                        ref={refCity}
                                        value={currentLocality.city?.id}
                                        onChange={ev=>setCurrentLocality({...currentLocality, city: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        { cities.length > 0 && cities.map( (c) => (
                                            <option value={c.id} key={c.id}>{c.city}</option>
                                        ))}
                                    </select>
                                    <label>Ciudad <span className="required">*</span></label>
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
                                        <Link to={'/account/localities'} className="btn btn-block btnCancel">&larr; Cancelar</Link>
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
 
export default LocalityForm;