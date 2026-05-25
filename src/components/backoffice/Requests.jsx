import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { LoadingOutlined, EyeOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import noPhoto from '../../assets/images/no_photo.png';

const Requests = () => {
    const [loading, setLoading] = useState(false)
    const [applicationList, setApplicationList] = useState([])
    const [localitiesList, setLocalitiesList] = useState([])
    const navigate = useNavigate()

    const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState({
        locality_id: '',
        status: '',
        q: ''
	})

    const refLocality = createRef()

    useEffect( () =>{
        getApplications()
    }, [page, filterBy])

    useEffect( () =>{
        getLocalities()
    }, [])


    const getApplications = () => {
        setLoading(true)

        // const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        // axiosClient.get('/vacancies?page=' + page + query_string_search).then( ({data}) => {
        //     setLoading(false)
        //     setApplicationList(data.data)
        //     setMeta(data.meta)
        // }).catch(err => {
        //     setLoading(false)
        //     console.log(err.response);
        // })

        const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        axiosClient.get('/apply?page=' + page + query_string_search).then( ({data}) => {
            setLoading(false)
            setApplicationList(data.data)
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
            locality_id: refLocality.current.value
        })

        setLoading(false)
    }


    return (<>
        <div className="block">
            <h3>Lista de solicitudes</h3>

            <div className="content">
                
                <div className="wrapFilter">
                    <form onSubmit={onSearch}>
                    <div className="row g-1">
                        <div className="col-lg-5 col-6">
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
                        <div className="col-lg-2">
                            <button className="btn btnSearch" type="submit"><SearchOutlined />Buscar</button>
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
                            <td></td>
                            <td width={350}>PUESTO</td>
                            <td>CALLCENTER</td>
                            <td width={250}>CLIENTE</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {applicationList.length === 0 ?
                            <tr>
                                <td colSpan={8} className="text-center p-3">No hay solicitudes a vacantes disponibles.</td>
                            </tr>
                        :null}
                        
                        {applicationList.length > 0 && applicationList.map( (row, i) => (
                            <tr key={row.id}>
                                <td>{i+1}</td>
                                <td>{row.vacant.title}</td>
                                <td>{row.locality?.name}</td>
                                <td>{row.client.client_name}</td>
                                <td align="right">
                                    <button className="ctaViewRequests"
                                        onClick={() => navigate(`/account/requests/${row.vacant.id}`)}
                                    ><EyeOutlined /> Ver solicitudes</button>
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
 
export default Requests;