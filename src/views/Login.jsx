import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

const Login = () => {
    const [showPass, setShowPass ] = useState(false)
    const [message, setMessage] = useState(null)
    const emailRef = createRef()
    const passwordRef = createRef()
    const { setUser, setToken } = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        setMessage(null)
        
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch((err) => {
                const response = err.response
                if( response && response.status === 422){
                    setMessage(response.data.message)
                }
            })
    }

    return ( 
        <div className="wrapLogin animated fadeInDown">
            <div className="container">
                <div className="inner">
                <div className="overview">
                    <h1>Iniciar sesión</h1>
                </div>

                {message && 
                <div className="alert alert-warning text-center">
                    {message}
                </div>}

                <form onSubmit={onSubmit}>
                    <div className="form-floating">
                        <input ref={emailRef} type="email" placeholder="Escriba su email" className="form-control" />
                        <label htmlFor="email">Escriba su email</label>
                    </div>

                    <div className="form-floating">
                        {showPass ? <EyeOutlined onClick={()=>setShowPass(false)} /> : <EyeInvisibleOutlined onClick={()=>setShowPass(true)} /> }
                        <input ref={passwordRef} type={showPass ? 'text' : 'password' } placeholder="Escriba su password" className="form-control" />
                        <label htmlFor="password">Contraseña</label>
                    </div>
                    <button className="btn btnLogin">Iniciar sesión</button>

                    <div className="row">
                        <div className="col-lg-6">
                            <p className="hasAccount">
                                No tienes cuenta, <Link to="/signup">Regístrate</Link>
                            </p>
                        </div>
                        <div className="col-lg-6 text-end">
                            <Link to="/forgot">Recuperar mi contraseña</Link>
                        </div>
                    </div>
                    
                </form>
                </div>
            </div>
        </div>
     );
}
 
export default Login;