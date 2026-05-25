import { CloseCircleFilled, FileTextOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

const VacanciesDetail = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [currentVacant, setCurrentVacant] = useState({})

    useEffect( () => {
        setLoading(true)

        axiosClient.get(`/vacancies/${id}`)
            .then( ({data}) => {
                setLoading(false)
                setCurrentVacant(data.data[0])
            })
            .catch( err =>{
                const response = err.response
                setLoading(false)
                console.log(response)
            })

    }, [])


    return (<>
    
    <section className="wrapContentCV">
        <div className="container">
            <div className="block">
                <h3>{currentVacant.title}
                    <Link className="btnAddCTA" to={'/account/vacancies'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando datos
                </p>}

                {!loading &&
                    <div className="content">
                        <div className="row g-2 p-4 pt-0 pb-0">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td align="right" width={150}><strong>Vacante</strong></td>
                                        <td>{currentVacant.title}</td>
                                        <td align="right" width={100}><strong>Localidad</strong></td>
                                        <td>{currentVacant.locality && currentVacant.locality.name} / {currentVacant.locality?.client.client_name}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Ciudad</strong></td>
                                        <td>{currentVacant.city}</td>
                                        <td align="right"><strong>Área</strong></td>
                                        <td>{currentVacant.area}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Modalidad</strong></td>
                                        <td>{currentVacant.modality}</td>
                                        <td align="right"><strong>Jornada</strong></td>
                                        <td>{currentVacant.workday}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Publicada en</strong></td>
                                        <td>{currentVacant.created_at}</td>
                                        <td align="right"><strong>Contrato</strong></td>
                                        <td>{currentVacant.contractType}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Estado</strong></td>
                                        <td>{currentVacant.status}</td>
                                        <td align="right"><strong>Confidencial</strong></td>
                                        <td>{currentVacant.confidential === 1 ? 'Si' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Mostrar salario</strong></td>
                                        <td>{currentVacant.showSalary === 1 ? 'Si' : 'No'}</td>
                                        <td align="right"><strong>Salario</strong></td>
                                        <td>{currentVacant.currency} {currentVacant.salary}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Descripción</strong></td>
                                        <td colSpan={3}>{currentVacant.description}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Requisitos</strong></td>
                                        <td colSpan={3}>{currentVacant.requirements}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Beneficios</strong></td>
                                        <td colSpan={3}>{currentVacant.benefits}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {currentVacant?.questions?.length > 0 && <>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>PREGUNTAS</strong></h3>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td><strong>PREGUNTA</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVacant?.questions.map( (que, i) => (
                                            <tr key={que.id}>
                                                <td align="center">{i+1}</td>
                                                <td>{que.question}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            
                            </>}


                            {/* {currentVacant?.applications?.length > 0 && <>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>SOLICITUDES</strong></h3>

                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <td width={50}></td>
                                            <td><strong>POSTULANTE</strong></td>
                                            <td><strong>TELÉFONO</strong></td>
                                            <td><strong>EMAIL</strong></td>
                                            <td width={220} align="center"><strong>STATUS</strong></td>
                                            <td width={120} align="center"><strong>FECHA</strong></td>
                                            <td width={70}></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentVacant?.applications.map( (appli, i) => (
                                            <tr key={i}>
                                                <td align="right">{i+1}</td>
                                                <td>{appli?.user?.fname} {appli?.user?.lname}</td>
                                                <td>{appli?.user?.phone}</td>
                                                <td>{appli?.user?.email}</td>
                                                <td align="center">{appli.status?.status ? 
                                                    <span style={{color: appli.status.color}}>
                                                        {appli.status.status}
                                                    </span>
                                                    : '-' }</td>
                                                <td align="center">{appli.created_at}</td>
                                                <td align="center" valign="middle">
                                                    <Link className="ctaActions" title="VER CV" style={{ marginRight: "5px" }}
                                                        to={`/account/user/${appli?.user?.id}/resume?returnto=vacant&id=${currentVacant.id}`}
                                                    ><FileTextOutlined /> </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            
                            </>} */}

                        </div>
                    </div>
                }

            </div>
        </div>
    </section>

    </>);
}
 
export default VacanciesDetail;