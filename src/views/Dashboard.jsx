import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import PostulanteRol from "../components/roles/PostulanteRol";

const Dashboard = () => {
    const { user } = useStateContext()

    return (<>
    
        {user.role_id === 7 &&
            <PostulanteRol />
        }


        {user.role_id < 7 &&
            <div className="row g-2">
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/users'
                    >USUARIOS</Link>
                </div>
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/postulants'
                    >POSTULANTES</Link>
                </div>
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/clients'
                    >CLIENTES</Link>
                </div>
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/localities'
                    >LOCALIDADES</Link>
                </div>
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/vacancies'
                    >VACANTES</Link>
                </div>
                <div className="col-4 p-4 text-center" style={{border: '1px solid #333'}}>
                    <Link to='/account/requests'
                    >SOLICITUDES</Link>
                </div>
            </div> 
        }
        
    </>);
}
 
export default Dashboard;