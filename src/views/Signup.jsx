import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loading3QuartersOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

const Signup = () => {
    const [loading, setLoading] = useState(false)
    const [validationError, setValidationError] = useState({})
    const [showPass, setShowPass] = useState(false)

    const {setUser, setToken} = useStateContext()

    const fnameRef = createRef()
    const lnameRef = createRef()
    const phoneRef = createRef()
    const emailRef = createRef()
    const passwordRef = createRef()

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            fname: fnameRef.current.value,
            lname: lnameRef.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        setLoading(true)
        axiosClient.post('/signup', payload).then( ({data}) => {
            setLoading(false)
            setUser(data.user)
            setToken(data.token)

        }).catch( err => {
            setLoading(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(response.data);
            }
        })

    }

    return ( 
        <div className="wrapSignup animated fadeInDown">
            <div className="container">
                <h1>Registrarse</h1>

                <form onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-floating">
                                <input ref={fnameRef} type="text" required="required" placeholder="Nombre" className="form-control"
                                />
                                <label htmlFor="fname">Nombre { validationError.fname ? <span className="tip-warning">* {validationError.fname[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-floating">
                                <input ref={lnameRef} type="text" required="required" placeholder="Apellidos" className="form-control"
                                />
                                <label htmlFor="lname">Apellidos { validationError.lname ? <span className="tip-warning">* {validationError.lname[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <input ref={emailRef} type="email" required="required" placeholder="Escriba su email" className="form-control"
                                />
                                <label htmlFor="email">Escriba su email { validationError.email ? <span className="tip-warning">* {validationError.email[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-floating">
                                <input ref={phoneRef} type="tel" required="required" maxLength={10} placeholder="Escriba su teléfono" className="form-control"
                                />
                                <label htmlFor="phone">Escriba su teléfono { validationError.phone ? <span className="tip-warning">* {validationError.phone[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-floating">
                                {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                                <input ref={passwordRef} type={showPass ? 'text' : 'password' }  placeholder="Escriba su password" className="form-control"
                                />
                                <label htmlFor="password">Contraseña { validationError.password ? <span className="tip-warning">* {validationError.password[0]}</span> : null }</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <input type="checkbox" id="accept" required="required" name="accept" value="1" />
                            <label htmlFor="accept" className="lblAccept">
                                He leído y acepto las condiciones de envío de mi información.
                                { validationError.accept ? <span className="tip-warning">* {validationError.accept[0]}</span> : null }
                            </label>
                        </div>
                    </div>
                    
                    <input type="submit" value="REGISTRARSE" className="btn btnLogin" />
                </form>

                { loading ? <Loading3QuartersOutlined spin className="d-block mx-auto" /> : null}

                <p className="hasAccount">
                    Tienes cuenta, <Link to="/login">Ingresa</Link>
                </p>
            </div>
        </div>
    );
}
 
export default Signup;