import { Link, useNavigate } from "react-router-dom";
import logoCallcenters from '../assets/images/call-center-logo.png';
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

import arrdown from '../assets/images/arr-down-w.png';
import noPhoto from '../assets/images/no_photo.png';
import { useEffect } from "react";

const Header = () => {
    const { user, token, refreshData, setUser, setToken } = useStateContext()

    const navigate = useNavigate()

    const onLogout = (env) => {
        env.preventDefault();

        axiosClient.post('/logout').then( () => {
            setUser({})
            setToken(null)
            navigate('/login')

        }).catch( err => {
            const response = err.response
            console.log(response)
        })
    }

    
    if(token){
        useEffect( () => {
            axiosClient.get('/user').then(({data}) => {

                setUser(data[0])
                // console.log(data);

            }).catch( err => {
                const response = err.response
                console.log(response)
            })
        }, [refreshData])
    }


    return (
        <nav className="navbar navbar-expand-lg fixed-top mainNavbar">
            <div className="container-fluid">
                <a className="navbar-brand" href={import.meta.env.VITE_WORDPRESS_URL}>
                    <img src={logoCallcenters} alt="callcenters.com.do" className="mainLogo" />
                </a>
                <button className="navbar-toggler openMenu" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMainMenu" aria-controls="navbarMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="iconbar"></span>
                    <span className="iconbar"></span>
                    <span className="iconbar"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarMainMenu">
                    <ul className="navbar-nav ms-auto MainMenu">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">VACANTES DISPONIBLES</Link>
                        </li>
                        <li className="nav-item">
                            <a href={import.meta.env.VITE_WORDPRESS_URL + '/directorio'} className="nav-link">DIRECTORIO</a>
                        </li>
                        <li className="nav-item">
                            <a href={import.meta.env.VITE_WORDPRESS_URL + '/sobre-nosotros'} className="nav-link">CONTRATAR UN CALL CENTER</a>
                        </li>
                        <li className="nav-item">
                            <a href={import.meta.env.VITE_WORDPRESS_URL + '/noticias'} className="nav-link">NOTICIAS</a>
                        </li>
                        {!token && 
                        <>
                            <li className="nav-item loginMN">
                                <Link to="/login" className="nav-link">INGRESA</Link>
                            </li>
                            <li className="nav-item signupMN">
                                <Link to="/signup" className="nav-link">REGÍSTRATE</Link>
                            </li>
                        </>
                        }

                        {token && 
                        <li className="nav-item mnLoogedIn dropdown">
                            <a href="/#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {user.fname}
                                <img src={arrdown} alt="usr" className="arr-down" />
                                {user.avatar ? 
                                    <img src={import.meta.env.VITE_STATIC_URL + user.avatar} alt={user.fname} width="25" height="25" className="logoLoggedIn rounded-circle" />
                                :
                                    <img src={noPhoto} alt={user.fname} width="25" height="25" className="logoLoggedIn rounded-circle" />
                                }
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {user.role_id === 6 ?
                                <li><Link to="/account/requests" className="nav-link">Mi cuenta</Link></li>
                                :
                                <li><Link to="/account" className="nav-link">Mi cuenta</Link></li>
                                }
                                <li><Link to="/account/profile" className="nav-link">Perfil</Link></li>
                                <li><Link onClick={onLogout} className="nav-link">Logout</Link></li>
                            </ul>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;