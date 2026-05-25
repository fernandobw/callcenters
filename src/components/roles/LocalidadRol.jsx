import Requests from "../backoffice/Requests";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";

const LocalidadRol = () => {
    const navigate = useNavigate()
    const location = useLocation()

    if(location.pathname === '/account/users'){
        navigate('/account/requests')
    }

    return (
        <>
            <ul className="TabAccount">
                <li>
                    <Link 
                        className={location.pathname === '/account/requests' ? 'active' : ''} 
                        to='/account/requests'
                    >SOLICITUDES</Link>
                </li>
            </ul>

            {location.pathname === '/account/requests' &&
                <Requests userRole={'LOCALIDAD'} />
            }
        </>
    );
}
 
export default LocalidadRol;