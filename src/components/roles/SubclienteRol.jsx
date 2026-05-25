import { useState } from "react";
import {Link} from "react-router-dom";
import Users from "../backoffice/Users";
import Localities from "../backoffice/Localities";
import Vacancies from "../backoffice/Vacancies";
import Requests from "../backoffice/Requests";
import Clients from "../backoffice/Clients";

const SubclienteRol = () => {
    const [tabToWatch, setTabToWatch] = useState('users')

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
                <Users theKey="users" userRole={'SUBCLIENTE'} />
            }

            {location.pathname === '/account/clients' &&
                <Clients theKey="clients" userRole={'SUBCLIENTE'} />
            }

            {location.pathname === '/account/localities' &&
                <Localities userRole={'SUBCLIENTE'} />
            }

            {location.pathname === '/account/vacancies' &&
                <Vacancies userRole={'SUBCLIENTE'} />
            }

            {location.pathname === '/account/requests' &&
                <Requests userRole={'SUBCLIENTE'} />
            }
        </>
    );
}
 
export default SubclienteRol;