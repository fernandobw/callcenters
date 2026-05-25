import { CloseCircleFilled, SaveOutlined, LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import ClientLogo from "../ClientLogo";

const ClientForm = () => {
    const [showPass, setShowPass ] = useState(false)
    const [showPassConfirm, setShowPassConfirm ] = useState(false)

    const {id} = useParams()
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(false)
    const { setNotification, cities, refreshData, user, setRefreshData } = useStateContext()

    const [currentClient, setCurrentClient] = useState({
        id: null,
        client_name: '',
        type_client: '',
        phone: '',
        client_rnc: '',
        description: '',
        cellphone: '',
        address: '',
        city: ''
    })

    const refClientName = createRef()
    const refClientRNC = createRef()
    const refDescription = createRef()
    const refTypeClient = createRef()
    const refPhone = createRef()
    const refCellphone = createRef()
    const refAddress = createRef()
    const refCity = createRef()
    // username
    const refFName = createRef()
    const refLName = createRef()
    const refEmail = createRef()
    const refPassword = createRef()
    const refPasswordConfirmation = createRef()


    const onSubmit = (ev) => {
		ev.preventDefault()
		setErrors(null)

        // UPDATE
        if(currentClient.id){

            setSaving(true)

            const payload = {
                ...currentClient,
                city: refCity.current.value
            }
            delete payload.logo;
            delete payload.type_client;

			axiosClient.put(`/clients/${currentClient.id}`, payload)
				.then( () => {
                    setSaving(false)
					setNotification("Cliente actualizado satisfactoriamente.")
                    navigate('/account/clients')
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
                client_name: refClientName.current.value,
                type_client: refTypeClient.current.value,
                phone: refPhone.current.value,
                client_rnc: refClientRNC.current.value,
                description: refDescription.current.value,
                cellphone: refCellphone.current.value,
                address: refAddress.current.value,
                city: parseInt(refCity.current.value),
                fname: user.role_id > 1 ? false : refFName.current.value,
                lname: user.role_id > 1 ? false : refLName.current.value,
                email: user.role_id > 1 ? 'not@email.com' : refEmail.current.value,
                password: user.role_id > 1 ? 'Password@1234' : refPassword.current.value,
                password_confirmation: user.role_id > 1 ? 'Password@1234' : refPasswordConfirmation.current.value
            }

            setSaving(false)

            axiosClient.post('/clients', payload).then( ({data}) => {
                setSaving(false)
                setNotification('Cliente creado satisfactoriamente.')
                setRefreshData(Math.random())
                navigate(`/account/clients`)
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
			setLoading(true)

			axiosClient.get(`/clients/${id}`)
				.then( ({data}) => {
					setLoading(false)
					setCurrentClient(data.data)
				})
				.catch( err =>{
					const response = err.response
					setLoading(false)
					console.log(response)
				})

		}, [refreshData])
	}


    return (
        <section className="wrapContentCV">
        <div className="container">
            <div className="block">
                <h3>{id ? 'Editar cliente' : 'Nuevo cliente'}

                    <Link className="btnAddCTA" to={'/account/clients'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando datos
                </p>}

                {!loading &&
                <div className="content">
                    {id && <>
                    <br />
                    <div className="float-start" style={{width: '200px'}}>
                        <ClientLogo theClient={currentClient} />
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
                                    <input type="text" required="required" placeholder="Nombre del cliente" className="form-control" 
                                        ref={refClientName}
                                        defaultValue={currentClient.client_name} 
                                        onChange={ev => setCurrentClient({...currentClient, client_name:ev.target.value})}  
                                    />
                                    <label>Nombre del cliente <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" required="required" placeholder="RNC" className="mb-0 form-control" 
                                        ref={refClientRNC}
                                        defaultValue={currentClient.client_rnc}
                                        onChange={ev => setCurrentClient({...currentClient, client_rnc: ev.target.value})}
                                    />
                                    <label>RNC <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                {id ? 
                                <div className="form-floating">
                                    <select className="mb-0 form-control" disabled
                                        ref={refTypeClient}
                                        defaultValue={currentClient.type_client}
                                        onChange={ev=>setCurrentClient({...currentClient, type_client: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        <option value="CLIENTE">CLIENTE</option>
                                        <option value="CONSULTOR">CONSULTOR</option>
                                        <option value="SUBCLIENTE">SUBCLIENTE</option>
                                    </select>
                                    <label>Tipo de cliente</label>
                                </div>    
                                :
                                <div className="form-floating">
                                    <select className="mb-0 form-control" required="required"
                                        ref={refTypeClient}
                                        defaultValue={currentClient.type_client}
                                        onChange={ev=>setCurrentClient({...currentClient, type_client: ev.target.value})}
                                    >
                                        {user.role_id === 3 || user.role_id === 5 ? 
                                            <option value="SUBCLIENTE">SUBCLIENTE</option>
                                        :
                                            <>
                                                <option value="CLIENTE">CLIENTE</option>
                                                <option value="CONSULTOR">CONSULTOR</option>
                                            </>
                                        }
                                    </select>
                                    <label>Tipo de cliente <span className="required">*</span></label>
                                </div>
                                }
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="tel" required="required" placeholder="Teléfono" className="mb-0 form-control" 
                                        ref={refPhone}
                                        defaultValue={currentClient.phone}
                                        onChange={ev=>setCurrentClient({...currentClient, phone: ev.target.value})}
                                    />
                                    <label>Teléfono <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="tel" placeholder="Teléfono 2" className="mb-0 form-control" 
                                        ref={refCellphone}
                                        defaultValue={currentClient.cellphone}
                                        onChange={ev=>setCurrentClient({...currentClient, cellphone: ev.target.value})}
                                    />
                                    <label>Teléfono 2</label>
                                </div> 
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <textarea placeholder="Descripción" className="mb-0 form-control" 
                                        ref={refDescription}
                                        defaultValue={currentClient.description}
                                        onChange={ev=>setCurrentClient({...currentClient, description: ev.target.value})}
                                    ></textarea>
                                    <label>Descripción</label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" required="required" placeholder="Dirección" className="form-control" 
                                        ref={refAddress}
                                        defaultValue={currentClient.address} 
                                        onChange={ev => setCurrentClient({...currentClient, address:ev.target.value})}  
                                    />
                                    <label>Dirección <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control" 
                                        ref={refCity}
                                        value={currentClient.city?.id}
                                        onChange={ev=>setCurrentClient({...currentClient, city: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        { cities.length > 0 && cities.map( (c) => (
                                            <option value={c.id} key={c.id}>{c.city}</option>
                                        ))}
                                    </select>
                                    <label>Ciudad <span className="required">*</span></label>
                                </div>
                            </div>

                            {!id && user.role_id === 1 && <>
                            <div className="col-lg-12"><br/><strong>DATOS DEL USUARIO</strong><hr /></div>

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" required="required" placeholder="Nombre de usuario" className="form-control" 
                                        ref={refFName}
                                        defaultValue={currentClient.fname} 
                                        onChange={ev => setCurrentClient({...currentClient, fname:ev.target.value})}  
                                    />
                                    <label>Nombre de usuario <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" required="required" placeholder="Apellido de usuario" className="form-control" 
                                        ref={refLName}
                                        defaultValue={currentClient.lname} 
                                        onChange={ev => setCurrentClient({...currentClient, lname:ev.target.value})}  
                                    />
                                    <label>Apellido de usuario <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-floating">
                                    <input type="text" required="required" placeholder="Email" className="form-control" 
                                        ref={refEmail}
                                        defaultValue={currentClient.email} 
                                        onChange={ev => setCurrentClient({...currentClient, email:ev.target.value})}  
                                    />
                                    <label>Email <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                                    <input type={showPass ? 'text' : 'password' } required="required" placeholder="Password" className="form-control" 
                                        ref={refPassword}
                                        defaultValue={currentClient.password} 
                                        onChange={ev => setCurrentClient({...currentClient, password:ev.target.value})}  
                                    />
                                    <label>Password <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    {showPassConfirm ? <EyeOutlined onClick={()=>setShowPassConfirm(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPassConfirm(true)} /> }
                                    <input type={showPassConfirm ? 'text' : 'password' } required="required" placeholder="Confirmar Password" className="form-control" 
                                        ref={refPasswordConfirmation}
                                        defaultValue={currentClient.password_confirmation} 
                                        onChange={ev => setCurrentClient({...currentClient, password_confirmation:ev.target.value})}  
                                    />
                                    <label>Confirmar Password <span className="required">*</span></label>
                                </div>
                            </div>
                            </>}
                        
                            <div className="col-lg-12">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <button type="submit" className="btn btn-success btnSaveRecord"
                                            disabled={saving ? true : ''}

                                        >{ saving ? <LoadingOutlined /> : <SaveOutlined /> }  GUARDAR</button>
                                    </div>
                                    <div className="col-6">
                                        <Link to={'/account/clients'} className="btn btn-block btnCancel">&larr; Cancelar</Link>
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
 
export default ClientForm;