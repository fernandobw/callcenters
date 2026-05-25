import { createRef, useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/ContextProvider";
import noPhoto from '../../assets/images/no_photo.png';
import { LoadingOutlined, EditOutlined, DeleteOutlined, DownOutlined, SearchOutlined, FileTextOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const Users = ({theKey, userRole}) => {
    const [usersList, setUsersList] = useState([])
    const [clientList, setClientList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [loading, setLoading] = useState(false)
    const {user, refreshData, setNotification, setRefreshData} = useStateContext()

    const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
    const [filterBy, setFilterBy] = useState({
		email: ""
	})

    const refRole = createRef()
    const refEmail = createRef()
    const refClient = createRef()
    const refFName = createRef()
    const refPhone = createRef()

    useEffect( () =>{
        getUsers()
    }, [page, filterBy, refreshData])

    useEffect( () =>{
        getClients()
        getRoles()
    }, [])

    const getUsers = () => {
        setLoading(true)

        const query_string_search = '&' + new URLSearchParams(filterBy).toString();
        const isPostulantOrUser = theKey === "postulants" ? "&type=postulants" : "&type=users";

        axiosClient.get('/users?page=' + page + query_string_search + isPostulantOrUser)
            .then( ({data}) => {
                setLoading(false)
                setUsersList(data.data)
                setMeta(data.meta)
            }).catch(err => {
                setLoading(false)
                console.log(err.response);
            })
    }

    const getClients = () => {
        setLoading(true)

        axiosClient.get('/clients').then( ({data}) => {
            setLoading(false)
            setClientList(data.data)
        }).catch(err => {
            setLoading(false)
            console.log(err.response);
        })
    }

    const getRoles = () => {
        setLoading(true)

        axiosClient.get('/roles').then( ({data}) => {
            setLoading(false)
            setRoleList(data.data)
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
            email: refEmail.current.value,
            phone: theKey === "users" ? "" : refPhone.current.value,
            fname: theKey === "users" ? "" : refFName.current.value,
            role_id: theKey === "users" ? refRole.current.value : "",
            client_id: theKey === "users"  ? refClient.current.value : "",
        })

        setLoading(false)
    }


    // Delete User
    const deleteUser = (id) => {
        setLoading(true)
        axiosClient.delete(`/users/${id}`).then( () => {
            setLoading(false)
            setRefreshData(Math.random())
            setNotification('El usuario ha sido eliminado satisfactoriamente.')
        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }

    // console.log(userRole);

    return (
        <>
        <div className="block">
            <h3>Lista de {theKey === 'users' ? 'usuarios' : 'postulantes'}

                {userRole === 'ADMIN' || userRole === 'CLIENTE' || userRole === 'CONSULTOR' ?
                <Link className="btnAddCTA" to="/account/user/create?backto=users">
                    <PlusSquareOutlined /> usuario
                </Link> 
                :null}
            </h3>

            <div className="content">

                <div className="wrapFilter">
                    <form onSubmit={onSearch}>
                    <div className="row g-1">
                        {theKey === "users" ? 
                        <>
                        <div className="col-lg-3 col-6">
                            <div className="wrapSelect form-floating">
                                <select name='role' className='form-control' ref={refRole} disabled={userRole !== 'ADMIN' ? true : false}>
                                    <option value="">- CUALQUIER -</option>
                                    {userRole === 'ADMIN' && roleList?.filter( (r) => r.id < 7).map( (role) => (
                                        <option value={role.id} key={role.id}>{role.description}</option>
                                    ))}
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Buscar por tipo:</label>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="wrapSelect form-floating">
                                <select name='role' className='form-control' ref={refClient} disabled={userRole !== 'ADMIN' ? true : false}>
                                    <option value="">- CUALQUIERA -</option>
                                    {userRole === 'ADMIN' && clientList?.map( (client) => (
                                        <option value={client.id} key={client.id}>{client.client_name}</option>
                                    ))}
                                </select>
                                <DownOutlined />
                                <label htmlFor="">Buscar por cliente:</label>
                            </div>
                        </div>
                        </>
                        :
                        <>
                        <div className="col-lg-3">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por nombre' className='form-control' ref={refFName} />
                                <label htmlFor="">Buscar por nombre</label>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por teléfono' className='form-control' ref={refPhone} />
                                <label htmlFor="">Buscar por teléfono</label>
                            </div>
                        </div>
                        </>
                        }
                        <div className="col-lg-4 col-6">
                            <div className="form-floating">
                                <input type="search" placeholder='Buscar por email' className='form-control' ref={refEmail} />
                                <label htmlFor="">Buscar por email</label>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <button className="btn btnSearch" type="submit"><SearchOutlined /> Buscar</button>
                        </div>
                    </div>
                    </form>
                </div>

                {loading && <p className="text-center">
                    <LoadingOutlined /> <br/>cargando usuarios
                </p>}

                {!loading &&
                <table className="table table-hover recordList">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Nombre</td>
                            <td>Teléfono</td>
                            <td>Email</td>
                            <td>TIPO</td>
                            {theKey === "users" && <td>CLIENTE</td> }
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList?.length === 0 ?
                            <tr><td colSpan={7} className='text-center'>No se encontraron usuarios.</td></tr>
                        :null}

                        {usersList?.map( row => (
                            <tr key={row.id}>
                                <td width="60">
                                    {row.avatar ? 
                                        <img src={import.meta.env.VITE_STATIC_URL + row.avatar } alt="avatar" width="50" />
                                    :
                                        <img src={noPhoto} alt="avatar" width="50" />
                                    }
                                </td>
                                <td>{row.fname} {row.lname}</td>
                                <td>{row.phone}</td>
                                <td>{row.email}</td>
                                <td>{row.role.description}</td>
                                {theKey === "users" && <td>{row.client && row.client.client_name}</td> }
                                <td align="right">

                                    { user.id !== row.id ? (
                                    <>
                                        {theKey === "postulants" && row?.resume &&
                                            <Link className="ctaActions" title="VER CV" style={{ marginRight: "5px" }}
                                                to={`/account/user/${row.id}/resume`}
                                            ><FileTextOutlined /> </Link>
                                        }
                                        <Link className="ctaActions" title="EDITAR USUARIO" style={{ marginRight: "5px" }}
                                            to={`/account/user/${row.id}/edit?backto=${theKey}`}
                                        ><EditOutlined /></Link>

                                        {(userRole === 'ADMIN' || userRole === 'CLIENTE') &&
                                        <button 
                                            className="ctaActions ctaDelete"
                                            title="ELIMINAR USUARIO"
                                            onClick={ () => Swal.fire({
                                                            title: '¿Deseas eliminar este usuario?',
                                                            'text': 'Esta acción no se puede revertir',
                                                            'icon' : 'warning',
                                                            'showCancelButton': 'true',
                                                            'cancelButtonText' : 'NO',
                                                            'confirmButtonText' : 'SI'
                                                        }).then( (result) => {
                                                            if( result.isConfirmed){
                                                                deleteUser(row.id)
                                                            }
                                                        })
                                                    }
                                        ><DeleteOutlined /></button>}
                                    </>
                                    ) : null }
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
        </>
    );
}
 
export default Users;