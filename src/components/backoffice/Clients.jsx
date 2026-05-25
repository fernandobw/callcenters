import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";
import noPhoto from '../../assets/images/no_photo.png';
import { LoadingOutlined, EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined, SearchOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Link, Navigate, useNavigate } from "react-router-dom";

const Clients = () => {
    const [loading, setLoading] = useState(false)
    const {user, refreshData, setNotification, setRefreshData} = useStateContext()
    const [clientList, setClientList] = useState([])
    const navigate = useNavigate()

    const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState({
		type_client: "",
        client_name: "",
        phone: "",
        client_rnc: "",
	})

    const refRNC = createRef()
    const refName = createRef()
    const refCType = createRef()
    const refPhone = createRef()

    useEffect( () =>{
        getClients()
    }, [page, filterBy, refreshData])

    const getClients = () => {
        setLoading(true)

        const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        axiosClient.get('/clients?page=' + page + query_string_search).then( ({data}) => {
            setLoading(false)
            setClientList(data.data)
            setMeta(data.meta)
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
            client_name: refName.current.value,
            phone: refPhone.current.value,
            type_client: refCType.current.value,
            client_rnc: refRNC.current.value
        })

        setLoading(false)
    }


    const deleteUser = (cl) => {
        setLoading(true)

        axiosClient.delete(`/clients/${cl.id}`).then( ({data})=>{
            
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
                Lista de clientes

                <Link className="btnAddCTA" to="/account/client/create"
                ><PlusSquareOutlined /> Nuevo cliente</Link>
            </h3>

            <div className="content">

                <div className="wrapFilter">
                    <form onSubmit={onSearch}>
                    <div className="row g-1">
                        <div className="col-lg-2 col-6">
                            <div className="wrapSelect form-floating">
                                <select className='form-control' ref={refCType}>
                                    <option value="">- CUALQUIERA -</option>
                                    <option value="CLIENTE">CLIENTE</option>
                                    <option value="CONSULTOR">CONSULTOR</option>
                                    <option value="SUBCLIENTE">SUBCLIENTE</option>
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Buscar por tipo:</label>
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
                    <LoadingOutlined /> <br/>cargando clientes
                </p>}

                {!loading &&
                <table className="table table-hover recordList">
                    <thead>
                        <tr>
                            <td></td>
                            <td>TIPO</td>
                            <td width="270">CLIENTE</td>
                            <td>RNC</td>
                            <td>TELÉFONO</td>
                            <td align="center">CALLCENTER</td>
                            <td width="100">CREADO</td>
                            <td width="130"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {clientList?.length === 0 ?
                            <tr>
                                <td colSpan={8} className="text-center p-3">No hay clientes disponibles.</td>
                            </tr>
                        :null}
                        
                        {clientList?.map( row => (
                            <tr key={row.id} onDoubleClick={() => navigate(`/account/client/${row.id}`)}>
                                <td width="60">
                                    {row.logo ? 
                                        <img src={import.meta.env.VITE_STATIC_URL + row.logo } alt="avatar" width="50" />
                                    :
                                        <img src={noPhoto} alt="avatar" width="50" />
                                    }
                                </td>
                                <td width={40}>{row.type_client}</td>
                                <td>{row.client_name}</td>
                                <td>{row.client_rnc}</td>
                                <td>
                                    {row.phone} <br/>
                                    {row.cellphone}
                                </td>
                                <td align="center">({row?.localities.length})</td>
                                <td>{ row.member_since }</td>
                                <td align="right">
                                    <>
                                        <Link className="ctaActions" title="VER CLIENTE" style={{ marginRight: "5px" }}
                                            to={`/account/client/${row.id}`}
                                        ><EyeOutlined /></Link>

                                        <Link className="ctaActions" title="EDITAR CLIENTE" style={{ marginRight: "5px" }}
                                            to={`/account/client/${row.id}/edit`}
                                        ><EditOutlined /></Link>

                                        <button 
                                            className="ctaActions ctaDelete"
                                            title="ELIMINAR CLIENTE"
                                            onClick={ () => Swal.fire({
                                                            title: '¡Cuidado, si eliminas el cliente se borra todo lo relacionado con este!',
                                                            'text': '¿Deseas continuar con la eliminación de este cliente?',
                                                            'icon' : 'warning',
                                                            'showCancelButton': 'true',
                                                            'cancelButtonText' : 'NO',
                                                            'confirmButtonText' : 'SI'
                                                        }).then( (result) => {
                                                            if( result.isConfirmed){
                                                                deleteUser(row)
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
 
export default Clients;