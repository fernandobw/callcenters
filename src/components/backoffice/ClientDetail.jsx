import { CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import noPhoto from '../../assets/images/no_photo.png';

const ClientDetail = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [currentClient, setCurrentClient] = useState({})

    useEffect( () => {
        setLoading(true)

        axiosClient.get(`/clients/${id}`)
            .then( ({data}) => {
                setLoading(false)
                setCurrentClient(data.data)
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
                <h3>{currentClient.client_name}
                    <Link className="btnAddCTA" to={'/account/clients'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loading && <p className="text-center">
                    <LoadingOutlined /> cargando datos
                </p>}

                {!loading &&
                    <div className="content">
                        {currentClient.logo && <>
                        <br />
                        <div className="float-start" style={{width: '200px'}}>
                            <img src={`${import.meta.env.VITE_STATIC_URL}${currentClient.logo}`} alt="" className="img-fluid" />
                        </div></>}

                        <div className="row width900">
                            <h3 style={{paddingLeft: '0', border: 'none'}}><strong>DATOS DEL CLIENTE</strong></h3>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td align="right" width={170}><strong>Nombre del cliente</strong></td>
                                        <td>{currentClient.client_name}</td>
                                        <td align="right" width={120}><strong>RNC</strong></td>
                                        <td>{currentClient.client_rnc}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={170}><strong>Teléfono</strong></td>
                                        <td>{currentClient.phone}</td>
                                        <td align="right"><strong>Teléfono 2</strong></td>
                                        <td>{currentClient.cellphone}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={170}><strong>Dirección</strong></td>
                                        <td>{currentClient.address}</td>
                                        <td align="right"><strong>Ciudad</strong></td>
                                        <td>{currentClient.city?.city}</td>
                                    </tr>
                                    <tr>
                                        <td align="right" width={170}><strong>Tipo de cliente</strong></td>
                                        <td>{currentClient.type_client}</td>
                                        <td align="right" width={170}><strong>Miembro desde</strong></td>
                                        <td>{currentClient.member_since}</td>
                                    </tr>
                                    {currentClient?.type_client === 'SUBCLIENTE' &&
                                    <tr>
                                        <td align="right"><strong>Cliente principal</strong></td>
                                        <td>{currentClient?.main_client.client_name}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>}
                                    <tr>
                                        <td align="right" width={170}><strong>Descripción</strong></td>
                                        <td colSpan={3}>{currentClient.description}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {currentClient?.localities?.length > 0 && currentClient?.localities && <>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>LOCALIDADES</strong></h3>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td><strong>LOCALIDAD</strong></td>
                                            <td><strong>RNC</strong></td>
                                            <td><strong>TELÉFONO</strong></td>
                                            <td><strong>CIUDAD</strong></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentClient?.localities.map( (loc) => (
                                            <tr key={loc.id}>
                                                <td width={75} align="center">
                                                    {loc.logo ? 
                                                        <img src={`${import.meta.env.VITE_STATIC_URL}${loc.logo}`} alt={loc.name} className="img-fluid" width={70} />
                                                    :
                                                        <img src={noPhoto} alt="avatar" width="50" />
                                                    }
                                                </td>
                                                <td valign="middle">{loc.name}</td>
                                                <td valign="middle">{loc.rnc}</td>
                                                <td valign="middle">{loc.phone}</td>
                                                <td valign="middle">{loc.city?.city}</td>
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
 
export default ClientDetail;