import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SecureLayout = () => {
    const { token, setUser } = useStateContext();
    const location = useLocation()

    if( !token ){
        return <Navigate to={`/login?redirect=`+ location.pathname} />
    }

    useEffect( () => {
        axiosClient.get('/user')
            .then(({data}) => {
                setUser(data)
            })
    }, [])

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
 
export default SecureLayout;