import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";
import { LoadingOutlined, EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined, SearchOutlined, PlusSquareOutlined, QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";

const Vacancies = () => {
    const [loading, setLoading] = useState(false)
    const {user, refreshData, setNotification, setRefreshData} = useStateContext()
    const [vacanciesList, setVacanciesList] = useState([])
    const [localitiesList, setLocalitiesList] = useState([])
    const navigate = useNavigate()

    const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState({
        locality_id: '',
        status: '',
        q: ''
	})

    const refQ = createRef()
    const refLocality = createRef()
    const refStatus = createRef()

    useEffect( () =>{
        getVacancies()
    }, [page, filterBy, refreshData])

    useEffect( () =>{
        getLocalities()
    }, [])

    const getVacancies = () => {
        setLoading(true)

        const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        axiosClient.get('/vacancies?page=' + page + query_string_search).then( ({data}) => {
            setLoading(false)
            setVacanciesList(data.data)
            setMeta(data.meta)
        }).catch(err => {
            setLoading(false)
            console.log(err.response);
        })
    }

    const getLocalities = () => {
        setLoading(true)

        axiosClient.get('/localities?nopagination=true').then( ({data}) => {
            setLoading(false)
            setLocalitiesList(data.data)
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
            locality_id: refLocality.current.value,
            status: refStatus.current.value,
            q: refQ.current.value
        })

        setLoading(false)
    }

    const deleteVacante = (cl) => {
        setLoading(true)

        axiosClient.delete(`/vacancies/${cl.id}`).then( ({data})=>{
            
            setLoading(false)
            setNotification('Vacante ha sido eliminada satisfactoriamente.')
            setRefreshData(Math.random())

        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }

    const duplicarVacante = (cl) => {
        setLoading(true)

        axiosClient.post(`/vacancies/${cl.id}/duplicate`).then( ({data})=>{
            
            setLoading(false)
            setNotification('Vacante ha sido duplicada satisfactoriamente.')
            setRefreshData(Math.random())
            // console.log(data);

        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }
    

    return (<>
        <div className="block">
            <h3>
                Lista de vacantes

                <Link className="btnAddCTA" to="/account/vacancies/create"
                ><PlusSquareOutlined /> Nueva vacante</Link>
            </h3>

            <div className="content">
                
                <div className="wrapFilter">
                    <form onSubmit={onSearch}>
                    <div className="row g-1">
                        <div className="col-lg-5">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar...' className='form-control' ref={refQ} />
                                <label htmlFor="">Buscar...</label>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="wrapSelect form-floating">
                                <select className='form-control' ref={refLocality}>
                                    <option value="">- CUALQUIERA -</option>
                                    {localitiesList && localitiesList.map( loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Por callcenter:</label>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="wrapSelect form-floating">
                                <select className='form-control' ref={refStatus}>
                                    <option value="">- CUALQUIERA -</option>
                                    <option value="1">Activa</option>
                                    <option value="0">Inactiva</option>
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Por estado:</label>
                            </div>
                        </div>
                        <div className="col-lg-1">
                            <button className="btn btnSearch" type="submit"><SearchOutlined /></button>
                        </div>
                    </div>
                    </form>
                </div>

                {loading && <p className="text-center">
                    <LoadingOutlined /> <br/>cargando clientes
                </p>}

                {!loading &&
                <table className="table table-hover recordList">
                    <thead>
                        <tr>
                            <td>STATUS</td>
                            <td width="300">PUESTO</td>
                            <td>CALLCENTER / CLIENTE</td>
                            <td>CIUDAD</td>
                            <td width="100">CREADO</td>
                            <td>PREGUNTAS</td>
                            <td>SOLICITUDES</td>
                            <td width="200"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {vacanciesList.length === 0 ?
                            <tr>
                                <td colSpan={8} className="text-center p-3">No hay vacantes disponibles.</td>
                            </tr>
                        :null}
                        
                        {vacanciesList.length > 0 && vacanciesList.map( row => (
                            <tr key={row.id} onDoubleClick={() => navigate(`/account/vacant/${row.id}`)} className={row.status === 'Activa' ? 'activa' : 'inactiva'}>
                                <td width={40} align="center">{row.status}</td>
                                <td>
                                    {row.status === 'Activa' ? 
                                    
                                        <Link to={`${import.meta.env.VITE_APP_URL}/vacante/${row.id}/${row.slug}`} target="_blank">
                                            {row.title}
                                        </Link>
                                    : row.title }
                                </td>
                                <td>
                                    {row.locality.name} <hr style={{border: '1px solid #eee', margin: '0', padding: '0'}}/>
                                    <strong>CLIENTE:</strong> {row.locality.client.client_name}
                                </td>
                                <td>{ row.city }</td>
                                <td>{ row.created_at }</td>
                                <td align="center">({row?.questions.length})</td>
                                <td align="center">({row?.applications.length})</td>
                                <td align="right">
                                    <>
                                    <Link className="ctaActions" title="VER VACANTE" style={{ marginRight: "8px" }}
                                        to={`/account/vacant/${row.id}`}
                                    ><EyeOutlined /></Link>

                                    <Link className="ctaActions" title="EDITAR VACANTE" style={{ marginRight: "8px" }}
                                        to={`/account/vacancies/${row.id}/edit`}
                                    ><EditOutlined /></Link>

                                    <Link className="ctaActions" title="PREGUNTAS" style={{ marginRight: "8px" }}
                                        to={`/account/vacant/${row.id}/questions`}
                                    ><QuestionCircleOutlined /></Link>

                                    <button 
                                        className="ctaActions ctaDuplicar"
                                        title="DUPLICAR VACANTE"
                                        onClick={ () => Swal.fire({
                                                        title: '¿Deseas duplicar esta vacante?',
                                                        'icon' : 'info',
                                                        'showCancelButton': 'true',
                                                        'cancelButtonText' : 'Cancelar',
                                                        'confirmButtonText' : 'SI, Duplicar'
                                                    }).then( (result) => {
                                                        if( result.isConfirmed){
                                                            duplicarVacante(row)
                                                        }
                                                    })
                                                }
                                    ><CopyOutlined /></button>

                                    <button 
                                        className="ctaActions ctaDelete"
                                        title="ELIMINAR VACANTE"
                                        onClick={ () => Swal.fire({
                                                        title: '¿Realmente deseas eliminar esta vacante?',
                                                        'icon' : 'warning',
                                                        'showCancelButton': 'true',
                                                        'cancelButtonText' : 'NO',
                                                        'confirmButtonText' : 'SI'
                                                    }).then( (result) => {
                                                        if( result.isConfirmed){
                                                            deleteVacante(row)
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
    </>);
}
 
export default Vacancies;