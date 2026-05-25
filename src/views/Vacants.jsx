import { createRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../axios-client";

import { 
	Loading3QuartersOutlined,
	StarFilled,
	UsergroupAddOutlined,
	BankOutlined,
	FileSearchOutlined
} from '@ant-design/icons';

const Vacants = () => {
    const [loading, setLoading] = useState(false)
    const [vacancies, setVacancies] = useState([])
	const [widget, setWidget] = useState({})
	const [meta, setMeta] = useState({})
	const [page, setPage] = useState(1)
	const refQ = createRef()
	const location = useLocation();


	const [filterBy, setFilterBy] = useState({
		q: "",
		city: "",
		modality: "",
		area: "",
		workday: ""
	})


	const onSearch = (ev) => {
		ev.preventDefault();
		setLoading(true)
		setFilterBy({
			...filterBy,
			q: refQ.current.value
		})
		setLoading(false)
	}


    useEffect( () => {
        getVacants()
		getWidgets()
		window.scrollTo(0,0);
    }, [page, filterBy])


	useEffect(() => {
		const criterio = new URLSearchParams(location.search);

		if(criterio.get('q') != null){
			setTimeout(() => {
			
				setFilterBy({
					...filterBy,
					q: criterio.get('q'),
					city: criterio.get('city')
				});

			}, 1000);
		}

	}, []);



    const getVacants = () => {
        setLoading(true)

		const query_string_search = '&' + new URLSearchParams(filterBy).toString();

        axiosClient.get('/vacants?page=' + page + query_string_search)
        .then( ({data}) =>{
            setLoading(false)
            setVacancies(data.data)
			setMeta(data.meta);
        })
        .catch( (err) => {
            setLoading(false)
			console.log(err.response)
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

	const getWidgets = (type) => {
		setLoading(true)

		axiosClient.get(`/vacants/counts`)
		.then( ({data}) => {
			setLoading(false)
			setWidget(data)
		})
		.catch( err => {
			setLoading(false)
			const response = err.response
			console.log(response);
		})
	}

    return ( 

        <>
        <header className="headerInterior">
            <h1>PUESTOS DE TRABAJO</h1>
        </header>
        <section className="wrapVacant">
            <div className="container">

					<div className="row">
						<div className="col-lg-3">

							<aside className="asideFixed sticky-top">


								<div className="blocksFilter">
									<h3>Modalidad</h3>
									<div className="content">
										<ul className="list">
											<li><a href="#" onClick={ ()=> setFilterBy({
                                                    ...filterBy,
                                                    modality: '',
                                                    page: 1
                                                }) }>
												Por cualquiera
											</a></li>
											{ loading ? 'cargando...' :
											  widget['modality'] && widget['modality'].map( (a, k) => (
												<li key={k}>
													<a href="#" className={filterBy.modality === a.modality ? 'active' : null}
														onClick={ ()=> setFilterBy({
															...filterBy,
															modality: a.modality,
															// page: 1
														}) } 
													>{a.modality}<span>({a.total})</span></a>
												</li>
											))}
										</ul>
									</div>
								</div>

								<div className="blocksFilter">
									<h3>Jornada</h3>
									<div className="content">
										<ul className="list">
											<li><a href="#" onClick={ ()=> setFilterBy({
                                                    ...filterBy,
                                                    workday: '',
                                                    page: 1
                                                }) }>
												Por cualquiera
											</a></li>
											{ loading ? 'cargando...' :
											  widget['workday'] && widget['workday'].map( (a, k) => (
												<li key={k}>
													<a href="#" className={filterBy.workday === a.workday ? 'active' : null}
														onClick={ ()=> setFilterBy({
															...filterBy,
															workday: a.workday,
															// page: 1
														}) }
													>{a.workday}<span>({a.total})</span></a>
												</li>
											))}
										</ul>
									</div>
								</div>

								<div className="blocksFilter">
									<h3>Ciudad</h3>
									<div className="content">
										<ul className="list">
											<li><a href="#" onClick={ ()=> setFilterBy({
                                                    ...filterBy,
                                                    city: '',
                                                    page: 1
                                                }) }>
												Por cualquiera
											</a></li>
											{ loading ? 'cargando...' :
											  widget['city'] && widget['city'].map( (a, k) => (
												<li key={k}>
													<a href="#" className={filterBy.city === a.city ? 'active' : null}
														onClick={()=>setFilterBy({
															...filterBy,
															city: a.city,
															// page: 1
														})}
													>{a.city}<span>({a.total})</span></a>
												</li>
											))}
										</ul>
									</div>
								</div>

							</aside>
						</div>
						<div className="col-lg-9">

							<div className="filterTop">
								<form action="" onSubmit={onSearch}>
									<div className="input-group">
										<input type="text" className="form-control" placeholder="Entra en el empleo que deseas..." autoComplete="off"
											ref={refQ}
										/>
										<button className="btnSearchVacant">Buscar empleos</button>
									</div>
								</form>
							</div>

							{ loading && <div className="text-center"><Loading3QuartersOutlined spin /> cargando...</div>}
						
							{vacancies && vacancies.length === 0 && !loading &&
								<div className="alert alert-warning mt-3 text-center">No hay vacantes disponibles con este criterio de búsqueda.</div>
							}
							

							{ !loading && <>
								<div className="row g-4 listVacantes" itemScope itemType="https://schema.org/JobPosting">
								{vacancies.map( v => ( 
									<article className="col-lg-6 vacant-item" key={v.id}>
										<div className="inner">
											{/* {v.featured === 1 && <StarFilled /> } */}
											
											<Link to={`/vacante/${v.id}/${v.slug}`}>
												<h3 itemProp="title">{v.title}</h3>
											</Link>

											<p itemProp="description">
												{v.description.substring(0,280)}...
											</p>

											<ul className="listFeatures">
												<li className="nav-item" itemProp="employmentType"><FileSearchOutlined /> {v.workday}</li>
												{!v.confidential && <li className="nav-item"><BankOutlined /> {v.locality.name}</li>}
												<li className="nav-item"><UsergroupAddOutlined /> {v.applications.length} postulantes</li>
											</ul>
										</div>
										<footer className="footer-vacant">
											<Link to={`/vacante/${v.id}/${v.slug}`} itemProp="url" className="ctaConoce">Conocer más</Link>
										</footer>
									</article>
								))}
								</div>
							</>
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

            </div>
        </section>
        </>

     );
}
 
export default Vacants;