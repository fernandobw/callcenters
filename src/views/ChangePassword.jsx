import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { createRef, useState } from "react";
// import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";


const ChangePassword = () => {
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(false)
    const [showActualPass, setShowActualPass ] = useState(false)
    const [showPass, setShowPass ] = useState(false)
    const [message, setMessage] = useState('');

    const [newPass, setNewPass] = useState(false);

    // const { user } = useStateContext();

    const passwordRef = createRef()
    const passwordConfirmRef = createRef()


    const onSubmit = (e) => {
        e.preventDefault();

        setLoading(true)
        setMessage('')

        const payload = {
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmRef.current.value,
        }


        axiosClient.put(`/change-password`, payload).then( ({data}) => {

            setLoading(false)
            setMessage(data.message)

        }).catch( err => {
            setLoading(false)
            setValidationError(err.response.data.errors)
            // console.log(err.response.data.errors);
        })

    }

    return ( 
        <div className="block">
            <h3>Cambiar contraseña</h3>
            <div className="content">
                {newPass ? 
                <form onSubmit={onSubmit} onChange={()=>setValidationError(null)}>
                    <div className="row g-2 mt-1" style={{maxWidth: '450px'}}>
                        {validationError && 
                            <div className='alert alert-warning text-center'>
                                {Object.keys(validationError).map( key => (
                                    <p key={key} className='p-0 m-0'>
                                        {validationError[key][0]}
                                    </p>
                                ))}
                            </div>
                        } 
                        {message && 
                            <div className='alert alert-info text-center'>
                                <p className='p-0 m-0'>
                                    {message}
                                </p>
                            </div>
                        } 
                        
                        <div className="col-12">
                            <div className="form-floating">
                                {showActualPass ? <EyeOutlined onClick={()=>setShowActualPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowActualPass(true)} /> }
                                <input type={showActualPass ? 'text' : 'password' } ref={passwordRef} className="form-control" placeholder="Nueva contraseña" />
                                <label htmlFor="fname">Nueva contraseña <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                                <input type={showPass ? 'text' : 'password' } ref={passwordConfirmRef} className="form-control" placeholder="Confirmar contraseña" />
                                <label htmlFor="lname">Confirmar contraseña <span className="requeridField">*</span></label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success" disabled={loading ? true : ''}>{ loading ? <LoadingOutlined /> : null } Cambiar contraseña</button>
                    <button onClick={()=>setNewPass(false)} className="btnCancelarCambio">Cancelar</button>
                </form>
                : 
                    <button onClick={()=>setNewPass(true)} className="btnSetNewPass">Establecer nueva contraseña</button>
                }
            </div>
        </div>
    );
}
 
export default ChangePassword;