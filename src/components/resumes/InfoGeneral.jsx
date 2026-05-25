import { createRef, useState } from "react";
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";

const InfoGeneral = () => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const {user, setNotification, setRefreshData, complements, cities} = useStateContext()

    const genderRef = createRef()
    const birthdayRef = createRef()
    const occupationRef = createRef()
    const cedulaOrPassportRef = createRef()
    const phoneRef = createRef()
    const cellphoneRef = createRef()
    const publicEmailRef = createRef()
    const cityRef = createRef()
    const addressRef = createRef()
    const lastGradeRef = createRef()
    const civilStatusRef = createRef()


    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            gender: genderRef.current.value,
            birthday: birthdayRef.current.value,
            occupation: occupationRef.current.value,
            // cedula_or_passport: cedulaOrPassportRef.current.value,
            phone: phoneRef.current.value,
            cellphone: cellphoneRef.current.value,
            public_email: publicEmailRef.current.value,
            city: cityRef.current.value,
            address: addressRef.current.value,
            last_grade: lastGradeRef.current.value,
            civil_status: civilStatusRef.current.value
        }

        axiosClient.put(`/resume/${user.resume && user.resume.id}`, payload).then( ({data}) => {
            // console.log(data);
            setValidationError(null)
            setRefreshData(Math.random())
            setNotification('Se han guardado los cambios exitosamente.')
            setEditing(false)

        }).catch( err => {
            setLoading(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
                console.log(response.data.errors);
            }else{
                console.log(response.data);
            }
        })
    }


    return (
        <div className="block general">
        <h3>Información general

            <button className="btnEditCTA"
                onClick={ () => setEditing(true) }
            ><EditOutlined /></button>
        </h3>
        <div className="content">
            { !editing ?
                <table className="table" onDoubleClick={ () => setEditing(true) }>
                    <tbody>
                        <tr>
                            <td>Ciudad</td>
                            <td>{user.resume && user.resume.city?.city}</td>
                        </tr>
                        <tr>
                            <td>Género </td>
                            <td>{user.resume && user.resume.gender}</td>
                        </tr>
                        <tr>
                            <td>Edad</td>
                            <td>{user.resume && user.resume.age}</td>
                        </tr>
                        {/* <tr>
                            <td>Cédula <span className="requeridField">*</span></td>
                            <td>{user.resume && user.resume.cedula_or_passport}</td>
                        </tr> */}
                        <tr>
                            <td>Teléfono</td>
                            <td>{user.resume && user.resume.phone}</td>
                        </tr>
                        <tr>
                            <td>Celular <span className="requeridField">*</span></td>
                            <td>{user.resume && user.resume.cellphone}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{user.resume && user.resume.public_email}</td>
                        </tr>
                    </tbody>
                </table>
            : 
                <form onSubmit={onSubmit}>
                    <div className="row g-1">
                        <div className="col-12">
                            <div className="form-floating">
                                <select ref={genderRef} className="form-control" defaultValue={user.resume && user.resume.gender}>
                                <option value="">Seleccione</option>
                                {complements && complements.filter(it => (it.type === 'gender')).map( itm => (
                                    <option value={itm.title} key={itm.id}>{itm.title}</option>
                                ))}
                            </select>
                                <label htmlFor="gender">Género</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <input ref={birthdayRef} type="date" className="form-control" defaultValue={user.resume && user.resume.birthday} />
                                <label htmlFor="birthday">Fecha de nacimiento <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <input ref={occupationRef} type="text" className="form-control" placeholder="Última ocupación" defaultValue={user.resume && user.resume.occupation} />
                                <label htmlFor="occupation">Última ocupación <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        {/* <div className="col-12">
                            <div className="form-floating">
                                <input ref={cedulaOrPassportRef} type="text" className="form-control" placeholder="Cédula o pasaporte" defaultValue={user.resume && user.resume.cedula_or_passport} />
                                <label htmlFor="cedula_or_passport">Cédula o pasaporte <span className="requeridField">*</span></label>
                            </div>
                        </div> */}
                        <div className="col-6">
                            <div className="form-floating">
                                <input ref={phoneRef} type="tel" className="form-control" placeholder="Teléfono" defaultValue={user.resume && user.resume.phone} />
                                <label htmlFor="phone">Teléfono</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                                <input ref={cellphoneRef} type="tel" className="form-control" placeholder="Celular" defaultValue={user.resume && user.resume.cellphone} />
                                <label htmlFor="cellphone">Celular <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <input ref={publicEmailRef} type="email" className="form-control" placeholder="Email público" defaultValue={user.resume && user.resume.public_email} />
                                <label htmlFor="public_email">Email público</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <input ref={addressRef} type="text" className="form-control" placeholder="Sector donde vives" defaultValue={user.resume && user.resume.address} />
                                <label htmlFor="address">Sector donde vives <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <select ref={cityRef} className="form-control" defaultValue={user.resume.city && user.resume.city.id}>
                                    <option value="">Seleccione</option>
                                    {cities && cities.map( ciudad => (
                                        <option value={ciudad.id} key={ciudad.id}>{ciudad.city}</option>
                                    ))}
                                </select>
                                <label htmlFor="city">Ciudad <span className="requeridField">*</span></label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                <select ref={civilStatusRef} className="form-control" defaultValue={user.resume && user.resume.civil_status}>
                                    <option value="">Seleccione</option>
                                    {complements && complements.filter(it => (it.type === 'civil_status')).map( itm => (
                                        <option value={itm.title} key={itm.id}>{itm.title}</option>
                                    ))}
                                </select>
                                <label htmlFor="civil_status">Estado civil</label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating">
                                    <select ref={lastGradeRef} className="form-control"  defaultValue={user.resume && user.resume.last_grade}>
                                        <option value="">Seleccione</option>
                                        {complements && complements.filter(it => (it.type === 'last_grade')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="last_grade">Último grado cursado <span className="requeridField">*</span></label>
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
 
export default InfoGeneral;