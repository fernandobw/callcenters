import { useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";
import {Loading3QuartersOutlined } from '@ant-design/icons';
import { useStateContext } from "../contexts/ContextProvider";

// icons
import iconBrief from '../assets/images/briefcase-icon.png';
import iconCompany from '../assets/images/company-icon.png';
import iconLocat from '../assets/images/location-icon.png';
import checkedIcon from '../assets/images/checked.png';

import facebookIcon from '../assets/images/facebook.png';
import linkedinIcon from '../assets/images/linkedin.png';
import whatsappIcon from '../assets/images/whatsapp.png';

import twitterIcon from '../assets/images/twitter.png';
import emailIcon from '../assets/images/email.png';

const VacantDetail = () => {
   	const [loading, setLoading] = useState(false)
   	const [vacant, setVacant] = useState({})

	const [answers, setAnswers] = useState({})
	const [success, setSuccess] = useState(null)
	const [message, setMessage] = useState(null)
	const [applying, setApplying] = useState(false)

   	const { id } = useParams()
	const {user} = useStateContext()

    useEffect( () => {
        getvacant()
    }, [])
    

   const getvacant = () => {
		setLoading(true)
		axiosClient.get(`/vacants/${id}`)
			.then(({ data }) => {
					setLoading(false)
					setVacant(data.data[0])
			})
			.catch(() => {
					setLoading(false)
			})
   }


   const handleInputChange = (ev) => {

		setAnswers({
			...answers,
			[ev.target.name]: {
				question_id: parseInt(ev.target.getAttribute('data-question')),
				vacant_id: parseInt(ev.target.getAttribute('data-vacant')),
				answer: ev.target.value
			}
		})
	}

   	const onSubmit = (ev) => {
		ev.preventDefault()

		const payload = {
			vacant_id: vacant.id,
			locality_id: vacant.locality.id,
			client_id: vacant.locality.client.id,
			answers: answers
		}

		window.scrollTo(0,0);
		setMessage(null)

		axiosClient.post('/apply', payload)
		.then( ({data}) => {
			setSuccess(data.message)
		})
		.catch( err => {
			const response = err.response
			if( response && response.status === 422){
				setMessage(response.data.message)
			}else{
				console.log(response)
				setMessage(data.message)
			}
		})
	}


    return (
        <>
			<header className="headerInteriorVacantSingle" itemscope itemtype="https://schema.org/JobPosting">
				<div className="container">
					<div className="row">
						<div className={vacant.confidential === 0 ? 'col-lg-9 my-auto' : 'col-lg-9'}>
							<h1 itemprop="title">{vacant.title}</h1>

							<ul className="features">
								<li><span className="briefcase" style={{background: `url(${iconBrief}) no-repeat center`}}></span> {vacant.area}</li>
								{ vacant.confidential &&
								<li><span className="company" style={{background: `url(${iconCompany}) no-repeat center`}}></span>{vacant.locality.name}</li>
								}
								<li><span className="location" style={{background: `url(${iconLocat}) no-repeat center`}}></span>{vacant.city}</li>
							</ul>

							<div className="tagsGroup">
								{vacant.tag && vacant.tag.map( item => (
									<span className="tags" key={item.id}>{item.tag}</span>
								))}
							</div>
						</div>
						<div className="col-lg-3">

							<div className="meta">
								<small>Publicación de la vacante:  <span itemprop="datePosted"> { vacant.created_at}</span></small>
								<small>{vacant.applications?.length} postulantes</small>
								<br/>

								{user.applications?.filter( (item) => item.vacant_id == id).length > 0 && 
									<small className="text-success">Ya has aplicado a este puesto.</small>}

								{ Object.keys(user).length === 0 || user.applications?.filter( (item) => item.vacant_id == id).length === 0 && user.can_apply === 1 ?
									<button className="ctaAplicar" onClick={()=>setApplying(true)}>Aplicar</button> :null}

								{ (user.can_apply === 0) ?
									<Link to={`/account`} className="ctaAplicar">Completar mi perfil</Link> :null}
							</div>
						</div>
					</div>
				</div>
			</header>

			{ loading && <div className="text-center"><Loading3QuartersOutlined spin /> cargando...</div>}


			{!loading &&
			<section className="wrapSingleVacant">
				<div className="container">

					{success && <div className="alert alert-success text-center p-4 mb-4">
						<h4>{success}</h4>
					</div>}

					{applying && !success &&
					<div className="block">
						<h2>Responda las siguientes preguntas:</h2>
						<div className="content">
							<form onSubmit={onSubmit} onChange={()=>setMessage('')}>
								{vacant.questions && vacant?.questions.map( (item, i) => (
									<div className="form-floating" key={i+1}>
										<p className="mb-1 mt-3">Pregunta {i+1}: {item.question}</p>
										<textarea className="form-control" 
											required="required"
											data-question={item.id}
											data-vacant={vacant.id}
											name={item.id}
											onChange={handleInputChange}
										></textarea>
									</div>
								))}

								{vacant.questions && vacant?.questions.length === 0 ?
									<p className="alert alert-info">
										Aún faltan las preguntas.
									</p>
								: 
								<>
									<input type="submit" className="btn ctaAplicar" value="Enviar solicitud" />
									<button className="btnDefault" onClick={()=>setApplying(false)}>&larr; Cancelar</button>
								</>
								}
							</form>
						</div>
					</div>
					}
					

					{!applying &&
						<div className="row">
							<div className="col-lg-8">
								<div className="block">
									<h2>Descripción</h2>
									<div className="content">
										<p itemprop="description">{vacant.description}</p>
									</div>
								</div>

								<div className="block requisitos">
									<h2>Requisitos</h2>
									<div className="content">
										<ul itemprop="educationRequirements">
											{ vacant.requirements?.split('\n').map( (str, i) => (
												<span key={i}>
												{str ? <li key={i} style={{background: `url(${checkedIcon}) no-repeat left`}}>{str}</li> : null}
												</span>
											))}
										</ul>
									</div>
								</div>
								
								<div className="block requisitos">
									<h2>Beneficios</h2>
									<div className="content">
										<ul itemprop="responsibilities">
												{ vacant.benefits?.split('\n').map( (str, i) =>(
													<span key={i}>
													{str ?  <li style={{background: `url(${checkedIcon}) no-repeat left`}}>{str}</li> : null }
													</span>
												))}
										</ul>
									</div>
								</div>

								<Link to="/" className="ctaAplicar btnBack">&larr; Volver atrás</Link>

								{user.applications?.filter( (item) => item.vacant_id == id).length > 0 && 
									<small className="text-success">Ya has aplicado a este puesto.</small>}

								{ Object.keys(user).length === 0 || user.applications?.filter( (item) => item.vacant_id == id).length === 0 && user.can_apply === 1 ?
									<button className="ctaAplicar" onClick={()=>setApplying(true)}>Aplicar</button>
								:null}


								{ (user.can_apply === 0) ?
									<Link to={`/account`} className="ctaAplicar">Completar mi perfil</Link> :null}

							</div>
							<aside className="col-lg-4">
								<div className="blockSidebar blockInfoGen">
									<h2>Información general</h2>

									<div className="content">
										<div className="row">
											<div className="col-4">
												<p itemprop="industry">Área:</p>
											</div>
											<div className="col-8">
												<p>{vacant.area}</p>
											</div>
											<div className="col-4">
												<p>Ciudad:</p>
											</div>
											<div className="col-8">
												<p>{vacant.city}</p>
											</div>
										</div>

										<div className="row">
											<div className="col-4">
												<p>Contrato:</p>
											</div>
											<div className="col-8">
												<p>{vacant.contract_type}</p>
											</div>
											<div className="col-4">
												<p>Jornada:</p>
											</div>
											<div className="col-8">
												<p itemprop="employmentType">{vacant.workday}</p>
											</div>
											<div className="col-4">
												<p>Modalidad:</p>
											</div>
											<div className="col-8">
												<p>{vacant.modality}</p>
											</div>
										</div>
										
										{vacant.show_salary ?
											<div className="row">
												<div className="col-4">
													<p>Sueldo:</p>
												</div>
												<div className="col-8">
													<p>{vacant.salary > 0 ? '<span itemprop="salaryCurrency">' +vacant.currency + '</span> <span itemprop="baseSalary">' + vacant.salary + '</span>' : '<span itemprop="baseSalary">' + vacant.salary + '</span>'}</p>
												</div>
											</div>
										:null}
									</div>
							</div>
							<div className="blockSidebar text-center">
									<h2>Comparte esta vacante</h2>
									
									<div className="content">
										<ul className="share mb-0 d-flex justify-content-center">
											<li><a href={`https://www.facebook.com/sharer/sharer.php?u=` + import.meta.env.VITE_APP_URL +'/vacante/'+vacant.id+'/'+ vacant.slug} target="_blank" rel="noreferrer" className="iconShare"><img src={facebookIcon} alt="Facebook" /></a></li>
											<li><a href={`https://www.linkedin.com/sharing/share-offsite/?url=` + import.meta.env.VITE_APP_URL +'/vacante/'+vacant.id+'/'+ vacant.slug} target="_blank" rel="noreferrer" className="iconShare"><img src={linkedinIcon} alt="Linkedin" /></a></li>
											<li><a href={`https://twitter.com/intent/tweet?url=` + import.meta.env.VITE_APP_URL +'/vacante/'+vacant.id+'/'+ vacant.slug + '&text=Vacante: ' + vacant.title} target="_blank" rel="noreferrer" className="iconShare"><img src={twitterIcon} alt="Twitter" /></a></li>
											<li><a href={`whatsapp://send?text=` + import.meta.env.VITE_APP_URL +'/vacante/'+vacant.id+'/'+ vacant.slug} target="_blank" rel="noreferrer" className="iconShare"><img src={whatsappIcon} alt="Whatsapp" /></a></li>
											<li><a href={`mailto:?body=` + import.meta.env.VITE_APP_URL +'/vacante/'+vacant.slug} target="_blank" rel="noreferrer" className="iconShare"><img src={emailIcon} alt="Facebook" /></a></li>
										</ul>
									</div>
							</div>
							
						</aside>
						</div>
					}
				</div>
			</section>   
			}
        </>
    );
}
 
export default VacantDetail;