import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const PrintLayout = () => {
    const { token } = useStateContext();

    if( !token ){
        return <Navigate to={`/login?redirect=`+ location.pathname} />
    }

    return (
        <Outlet />
    );
}
 
export default PrintLayout;