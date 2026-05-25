import { Link, useLocation, useParams } from "react-router-dom";
import noPhoto from '../assets/images/no_photo.png';
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import NotFound from "./NotFound";
import { CloseCircleFilled, FileTextOutlined, DownloadOutlined } from "@ant-design/icons";

const ResumePrint = () => {
    const [loading, setLoading] = useState(false)
    const [resume, setResume] = useState({})

    const {id} = useParams();
    const location = useLocation();
    const querystring = new URLSearchParams(location.search);
    
    useEffect( () => {
        setLoading(true)

        axiosClient.get(`/users/${id}`)
            .then( ({data})=> {
                setLoading(false)
                setResume(data[0])
            })
            .catch( err =>{
                const response = err.response
                setLoading(false)
                console.log(response)
            })

    }, [])
    

    if(!resume){
        return <NotFound />
    }


    return (
        <section className="wrapCVSection">
            <div className="container innerCVSection">
                { querystring.get('returnto') && querystring.get('returnto') !== 'close' && <Link to={`/account/${querystring.get('returnto')}/${querystring.get('id')}`} className="closeEditSection"><CloseCircleFilled /></Link>}
                { !querystring.get('returnto') && <Link to="/account/postulants" className="closeEditSection"><CloseCircleFilled /></Link>}

                <div className="row headerCV">
                    <div className="col-lg-2">
                        { resume.avatar ? 
                            <img src={import.meta.env.VITE_STATIC_URL + resume.avatar} alt={resume.fname} className="img-fluid logoLoggedIn rounded" />
                        :
                            <img src={noPhoto} alt={resume.fname} className="img-fluid logoLoggedIn rounded" />
                        }
                    </div>
                    <div className="col-lg-7 my-auto">
                        <div className="userInfo">
                            <h2>
                                {resume.resume?.fname} {resume.resume?.lname}
                                <small>{resume.resume?.occupation }</small>
                            </h2>

                            {resume.resume?.abilities.map( (row, i) => (
                                <span key={row.id}>
                                    {row.ability}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="block aboutMe">
                    <h3>Presentación</h3>
                    <div className="content">
                        <div contentEditable='false' dangerouslySetInnerHTML={{ __html: resume.resume?.presentation }}></div>
                    </div>
                </div>

                <div className="block">
                    <h3>Información personal</h3>
                    <div className="content">
                        
                        <div className="row">
                            <div className="col-lg-6">

                                <table className="table">
                                    <tbody>
                                        {resume.resume?.city && 
                                        <tr>
                                            <td>Ciudad:</td>
                                            <td>{resume.resume?.city.city}</td>
                                        </tr>
                                        }
                                        <tr>
                                            <td>Género:</td>
                                            <td>{resume.resume?.gender}</td>
                                        </tr>
                                        <tr>
                                            <td>Hijos:</td>
                                            <td>{resume.resume?.kids}</td>
                                        </tr>
                                        <tr>
                                            <td>Edad:</td>
                                            <td>{resume.resume?.age }</td>
                                        </tr>
                                        <tr>
                                            <td>Cédula:</td>
                                            <td>{resume.resume?.cedula_or_passport}</td>
                                        </tr>
                                        <tr>
                                            <td>Teléfono:</td>
                                            <td>{resume.resume?.phone}</td>
                                        </tr>
                                        <tr>
                                            <td>Celular:</td>
                                            <td>{resume.resume?.cellphone}</td>
                                        </tr>
                                        <tr>
                                            <td>Email:</td>
                                            <td>{resume.resume?.public_email}</td>
                                        </tr>
                                        {resume.resume?.address &&
                                        <tr>
                                            <td>Dirección:</td>
                                            <td>{resume.resume?.address}</td>
                                        </tr>
                                        }
                                    </tbody>
                                </table>
                                
                            </div>
                            <div className="col-lg-6">

                                <table className="table">
                                    <tbody>
                                        {resume.resume?.city ? 
                                        <tr>
                                            <td>Ciudad:</td>
                                            <td>{resume.resume?.city.city}</td>
                                        </tr>
                                        : null }
                                        <tr>
                                            <td>Estado civil:</td>
                                            <td>{resume.resume?.civil_status}</td>
                                        </tr>
                                        <tr>
                                            <td>Fecha de nacimiento:</td>
                                            <td>{resume.resume?.birthday}</td>
                                        </tr>
                                        <tr>
                                            <td>¿Disponibilidad para viajar?</td>
                                            <td>
                                                {resume.resume?.availability_to_travel  === 1 ? 'SI' : null }
                                                {resume.resume?.availability_to_travel  === 0 ? 'NO' : null }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>¿Licencia de conducir?</td>
                                            <td>
                                                {resume.resume?.drivers_license  === 1 ? 'SI' : null }
                                                {resume.resume?.drivers_license  === 0 ? 'NO' : null }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>¿Vehículo propio?</td>
                                            <td>
                                                {resume.resume?.has_car  === 1 ? 'SI' : null }
                                                {resume.resume?.has_car  === 0 ? 'NO' : null }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Salario:</td>
                                            <td>{resume.resume?.currency} {resume.resume?.salary}</td>
                                        </tr>
                                        <tr>
                                            <td>Expectativa salarial:</td>
                                            <td>{resume.resume?.currency} {resume.resume?.salary_expectation }</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="block">
                                    <h3>Idiomas</h3>
                                    <table className="table">
                                        <tbody>
                                            {resume.resume?.languages.map( (row, i) => (
                                                <tr key={row.id}>
                                                    <td>{row.language}</td>
                                                    <td>{row.level}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="block">
                                    <h3>Softwares</h3>
                                    <table className="table">
                                        <tbody>
                                            {resume.resume?.softwares.map( (row, i) => (
                                                <tr key={row.id}>
                                                    <td>{row.software}</td>
                                                    <td>{row.level}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div className="block">
                    <h3>Educación</h3>
                    <div className="content">
                        {resume.resume?.last_grade && <>
                            <strong>Último grado cursado: </strong><br/> {resume.resume?.last_grade}
                            <hr/></>
                        }

                        {resume.resume?.educations.map( (row, i) => ( 
                            <div className="item-row d-flex" key={row.id}>
                                <span className="p-2">{i+1}</span>
                                <div className="p-2">
                                    <h4>{row.institution} <small>{'Desde: ' +row.date_from + ' - hasta: ' + row.date_to}</small></h4>
                                    <p>{row.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <h3>Otros estudios</h3>
                    <div className="content">
                        {resume.resume?.othereducations.map( (row, i) => (
                            <div className="item-row d-flex" key={row.id}>
                                <span className="p-2">{i+1}</span>
                                <div className="p-2">
                                    <h4>{row.obtained_title} <small>{'Desde: ' +row.date_from + ' - hasta: ' + row.date_to}</small></h4>
                                    <p>{row.institution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <h3>Experiencia laboral</h3>
                    <div className="content">
                        {resume.resume?.experiences.map( (row, i) => (
                            <div className="item-row row" key={row.id}>
                                <div className="col-1">
                                    <span>{i+1}</span>
                                </div>
                                <div className="col-11">
                                    <h4>{row.company}</h4>
                                    <p>{row.position} | <small>Desde: {row.date_from} - {row.date_to ? 'Hasta: ' + row.date_to : 'actual'} </small></p>
                                    <p><strong>Último salario: </strong> {row.currency} {row.salary}</p>
                                    <p><strong>Se reportaba a: </strong> {row.lider}</p>
                                    <br/><p><strong>Descripción de sus funciones: </strong>
                                        {row.description}
                                    </p><br/>

                                    {row.why_leaving ? 
                                        <p><strong>Motivo de salida: </strong>
                                            {row.why_leaving}
                                        </p>
                                    :null}

                                    {row.employment_certificate ? 
                                        <p><br/>
                                            <a href={`${import.meta.env.VITE_STATIC_URL}/${row.employment_certificate}`} target="_blank" rel="noreferrer">Constancia de salida &darr;</a>
                                        </p>
                                    :null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="block">
                    <h3>Documentos</h3>
                    <div className="content">
                        {resume.resume?.certifications.map( (row, i) => (
                            <div className="item-row d-flex" key={row.id}>
                                <a href={`${import.meta.env.VITE_STATIC_URL}${row.file}`} target="_blank" rel="noreferrer"><DownloadOutlined className="p-2" /></a>
                                <div className="p-2">
                                    <h4><a href={`${import.meta.env.VITE_STATIC_URL}${row.file}`} target="_blank" rel="noreferrer">{row.doc_type +': ' + row.title}</a></h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
 
export default ResumePrint;