import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { IssuesCloseOutlined } from '@ant-design/icons';
// import Abilities from "../components/resumes/Abilities";
import Avatar from "../components/Avatar";

const AccountLayout = () => {
    const { token, user, notification, setComplements, setCities } = useStateContext()
    // const [progressProfile, setProgressProfile] = useState(28)

    if( !token ){
        return <Navigate to="/login" />
    }

    useEffect( () => {
        axiosClient.get('/complements').then( ({data}) => {
            setComplements(data.data);
        })
        .catch( err => {
            console.log(err.response)
        })

        axiosClient.get('/cities').then( ({data}) => {
            setCities(data.data);
        })
        .catch( err => {
            console.log(err.response)
        })
        
    }, [])
    

    return (
        <>
            <Header />

            <header className="headerAccount">
                <div className="container">

                    <div className="row">
                        <div className="col-lg-2">
                            <Avatar theUser={user} />
                        </div>
                        <div className="col-lg-7 my-auto">

                            <div className="userInfo">
                                <h2>{ user.resume && user.resume?.fname ?
                                        <>
                                            {user.resume.fname} {user.resume.lname}
                                            <small>{user.resume && user.resume.occupation }</small>
                                        </>
                                    :`${user.fname} ${user.lname}`}
                                </h2>
                            </div>

                        </div>
                        {/* {user.role_id === 7 &&
                        <div className="col-lg-3 my-auto">
                            <small>Progreso del perfil</small>

                            <div className="progress" role="progressbar" aria-label="Progreso del perfil" aria-valuenow={progressProfile} aria-valuemin={0} aria-valuemax={100}><div className="progress-bar bg-info" style={{width: `${progressProfile}%`}}>{progressProfile > 99 ? 'Completado' : progressProfile + '%'}</div></div>

                        </div>} */}
                    </div>

                </div>
            </header>
            
            <section className="wrapContentCV">
                <div className="container">

                <Outlet />
                    
                </div>
            </section>


            <Footer />

            {notification &&
            <div className="notification">
                <IssuesCloseOutlined /> {notification}
            </div>
            }

        </>
    );
}
 
export default AccountLayout;