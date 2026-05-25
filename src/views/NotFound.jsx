import { Link } from 'react-router-dom';
import logoCallcenters from '../assets/images/call-center-logo.png';

const NotFound = () => {
    return (
        <div className="notFoundPage">
            <div>
                <img src={logoCallcenters} alt="Callcenters.com.do" className='enteCallcenters' />
                <h1>Error 404 <br /> Página no encontrada</h1>
                <Link to="./">&larr; IR A LA PORTADA</Link>
            </div>
        </div>
    );
}
 
export default NotFound;