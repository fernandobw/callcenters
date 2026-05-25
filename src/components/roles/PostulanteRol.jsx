import { useState } from "react"
import { useStateContext } from "../../contexts/ContextProvider"

import AboutMe from "../resumes/AboutMe"
import Educations from "../resumes/Educations"
import InfoGeneral from "../resumes/InfoGeneral"
import Experiences from "../resumes/Experiences"
import Documents from "../resumes/Documents"
import InfoProfessional from "../resumes/InfoProfessional"
import Languages from "../resumes/Languages"
import Softwares from "../resumes/Softwares"
import MyAppliedJobs from "../MyAppliedJobs"

const PostulanteRol = () => {
    const { user } = useStateContext()
    const [tabToWatch, setTabToWatch] = useState('cv')

    return (<>
    
        {user.role_id === 7 &&
            <ul className="TabAccount">
                <li><button className={tabToWatch === 'cv' ? 'active' : ''} style={{paddingLeft: 0}}
                    onClick={ () => setTabToWatch('cv') }>MI CURRÍCULUM</button></li>
                <li><button className={tabToWatch === 'applied' ? 'active' : ''}
                    onClick={ () => setTabToWatch('applied') }
                    >PUESTOS APLICADOS</button></li>
            </ul>
        }
        
        {tabToWatch === 'cv' && user.role_id === 7 &&
            <div className="row">
                <div className="col-lg-8">

                {user.role_id === 7 &&
                <><small className="requeridField">* Todo lo marcado con * es requerido para crear el perfil.</small>
                <br/><br/></>}

                    <>
                        <AboutMe />
                        <Educations />
                        <Experiences />
                        <Documents />
                    </>
                    
                </div>
                <div className="col-lg-4 sidebar">
                    <div className="sticky-top">
                        <InfoGeneral />
                        <InfoProfessional />
                        <Languages />
                        <Softwares />
                    </div>
                </div>
            </div>
        }

        {tabToWatch === 'applied' && user.role_id === 7 &&
            <div className="animated fadeInDown">
                <MyAppliedJobs />
            </div>
        }

    </>);
}
 
export default PostulanteRol;