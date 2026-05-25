import { SaveOutlined, LoadingOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { createRef, useRef, useState } from "react"
import axiosClient from "../../axios-client"
import { useStateContext } from "../../contexts/ContextProvider"

const GerenteLocalidadForm = ({currentLocality}) => {
    const [showPass, setShowPass ] = useState(false)
    const [showPassConfirm, setShowPassConfirm ] = useState(false)

    const [errors, setErrors] = useState()
    const [saving, setSaving] = useState(false)

    const {setNotification, setRefreshData} = useStateContext()

    const refCloseGerenteModal = useRef()
    const refFName = createRef()
    const refLName = createRef()
    const refPhone = createRef()
    const refEmail = createRef()
    const refPassword = createRef()
    const refConfirmPassword = createRef()

    const onSubmit = (ev) => {
		ev.preventDefault()
		setErrors(null)

        setSaving(true)

        const payload = {
            fname: refFName.current.value,
            lname: refLName.current.value,
            email: refEmail.current.value,
            phone: refPhone.current.value,
            password: refPassword.current.value,
            password_confirmation: refConfirmPassword.current.value,
            locality_id: currentLocality.id,
            client_id: currentLocality.client.id,
            role_id: 6
        }

        axiosClient.post(`/users`, payload).then( () => {
            setSaving(false)
            setNotification("El USUARIO GERENTE fue agregado exitosamente.")
            refCloseGerenteModal.current.click();
            setRefreshData(Math.random())
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


    return (<>
    
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="gerenteModalLabel">
                <strong>USUARIO GERENTE</strong>
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={refCloseGerenteModal} />
        </div>
        <div className="modal-body">
            
            <form onSubmit={onSubmit} onChange={ ()=>setErrors(null)} className="p-2">
                <div className="row g-2">
                    <div className="col-lg-12">
                        <div className="form-floating">
                            <input ref={refFName} type="text" required="required" placeholder="Nombre" className="form-control" />
                            <label>Nombre <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-floating">
                            <input ref={refLName} type="text" required="required" placeholder="Apellidos" className="mb-0 form-control" />
                            <label>Apellidos <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-floating">
                            <input ref={refPhone} type="text" required="required" placeholder="Teléfono" className="mb-0 form-control" />
                            <label>Teléfono <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-floating">
                            <input ref={refEmail} type="email" required="required" placeholder="Email" className="mb-0 form-control" />
                            <label>Email <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-floating">
                            {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                            <input ref={refPassword} type={showPass ? 'text' : 'password' } required="required" placeholder="Contraseña" className="mb-0 form-control" />
                            <label>Contraseña <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form-floating">
                            {showPassConfirm ? <EyeOutlined onClick={()=>setShowPassConfirm(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPassConfirm(true)} /> }
                            <input ref={refConfirmPassword} type={showPassConfirm ? 'text' : 'password' } required="required" placeholder="Confirmar contraseña" className="mb-0 form-control" />
                            <label>Confirmar contraseña <span className="required">*</span></label>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <button type="submit" className="btn btn-success btnSaveRecord"
                            disabled={saving ? true : ''}

                        >{ saving ? <LoadingOutlined /> : <SaveOutlined /> }  GUARDAR</button>
                    </div>
                    <div className="col-12">
                        {errors && <div className="alert alert-warning">
                            {Object.keys(errors).map( key => (
                                <p key={key} className="m-0">{errors[key][0]}</p>
                            ))}
                        </div>}
                    </div>
                </div>
            </form>
            <br/>
        </div>
    </>);
}
 
export default GerenteLocalidadForm;