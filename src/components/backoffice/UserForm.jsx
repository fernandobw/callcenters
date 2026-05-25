import { CloseCircleFilled, SaveOutlined, LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import Avatar from "../Avatar";

const UserForm = () => {
    const [showPass, setShowPass ] = useState(false)
    const [showPassConfirm, setShowPassConfirm ] = useState(false)

    const {id} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(false)
    const { setNotification, refreshData, setRefreshData, user } = useStateContext()

    const [currentUser, setCurrentUser] = useState({
        id: null,
        fname: '',
        lname: '',
        phone: '',
        email: '',
        can_apply: '',
        role_id: '',
        client_id: ''
    })

    const refPassword = createRef()
    const refPasswordConfirm = createRef()

    const onSubmit = (ev) => {
		ev.preventDefault()
		setErrors(null)

        // UPDATE
        if(currentUser.id){

            setSaving(true)

            const payload = {
                ...currentUser
            }
            delete payload.avatar;
            delete payload.email;

			axiosClient.put(`/users/${currentUser.id}`, payload)
				.then( () => {
                    setSaving(false)
					setNotification("El usuario fue actualizado satisfactoriamente.")
                    location.search === '?backto=users' ? navigate('/account/users') : navigate('/account/postulants')
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
                ...currentUser,
                password: refPassword.current.value,
                password_confirmation: refPasswordConfirm.current.value,
                client_id: user.role_id === 1 ? '' : user.client.id,
                can_apply: 0
            }

            axiosClient.post(`/users`, payload).then( () => {
                setSaving(false)
                
                setNotification("El usuario ha sido agregado exitosamente.")

                setRefreshData(Math.random())
                location.search === '?backto=users' ? navigate('/account/users') : navigate('/account/postulants')
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

        }
    }


    if( id ){

		useEffect( () => {
			setLoading(true)

			axiosClient.get(`/users/${id}`)
				.then( ({data})=> {
					setLoading(false)
					setCurrentUser(data[0])
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
                {id && 
                <h3>Editar usuario <Link className="btnAddCTA" to={location.search === '?backto=users' ? '/account/users' : '/account/postulants'}><CloseCircleFilled /> Cerrar</Link></h3>}

                {!id && 
                <h3>Nuevo usuario <Link className="btnAddCTA" to={location.search === '?backto=users' ? '/account/users' : '/account/postulants'}><CloseCircleFilled /> Cerrar</Link></h3>}

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando datos
                </p>}

                {!loading &&
                <div className="content">
                    {id && <><br />
                        <div className="float-start" style={{width: '200px'}}>
                            <Avatar theUser={currentUser} />
                        </div>
                    </>}

                    <form onSubmit={onSubmit} onChange={ ()=>setErrors(null)}>
                        <div className="row g-2 width900">
                            <div className="col-12">
                                {errors && <div className="alert alert-warning">
                                    {Object.keys(errors).map( key => (
                                        <p key={key} className="m-0">{errors[key][0]}</p>
                                    ))}
                                </div>}
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" placeholder="Nombre" className="form-control" 
                                        defaultValue={currentUser.fname} 
                                        onChange={ev => setCurrentUser({...currentUser, fname:ev.target.value})}  
                                    />
                                    <label>Nombre <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" placeholder="Apellidos" className="mb-0 form-control" 
                                        defaultValue={currentUser.lname}
                                        onChange={ev => setCurrentUser({...currentUser, lname: ev.target.value})}
                                    />
                                    <label>Apellidos <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="text" placeholder="Teléfono"  className="mb-0 form-control" 
                                        defaultValue={currentUser.phone}
                                        onChange={ev=>setCurrentUser({...currentUser, phone: ev.target.value})}
                                    />
                                    <label>Teléfono <span className="required">*</span></label>
                                </div>
                            </div>
                            {id && currentUser.role_id === 7 ?
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control"
                                        value={currentUser.can_apply}
                                        onChange={ev=>setCurrentUser({...currentUser, can_apply: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        <option value="1">Si</option>
                                        <option value="0">No</option>
                                    </select>
                                    <label>Puede aplicar</label>
                                </div>
                            </div>
                            :
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control" disabled={true}
                                        value={currentUser.can_apply}
                                    >
                                        <option value="">-Seleccione-</option>
                                    </select>
                                    <label>Puede aplicar</label>
                                </div>
                            </div>
                            }

                            {id ? 
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control" 
                                        disabled={true}
                                        defaultValue={currentUser.role_id}
                                        onChange={ev=>setCurrentUser({...currentUser, role_id: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        {user.role_id === 1 && <option value="1">ADMIN</option>}
                                        <option value="2">CLIENTE</option>
                                        <option value="3">CONSULTOR</option>
                                        <option value="4">SOPORTE</option>
                                        <option value="5">SUBCLIENTE</option>
                                        <option value="6">GERENTE / LOCALIDAD</option>
                                        <option value="7">POSTULANTE</option>
                                    </select>
                                    <label>Rol del usuario</label>
                                </div>
                            </div>
                            :
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select className="mb-0 form-control" 
                                        defaultValue={currentUser.role_id}
                                        onChange={ev=>setCurrentUser({...currentUser, role_id: ev.target.value})}
                                    >
                                        <option value="">-Seleccione-</option>
                                        {user.role_id === 1 && <option value="1">ADMIN</option>}
                                        {user.role_id === 2 || user.role_id === 3 ? <option value="4">SOPORTE</option> : null}
                                    </select>
                                    <label>Rol del usuario</label>
                                </div>
                            </div>
                            }

                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input type="email" placeholder="Email" readOnly={id ? true : false} className="mb-0 form-control" 
                                        defaultValue={currentUser.email}
                                        onChange={ev=>setCurrentUser({...currentUser, email: ev.target.value})}
                                    />
                                    <label>Email <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                                    <input type={showPass ? 'text' : 'password' } ref={refPassword} placeholder="Contraseña" className="mb-0 form-control" />
                                    <label>Contraseña <span className="required">*</span></label>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    {showPassConfirm ? <EyeOutlined onClick={()=>setShowPassConfirm(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPassConfirm(true)} /> }
                                    <input type={showPassConfirm ? 'text' : 'password' } ref={refPasswordConfirm}  placeholder="Confirmar contraseña" className="mb-0 form-control" />
                                    <label>Confirmar contraseña <span className="required">*</span></label>
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
                                        <Link to={location.search === '?backto=users' ? '/account/users' : '/account/postulants'} className="btn btn-block btnCancel">&larr; Cancelar</Link>
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
 
export default UserForm;