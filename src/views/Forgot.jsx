import { Link } from 'react-router-dom';
import { SyncOutlined, SafetyOutlined, SendOutlined, WarningOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { createRef, useState } from 'react';
import axiosClient from '../axios-client';

const Forgot = () => {
    const [ error, setError ] = useState('');
    const [ recovering, setRecovering ] = useState(false);
    const [ userFound, setUserFound ] = useState(null);

    const emailRef = createRef()

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            email: emailRef.current.value
        }

        setUserFound(null)
        setRecovering(true)
        setError('')
        axiosClient.post(`/forget-password`, payload).then( ({data}) => {
            setRecovering(false);
            setUserFound(data);

        }).catch( err => {
            setRecovering(false)
            setError(err.response.data.errors.email[0])
        })
    }

    return (
        <section className="wrapLogin wrapForgot animated fadeInDown">
            <div className="container">

                <div className="overview">
                    <h1>Olvidé mi contraseña</h1>
                    <p>Indique el correo electrónico y le enviaremos los pasos para recuperar su contraseña.</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-floating">
                        <input type="email" ref={emailRef} required="required" placeholder="Escriba su email" className="form-control" />
                        <label htmlFor="email">Escriba su email</label>
                    </div>

                    <button type="submit" className="btn btnLogin" disabled={recovering ? true : ''}>
                        { recovering ? <SyncOutlined spin /> : <SafetyOutlined /> } Recuperar contraseña
                    </button>

                    <div className="row">
                        <div className="col-lg-6">
                            <p className="hasAccount">
                                No tienes cuenta, <Link to="/signup">Regístrate</Link>
                            </p>
                        </div>
                        <div className="col-lg-6 text-end">
                            Tienes cuenta, <Link to="/login">Ingresa</Link>
                        </div>
                    </div>

                    {userFound ?
                    <div className="alert alert-info p-3 justify-content-center align-items-center d-flex">
                        <SendOutlined />
                        <h6 className='m-0'>{userFound.message}</h6>
                    </div>
                    :null}

                    {error ?
                    <div className="alert alert-danger p-3 justify-content-center align-items-center d-flex">
                        <WarningOutlined />
                        <h6 className='m-0'>{error}</h6>
                    </div>
                    :null}
                </form>
                
            </div>
        </section>
    );
}
 
export default Forgot;