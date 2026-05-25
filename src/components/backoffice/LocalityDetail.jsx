import { CloseCircleFilled, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

const LocalityDetail = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [currentLocality, setCurrentLocality] = useState({})

    useEffect( () => {
        setLoading(true)

        axiosClient.get(`/localities/${id}`)
            .then( ({data}) => {
                setLoading(false)
                setCurrentLocality(data.data)
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
                <h3>{currentLocality.name}
                    <Link className="btnAddCTA" to={'/account/localities'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando datos
                </p>}

                {!loading &&
                    <div className="content">
                        {currentLocality.logo && <>
                        <br />
                        <div className="float-start" style={{width: '200px'}}>
                            <img src={`${import.meta.env.VITE_STATIC_URL}${currentLocality.logo}`} alt="" className="img-fluid" />
                        </div></>}

                        <div className="row width900">
                            <h3 style={{paddingLeft: '0', border: 'none'}}><strong>DATOS DE LA LOCALIDAD</strong></h3>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td align="right" width={150}><strong>Nombre</strong></td>
                                        <td>{currentLocality.name}</td>
                                        <td align="right" width={100}><strong>RNC</strong></td>
                                        <td>{currentLocality.rnc}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Teléfono</strong></td>
                                        <td>{currentLocality.phone}</td>
                                        <td align="right"><strong>Email</strong></td>
                                        <td>{currentLocality.email}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Dirección</strong></td>
                                        <td>{currentLocality.address}</td>
                                        <td align="right"><strong>Ciudad</strong></td>
                                        <td>{currentLocality.city?.city}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Miembro desde</strong></td>
                                        <td>{currentLocality.member_since}</td>
                                        <td align="right"><strong>Cliente</strong></td>
                                        <td>{currentLocality.client?.client_name}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={150}><strong>Descripción</strong></td>
                                        <td colSpan={3}>{currentLocality.description}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {currentLocality?.gerente?.length > 0 && currentLocality?.gerente.map( (ge) => ( <div key={1}>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>GERENTE DE LA LOCALIDAD</strong></h3>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td align="right" width={150}><strong>Nombre</strong></td>
                                            <td>{ge.fname}</td>
                                            <td align="right" width={100}><strong>Apellido</strong></td>
                                            <td>{ge.lname}</td>
                                        </tr>
                                        <tr>
                                            <td align="right" width={150}><strong>Teléfono</strong></td>
                                            <td>{ge.phone}</td>
                                            <td align="right"><strong>Email</strong></td>
                                            <td>{ge.email}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>))}

                            {currentLocality?.vacancies?.length > 0 && currentLocality?.vacancies && <>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>VACANTES</strong></h3>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <td><strong>PUESTO</strong></td>
                                            <td><strong>MODALIDAD</strong></td>
                                            <td><strong>CONTRATO</strong></td>
                                            <td><strong>CIUDAD</strong></td>
                                            <td><strong>STATUS</strong></td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentLocality?.vacancies.map( (vac) => (
                                            <tr key={vac.id}>
                                                <td>{vac.title}</td>
                                                <td className="text-center">{vac.modality}</td>
                                                <td className="text-center">{vac.contractType}</td>
                                                <td>{vac.city}</td>
                                                <td className="text-center">{vac.status===1 ? 'Activo' : 'Inactivo'}</td>
                                                <td align="center" valign="middle">
                                                    <Link title="VER VACANTE" className="ctaActions" target="_blank"
                                                        to={`${import.meta.env.VITE_APP_URL}/vacante/${vac.id}/${vac.slug}`}
                                                    ><EyeOutlined /></Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            

                            </>}
                        </div>
                    </div>
                }

            </div>
        </div>
    </section>

    </>);
}
 
export default LocalityDetail;