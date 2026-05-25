import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";
import noPhoto from '../../assets/images/no_photo.png';
import { LoadingOutlined, EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined, SearchOutlined, PlusSquareOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import GerenteLocalidadForm from "./GerenteLocalidadForm";

const Localities = ({userRole}) => {
    const [loading, setLoading] = useState(false)
    const {user, refreshData, setNotification, setRefreshData} = useStateContext()
    const [localitiesList, setLocalitiesList] = useState([])
    const [currentLocality, setCurrentLocality] = useState([])
    const [clientList, setClientList] = useState([])
    const navigate = useNavigate()

    const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState({
		client_id: "",
        name: "",
        phone: "",
        rnc: "",
	})

    const refRNC = createRef()
    const refName = createRef()
    const refClientID = createRef()
    const refPhone = createRef()

    useEffect( () =>{
        getLocalities();
    }, [page, filterBy, refreshData])

    useEffect( () =>{
        getLocalities();
        getClients();
    }, [])

    const getLocalities = () => {
        setLoading(true)

        const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        axiosClient.get('/localities?page=' + page + query_string_search).then( ({data}) => {
            setLoading(false)
            setLocalitiesList(data.data)
            setMeta(data.meta)
        }).catch(err => {
            setLoading(false)
            console.log(err.response);
        })
    }

    const getClients = () => {
        setLoading(true)

        axiosClient.get('/clients?nopagination=true').then( ({data}) => {
            setLoading(false)
            setClientList(data.data)
        }).catch(err => {
            setLoading(false)
            console.log(err.response);
        })
    }


    const goSiguiente = () => {
		if( page < meta.last_page){
			setPage(page+1)
		}
	}

	const goAnterior = () => {
		if( page > 1){
			setPage(page-1)
		}	
	}

    const onSearch = (ev) => {
        ev.preventDefault()
        setLoading(true)

        setFilterBy({
            ...filterBy,
            name: refName.current.value,
            phone: refPhone.current.value,
            client_id: refClientID.current.value,
            rnc: refRNC.current.value
        })

        setLoading(false)
    }

    const deleteLocality = (cl) => {
        setLoading(true)

        axiosClient.delete(`/localities/${cl.id}`).then( ({data})=>{
            
            setLoading(false)
            setNotification('Cliente ha sido eliminado satisfactoriamente.')
            setRefreshData(Math.random())

        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }


    return (<>
    
        <div className="block">
            <h3>
                Lista de CALLCENTERS

                <Link className="btnAddCTA" to="/account/locality/create"
                ><PlusSquareOutlined /> Nuevo callcenter</Link>
            </h3>

            <div className="content">

                <div className="wrapFilter">
                    <form onSubmit={onSearch}>
                    <div className="row g-1">
                        <div className="col-lg-2 col-6">
                            <div className="wrapSelect form-floating">
                                <select className='form-control' ref={refClientID} disabled={userRole !== 'ADMIN' ? true : false}>
                                    <option value="">- CUALQUIERA -</option>
                                    {userRole==='ADMIN' && clientList && clientList.map( c => (
                                        <option key={c.id} value={c.id}>{c.client_name}</option>
                                    ))}
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Buscar por cliente:</label>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por nombre' className='form-control' ref={refName} />
                                <label htmlFor="">Buscar por nombre</label>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por rnc' className='form-control' ref={refRNC} />
                                <label htmlFor="">Buscar por rnc</label>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por teléfono' className='form-control' ref={refPhone} />
                                <label htmlFor="">Buscar por teléfono</label>
                            </div>
                        </div>
                        <div className="col-lg-1">
                            <button className="btn btnSearch" type="submit"><SearchOutlined /></button>
                        </div>
                    </div>
                    </form>
                </div>

                {loading && <p className="text-center">
                    <LoadingOutlined /> <br/>cargando callcenters
                </p>}

                {!loading &&
                <table className="table table-hover recordList">
                    <thead>
                        <tr>
                            <td></td>
                            <td width="270">NOMBRE</td>
                            <td>RNC</td>
                            <td>TELÉFONO</td>
                            <td>CIUDAD</td>
                            <td width="100">CREADO</td>
                            <td align="center">VACANTES</td>
                            <td width="150"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {localitiesList?.length === 0 ?
                            <tr>
                                <td colSpan={8} className="text-center p-3">No hay callcenter disponibles.</td>
                            </tr>
                        :null}
                        
                        {localitiesList?.map( row => (
                            <tr key={row.id} onDoubleClick={() => navigate(`/account/locality/${row.id}`)}>
                                <td width="60">
                                    {row.logo ? 
                                        <img src={import.meta.env.VITE_STATIC_URL + row.logo } alt="avatar" width="50" />
                                    :
                                        <img src={noPhoto} alt="avatar" width="50" />
                                    }
                                </td>
                                <td>{row.name}</td>
                                <td>{row.rnc}</td>
                                <td>{row.phone}</td>
                                <td>{row.city?.city}</td>
                                <td>{ row.member_since }</td>
                                <td align="center">({row?.vacancies.length})</td>
                                <td align="right">
                                    <>
                                        {row?.gerente?.length === 0 && 
                                        <Link className="ctaActions" title="AGREGAR GERENTE DE LOCALIDAD" style={{ marginRight: "5px" }}
                                            data-bs-toggle="modal" data-bs-target="#gerenteModal"
                                            onClick={() => setCurrentLocality(row)}
                                        ><UserAddOutlined /> </Link>
                                        }

                                        <Link className="ctaActions" title="VER LOCALIDAD" style={{ marginRight: "5px" }}
                                            to={`/account/locality/${row.id}`}
                                        ><EyeOutlined /></Link>

                                        <Link className="ctaActions" title="EDITAR LOCALIDAD" style={{ marginRight: "5px" }}
                                            to={`/account/locality/${row.id}/edit`}
                                        ><EditOutlined /></Link>

                                        <button 
                                            className="ctaActions ctaDelete"
                                            title="ELIMINAR LOCALIDAD"
                                            onClick={ () => Swal.fire({
                                                            title: '¡Cuidado, si eliminas esta localidad se borra todo lo relacionado con esta!',
                                                            'text': '¿Deseas continuar con la eliminación de esta localidad?',
                                                            'icon' : 'warning',
                                                            'showCancelButton': 'true',
                                                            'cancelButtonText' : 'NO',
                                                            'confirmButtonText' : 'SI'
                                                        }).then( (result) => {
                                                            if( result.isConfirmed){
                                                                deleteLocality(row)
                                                            }
                                                        })
                                                    }
                                        ><DeleteOutlined /></button>
                                    </>
                                </td>
                            </tr>
                                
                        ))}
                    </tbody>
                </table>
                }

                {!loading && meta.last_page > 1 &&
                <div className="pagination" style={{display:'flex', justifyContent: "space-between", alignItems: 'center'}}>
                    <button className={page === 1 ? 'btn btn-disabled' : 'btn'} 
                        onClick={() => goAnterior()}>
                        &larr; Anterior
                    </button>

                    <span>{meta.current_page}/{meta.last_page}</span>

                    <button className={page === meta.last_page ? 'btn btn-disabled' : 'btn'}
                        onClick={() => goSiguiente()}>
                        Siguiente &rarr;
                    </button>
                </div>}
                
            </div>
        </div>


        <div className="modal fade" id="gerenteModal" tabIndex={-1} aria-labelledby="gerenteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <GerenteLocalidadForm currentLocality={currentLocality} />
                </div>
            </div>
        </div>

    </>);
}
 
export default Localities;