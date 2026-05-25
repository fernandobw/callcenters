import { Link, useNavigate, useParams } from 'react-router-dom';
import { SyncOutlined, SafetyOutlined, SendOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { createRef, useState } from 'react';
import axiosClient from '../axios-client';

const ResetPassword = () => {
    const [ validationError, setValidationError ] = useState('');
    const [ recovering, setRecovering ] = useState(false);
	const { token } = useParams()
    const [showPass, setShowPass ] = useState(false)
    const [showPassConfirm, setShowPassConfirm ] = useState(false)
    const [mssg, setMssg] = useState('');

    const emailRef = createRef()
    const passwordRef = createRef()
    const passwordConfirm = createRef()

    const navigate = useNavigate()

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            token: token,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirm.current.value
        }

        setValidationError('')
        setRecovering(true)
        axiosClient.post(`/reset-password`, payload).then( ({data}) => {
            
            setRecovering(false)
            
            if(data.code === 401){
                // console.log(data)
                setMssg(data.message);
            }

            if(data.code === 200){
                setMssg(data.message);

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }

        }).catch( err => {
            setRecovering(false)
            setValidationError(err.response.data.errors)
            // console.log(err.response.data.errors)
        })
    }

    return (
        <section className="wrapLogin wrapForgot animated fadeInDown">
            <div className="container">

                <div className="overview">
                    <h1>Agregar nueva contraseña</h1>
                    <p>Indique el correo electrónico y la nueva contraseña</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-floating">
                        <input type="email" ref={emailRef} required="required" placeholder="Escriba su email" className="form-control" />
                        <label htmlFor="email">Escriba su email <span className="requeridField">*</span> { validationError.email ? <span className="tip-warning">{validationError.email[0]}</span> : null }</label>
                    </div>

                    <div className="row g-2 mt-1">
                        <div className="col-12">
                            <div className="form-floating">
                                {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                                <input type={showPass ? 'text' : 'password' } ref={passwordConfirm} className="form-control" placeholder="Nueva contraseña" />
                                <label htmlFor="lname">Nueva contraseña <span className="requeridField">*</span> { validationError.password ? <span className="tip-warning">{validationError.password[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                {showPassConfirm ? <EyeOutlined onClick={()=>setShowPassConfirm(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPassConfirm(true)} /> }
                                <input type={showPassConfirm ? 'text' : 'password' } ref={passwordRef} className="form-control" placeholder="Confirmar Contraseña" />
                                <label htmlFor="fname">Confirmar Contraseña <span className="requeridField">*</span></label>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btnLogin" disabled={recovering ? true : ''}>
                        { recovering ? <SyncOutlined spin /> : <SafetyOutlined /> } Guardar contraseña
                    </button>

                    <div className="row">
                        <div className="col-lg-12 text-end">
                            Volver a, <Link to="/login">Ingresar</Link>
                        </div>
                    </div>

                    {recovering ? 
                        <SyncOutlined spin />
                    :null}

                    {mssg ?
                        <div className="alert alert-info p-3 mt-3 justify-content-center align-items-center d-flex">
                            <SendOutlined />
                            <h6 className='m-0'>{mssg}</h6>
                        </div>
                    :null}

                </form>
                
            </div>
        </section>
    );
}
 
export default ResetPassword;