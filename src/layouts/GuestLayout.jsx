import { Navigate, Outlet, useLocation  } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStateContext } from "../contexts/ContextProvider";

const GuestLayout = () => {
    const { token } = useStateContext()
    const location = useLocation()

    if(location.search && token){
        window.location.replace(`${import.meta.env.VITE_APP_URL + location.search.substring(10)}`)
    }
    
    if( token ){
        return <Navigate to="/account" />
    }

    return ( 
        <>
        <Header />
        <Outlet />
        <Footer />
        </>
     );
}
 
export default GuestLayout;