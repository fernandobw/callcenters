import { createRef, useState } from "react";
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";
import CurrencyInput from 'react-currency-input-field';

const InfoProfessional = () => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const {user, setNotification, setRefreshData, complements, cities} = useStateContext()

    const yearOfExperienceRef = createRef()
    const currencyRef = createRef()
    const salaryRef = createRef()
    const salaryExpectationRef = createRef()

    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            year_of_experience: yearOfExperienceRef.current.value,
            currency: currencyRef.current.value,
            salary: salaryRef.current.value,
            salary_expectation: salaryExpectationRef.current.value
        }

        axiosClient.put(`/resume/${user.resume && user.resume.id}`, payload).then( ({data}) => {
            setValidationError(null)
            setRefreshData(Math.random())
            setNotification('Se han guardado los cambios exitosamente.')
            setEditing(false)

        }).catch( err => {
            setLoading(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
                // console.log(response.data.errors);
            }else{
                console.log(response.data);
            }
        })
    }

    return (
        <div className="block">
            <h3>Información profesional
                
                <button className="btnEditCTA"
                    onClick={ () => setEditing(true) }
                ><EditOutlined /></button>
            </h3>
            <div className="content">
                { !editing ?
                    
                    <table className="table" onDoubleClick={ () => setEditing(true) }>
                        <tbody>
                            <tr>
                                <td>Experiencia <span className="requeridField">*</span></td>
                                <td>{user.resume && user.resume.year_of_experience ? user.resume.year_of_experience +' años' : null}</td>
                            </tr>
                            <tr>
                                <td>Último salario <span className="requeridField">*</span></td>
                                <td>{user.resume && user.resume.currency} {user.resume && user.resume.salary ? Intl.NumberFormat("en-US", 0).format(user.resume.salary) : 0}</td>
                            </tr>
                            <tr>
                                <td>Expectativa salarial <span className="requeridField">*</span></td>
                                <td>{user.resume && user.resume.currency} {user.resume && user.resume.salary_expectation ? Intl.NumberFormat("en-US",0).format(user.resume.salary_expectation) : 0}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                : 
                    <form onSubmit={onSubmit}>
                        <div className="row g-1">
                            <div className="col-12">
                                <div className="form-floating">
                                    <select className="form-control" ref={yearOfExperienceRef}  defaultValue={user.resume && user.resume.year_of_experience}>
                                        <option className="1">1</option>
                                        <option className="2">2</option>
                                        <option className="3">3</option>
                                        <option className="4">4</option>
                                        <option className="5">5</option>
                                        <option className="6">6</option>
                                        <option className="7">7</option>
                                        <option className="8">8</option>
                                        <option className="9">9</option>
                                        <option className="10">10+</option>
                                    </select>
                                    <label htmlFor="exp">Experiencia <span className="requeridField">*</span></label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-floating">
                                    <select className="form-control" ref={currencyRef}  defaultValue={user.resume && user.resume.currency}>
                                        <option className="RD$">RD$</option>
                                        <option className="US$">US$</option>
                                    </select>
                                    <label htmlFor="currency">Moneda <span className="requeridField">*</span></label>
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="form-floating">
                                    <CurrencyInput
                                        className="form-control"
                                        ref={salaryRef}
                                        placeholder="Último salario"
                                        defaultValue={user.resume && user.resume.salary}
                                        allowDecimals={false}
                                    />
                                    <label htmlFor="salary">Último salario <span className="requeridField">*</span></label>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-floating">
                                    <CurrencyInput
                                        className="form-control"
                                        ref={salaryExpectationRef}
                                        placeholder="Expectativa salarial"
                                        defaultValue={user.resume && user.resume.salary_expectation}
                                        allowDecimals={false}
                                    />
                                    <label htmlFor="salary_expectation">Expectativa salarial <span className="requeridField">*</span></label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="clearfix"></div>
                        <button type="submit" className="btn btn-success" disabled={loading ? true : ''}>{ loading ? <LoadingOutlined /> : null } Guardar cambios</button>
                        <button className="btn btn-default" onClick={ () => setEditing(false) }>Cancelar</button>
                    </form>
                }

            </div>
        </div>
    );
}
 
export default InfoProfessional;