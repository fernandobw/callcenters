import { Link, useLocation } from "react-router-dom";
import Users from "../backoffice/Users";
import Clients from "../backoffice/Clients";
import Localities from "../backoffice/Localities";
import Vacancies from "../backoffice/Vacancies";
import Requests from "../backoffice/Requests";

const SuperAdminRol = () => {
    const location = useLocation()

    return (
        <>
            <ul className="TabAccount">
                <li>
                    <Link 
                        className={location.pathname === '/account/users' ? 'active' : ''} 
                        to='/account/users'
                    >USUARIOS</Link>
                </li>
                <li>
                    <Link 
                        className={location.pathname === '/account/postulants' ? 'active' : ''} 
                        to='/account/postulants'
                    >POSTULANTES</Link>
                </li>
                <li>
                    <Link 
                        className={location.pathname === '/account/clients' ? 'active' : ''} 
                        to='/account/clients'
                    >CLIENTES</Link>
                </li>
                <li>
                    <Link 
                        className={location.pathname === '/account/localities' ? 'active' : ''} 
                        to='/account/localities'
                    >CALLCENTERS</Link>
                </li>
                <li>
                    <Link 
                        className={location.pathname === '/account/vacancies' ? 'active' : ''} 
                        to='/account/vacancies'
                    >VACANTES</Link>
                </li>
                <li>
                    <Link 
                        className={location.pathname === '/account/requests' ? 'active' : ''} 
                        to='/account/requests'
                    >SOLICITUDES</Link>
                </li>
            </ul>

            {location.pathname === '/account/users' &&
                <Users theKey="users" userRole={'ADMIN'} />
            }

            {location.pathname === '/account/postulants' &&
                <Users theKey="postulants" />
            }

            {location.pathname === '/account/clients' &&
                <Clients />
            }

            {location.pathname === '/account/localities' &&
                <Localities userRole={'ADMIN'} />
            }

            {location.pathname === '/account/vacancies' &&
                <Vacancies userRole={'ADMIN'} />
            }

            {location.pathname === '/account/requests' &&
                <Requests userRole={'ADMIN'} />
            }
        </>
    );
}
 
export default SuperAdminRol;