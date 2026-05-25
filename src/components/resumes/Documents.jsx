import { createRef, useState } from "react";
import Swal   from 'sweetalert2';
import { isSafari, isFirefox } from "react-device-detect";
import { useStateContext } from "../../contexts/ContextProvider";
import ctaAddIcon from '../../assets/images/cta_add.svg';
import { LoadingOutlined, DownloadOutlined } from '@ant-design/icons';
import Datetime from 'react-datetime';
import axiosClient from "../../axios-client";

const Documents = () => {
    const [addingDocs, setAddingDocs] = useState(false)
    const {user, setNotification, setRefreshData, complements} = useStateContext()
    const [ validationError, setValidationError ] = useState([])
    const [attachedFile, setAttachedFile] = useState()
    const [ saving, setSaving ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const titleRef = createRef()
    const docTypeRef = createRef()

    const onFileChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setAttachedFile(reader.result)
        };
        reader.readAsDataURL(file);
    };


    const onSubmit = (ev) => {
        ev.preventDefault()

        setLoading(true)
        setSaving(true)

        const payload = {
            title: titleRef.current.value,
            doc_type: docTypeRef.current.value,
            resume_id: user.resume.id,
            file: attachedFile
        }

        axiosClient.post(`/documents`, payload).then( ({data}) => {
            setSaving(false)
            setLoading(false)
            setValidationError(null)
            setRefreshData(Math.random())
            setNotification('Ha subido el archivo exitosamente.')
            setAddingDocs(false)

        }).catch( err => {
            setLoading(false)
            setSaving(false)
            const response = err.response
            if( response && response.status === 422){
                setValidationError(response.data.errors)
                // console.log(response.data.errors);
            }else{
                // console.log(response.data);
                if(response.data.message === 'invalid image type'){
                    Swal.fire({
                        title: 'Solo se permiten PDF, JPG, PNG',
                        icon: 'info',
                    })
                }
            }
        })
    }

    const deleteDocument = (id) => {
        setSaving(true)

        axiosClient.delete(`/documents/${id}`).then(({data}) => {

            setSaving(false)
            setRefreshData(Math.random())
            setNotification('Ha sido eliminado satisfactoriamente.')

        }).catch( err => {
            setSaving(false)
            const response = err.response
            console.log(response.data);
        })
    }


    return (
        <div className="block wrapDocuments">
            <h3>Documentos <span className="requeridField">*</span></h3>
        
            <div className="content">
                {user.resume?.certifications.map( (row, i) => (
                    <div className="item-row d-flex" key={row.id}>
                        <a href={`${import.meta.env.VITE_STATIC_URL}/${row.file}`} target="_blank" rel="noreferrer"><DownloadOutlined className="p-2" /></a>
                        <div className="p-2">
                            <button className="ctaAction"
                                onClick={ () => Swal.fire({
                                            title: '¿Está seguro que desea eliminarlo?',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            cancelButtonText: "Cancelar",
                                            confirmButtonText: '¡Si, elimínalo!'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                deleteDocument( row.id );
                                            }
                                        })
                                    }
                            >Eliminar</button>
                            <h4><a href={`${import.meta.env.VITE_STATIC_URL}/${row.file}`} target="_blank" rel="noreferrer">{row.doc_type +': ' + row.title}</a></h4>
                        </div>
                    </div>
                ))}

                {addingDocs ?
                    <form onSubmit={onSubmit} className="formAddEducation" onChange={()=>setValidationError([])}>
                        <div className="row g-2">
                            <div className="col-12">
                                <hr/>
                                <h2>Añadir documento</h2>
                            </div>
                            <div className="col-12">
                                <div className="form-floating">
                                    <input type="text" ref={titleRef} placeholder="Título del archivo" className="form-control" />
                                    <label htmlFor="title">Título del archivo { validationError && validationError.title ? <span className="tip-warning">* {validationError.title[0]}</span> : null }</label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-floating">
                                    <label htmlFor="doc_type">Tipo de documento:</label>
                                    <select className="form-control" id="doc_type" ref={docTypeRef}  defaultValue={user.resume && user.resume.doc_type}>
                                        <option value="">Seleccione</option>
                                        {complements && complements.filter(it => (it.type === 'doc_type')).map( itm => (
                                            <option value={itm.title} key={itm.id}>{itm.title === 'Currículum' ? '*' : null} {itm.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-floating">
                                    <input type="file" name="file" className="form-control" onChange={onFileChoose}  />
                                    <label htmlFor="file">Seleccione el archivo { validationError && validationError.file ? <span className="tip-warning">* {validationError.file[0]}</span> : null }</label>
                                </div>
                            </div>
                        
                            <div className="col-6">
                                <button type="submit" className="btn btn-success btnAddEduc" disabled={saving ? true : ''}>{ saving ? <LoadingOutlined /> : null } Agregar</button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-default btnCancelar" onClick={ () => setAddingDocs(false) }>Cancelar</button>
                            </div>
                        </div>

                    </form>
                :
                    <img src={ctaAddIcon} alt="Add" className="ctaAddIcon"
                        onClick={ () => setAddingDocs(true) }
                    />
                }
            </div>
        </div>
    );
}
 
export default Documents;