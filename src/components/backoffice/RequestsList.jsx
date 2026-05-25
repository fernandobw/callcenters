import { CloseCircleFilled, FileTextOutlined, LoadingOutlined, PaperClipOutlined, SafetyOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { createRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import noPhoto from '../../assets/images/no_photo.png';
import { useStateContext } from "../../contexts/ContextProvider";
import { useRef } from "react";
import Attachments from "./Attachments";
import RequestDetail from "./RequestDetail";

const RequestsLists = () => {
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [changingStatus, setChangingStatus ] = useState(false)
    const [currentVacant, setCurrentVacant] = useState({})
    const [statuses, setStatuses] = useState({})
    const [statusToFilter, setStatusToFilter ] = useState(false)
    const [profileToView, setProfileToView] = useState({})

    const { setNotification, setRefreshData, refreshData, user } = useStateContext()

    const refCloseStatusModal = useRef()
    const refStatus = createRef()

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

    }, [refreshData])



    useEffect( () => {
        setLoadingStatus(true)

        axiosClient.get(`/status`)
        .then( ({data}) => {
            setLoadingStatus(false)
            setStatuses(data.data)
        })
        .catch( err =>{
            const response = err.response
            setLoadingStatus(false)
            console.log(response)
        })            

    }, [])


    const applications = statusToFilter ? 
          currentVacant?.applications?.filter( sta => ( sta.statusid === statusToFilter ) )
        : currentVacant?.applications;



    const onSubmitStatus = (ev) => {
        ev.preventDefault()

        const payload = {
            status: refStatus.current.value,
            application_id: profileToView.id
        }

        setLoading(true)
        axiosClient.put(`/apply/${profileToView.id}`, payload).then( ({data}) => {
            setLoading(false)
            setNotification('El postulante fue movido de status')
            setRefreshData(Math.random())
            // cerrar el modal
            refCloseStatusModal.current.click();

        }).catch( err => {
            setLoading(false)
            console.log(err);
        })

    }

    return (<>    
    <section className="wrapContentCV">
        <div className="container">
            <div className="block">
                <h3 className="mb-0">{currentVacant.title} <small>| {currentVacant.locality?.name}</small>
                    <Link className="btnAddCTA" to={'/account/requests'}><CloseCircleFilled /> Cerrar</Link>
                </h3>

                {loadingStatus && <p className="text-center"><LoadingOutlined /> cargando status</p>}
                {!loadingStatus &&
                <div className="wrapFilterApplied d-flex flex-wrap">
                    <button
                        style={{ borderBottom: '2px solid #A59393' }}
                        className="flex-fill"
                        onClick={ () => setStatusToFilter(false) }
                    >Todos ({currentVacant?.applications?.length})</button>

                    {statuses.length > 0 && statuses.map( (itm) => (
                        <button key={itm.id} className="flex-fill" style={{ borderBottom: '2px solid ' + itm.color }}
                                onClick={ () => setStatusToFilter(itm.id) }
                            >
                            {itm.status} ({currentVacant?.applications?.filter( st => (st.statusid === itm.id) ).length})
                        </button>
                    ))}
                </div>
                }


                {loading && <p className="text-center"><LoadingOutlined /> cargando datos</p>}
                {!loading &&
                    <div className="content">
                        <div className="row g-2 p-4 pt-0 pb-0">

                            {applications?.length === 0 && <p className="text-center">No hay postulantes con este status</p>}

                            {applications?.length > 0 && <>
                                <h3 style={{paddingLeft: '0', border: 'none'}}><strong>SOLICITUDES</strong></h3>

                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <td width={50} colSpan={2}></td>
                                            <td><strong>POSTULANTE</strong></td>
                                            <td width={130}><strong>TELÉFONO</strong></td>
                                            <td width={150}><strong>EMAIL</strong></td>
                                            <td width={200} align="center"><strong>STATUS</strong></td>
                                            <td width={130} align="center"><strong>FECHA</strong></td>
                                            {user.role_id != 6 &&<td width={100}></td>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map( (appli, i) => (
                                            <tr key={i}>
                                                <td align="center" valign="middle" width={40}>{i+1}</td>
                                                <td width={60}>
                                                    {appli.avatar ? 
                                                        <img src={import.meta.env.VITE_STATIC_URL + appli.avatar } alt="avatar" width="50" />
                                                    :
                                                        <img src={noPhoto} alt="avatar" width="50" />
                                                    }
                                                </td>
                                                <td valign="middle">{appli?.user?.fname} {appli?.user?.lname}</td>
                                                <td valign="middle">{appli?.user?.phone}</td>
                                                <td valign="middle">{appli?.user?.email}</td>
                                                <td valign="middle" align="center">{appli.status?.status ? 
                                                    <span style={{color: appli.status.color}}>
                                                        {appli.status.status}
                                                    </span>
                                                    : '-' }</td>
                                                <td valign="middle" align="center">{appli.created_at}</td>
                                                {user.role_id != 6 &&
                                                <td align="right" valign="middle">
                                                    <Link className="ctaActions" title="AGREGAR ANEXOS" style={{ marginRight: "5px" }}
                                                        data-bs-toggle="modal" data-bs-target="#anexoModal"
                                                        onClick={()=>setProfileToView(appli)}
                                                    ><PaperClipOutlined /></Link>

                                                    <Link className="ctaActions" title="CAMBIAR ESTADO" style={{ marginRight: "5px" }}
                                                        data-bs-toggle="modal" data-bs-target="#statusModal"
                                                        onClick={()=>setProfileToView(appli)}
                                                    ><UserSwitchOutlined /></Link>

                                                    <Link className="ctaActions" title="VER REQUEST" style={{ marginRight: "5px" }}
                                                        data-bs-toggle="modal" data-bs-target="#profileModal"
                                                        onClick={()=>setProfileToView(appli)}
                                                    ><FileTextOutlined /></Link>
                                                </td>
                                                }
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

    <div className="MODALS">
        <div className="modal fade" id="anexoModal" tabIndex={-1} aria-labelledby="anexoModalLabel" aria-hidden="true">
            <div className="modal-dialog">
            <div className="modal-content">
                <Attachments profileToView={profileToView} />
            </div>
            </div>
        </div>

        <div className="modal fade" id="statusModal" tabIndex={-1} aria-labelledby="statusModalLabel" aria-hidden="true">
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="statusModalLabel">
                        <strong>POSTULANTE: </strong>
                        <small>{profileToView?.user?.fname} {profileToView?.user?.lname}</small>
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={refCloseStatusModal} />
                </div>
                <form onSubmit={onSubmitStatus} className="formSwitchStatus">
                    <div className="modal-body">
                        <div className="form-floating">
                            <select type="text" ref={refStatus} required="required" placeholder="Estado de la solicitud" className="form-control">
                                <option value="">Seleccione el estado</option>
                                {statuses.length > 0 && statuses.map( itm => (
                                    <option value={itm.id} key={itm.id}>{itm.status}</option>
                                ))}
                            </select>
                        <label htmlFor="status">Estado de la solicitud</label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={changingStatus ? true : ''}>
                            { changingStatus ? <LoadingOutlined /> : <SafetyOutlined /> } Cambiar status
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>

        <div className="modal fade" id="profileModal" tabIndex={-1} aria-labelledby="profileModalLabel" aria-hidden="true">
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h1 className="modal-title fs-5" id="profileModalLabel">
                    <strong>DETALLE DE SOLICITUD: </strong>
                    <small>{profileToView?.user?.fname} {profileToView?.user?.lname}</small>
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <RequestDetail profileToView={profileToView} />
            </div>
            </div>
        </div>
    </div>


    </>);
}
 
export default RequestsLists;