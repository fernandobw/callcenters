import { SafetyOutlined, LoadingOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { createRef, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Attachments = ({profileToView}) => {
    const [validationError, setValidationError] = useState({})
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setNotification, setRefreshData} = useStateContext()

    const [attachedFile, setAttachedFile] = useState()
    const onFileChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setAttachedFile(reader.result)
        };
        reader.readAsDataURL(file);
    };

    const refCloseAnexoModal = useRef()

    const refTitle = createRef()
    const refPrivate = createRef()
    const refFile = createRef()
    const refRemark = createRef()

    const onSubmit = ev => {
        ev.preventDefault()
        setSaving(true)
        const payload = {
            title: refTitle.current.value,
            private: refPrivate.current.value,
            file: attachedFile,
            remark: refRemark.current.value,
            application_id: profileToView.id
        }

        axiosClient.post(`/attachments`, payload).then( () =>{
            setSaving(false)
            setNotification('Anexo agregado satisfactoriamente.')
            setRefreshData(Math.random())
            refCloseAnexoModal.current.click();
            ev.target.reset()
        }).catch( err => {
            setSaving(false)
            const response = err.response;
            if( response && response.status === 422){
                setValidationError(response.data.errors)
            }else{
                console.log(err)
            }

        })

    }


    // Delete Anexo
    const deleteAnexo = (id) => {
        setLoading(true)
        axiosClient.delete(`/attachments/${id}`).then( () => {
            setLoading(false)
            setRefreshData(Math.random())
            setNotification('El anexo ha sido eliminado satisfactoriamente.')
            refCloseAnexoModal.current.click();
        }).catch( err => {
            setLoading(false)
            console.log(err.response);
        })
    }


    return (<>
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="anexoModalLabel">
                <strong>ANEXO A SOLICITUD: </strong>
                <small>{profileToView?.user?.fname} {profileToView?.user?.lname}</small>
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={refCloseAnexoModal} />
        </div>

        <form onSubmit={onSubmit} className="formSwitchStatus">
            <div className="modal-body">
            <div className="row g-2">
                <div className="col-8">
                    <div className="form-floating">
                        <input type="text" ref={refTitle} placeholder="Nombre del anexo" className="form-control"/>
                        <label htmlFor="title">Nombre del anexo 
                        { validationError.title ? <span className="tip-warning">* {validationError.title[0]}</span> : null }
                        </label>
                    </div>
                </div>
                <div className="col-6 d-none">
                    <div className="form-floating">
                        <select type="text" ref={refPrivate} required="required" placeholder="¿Notificar al postulante?" className="form-control">
                            <option value="1">No</option>
                            <option value="0">Si</option>
                        </select>
                        <label htmlFor="private">¿Notificar al postulante?</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-floating">
                        <input type="file" ref={refFile} onChange={onFileChoose} className="fileAvatar" accept="application/pdf, image/png, image/jpg"/>
                        <small>{ validationError.file ? <span className="tip-warning">* {validationError.file[0]}</span> : null }</small>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-floating">
                        <textarea type="text" ref={refRemark}  placeholder="Nota importante" className="form-control"></textarea>
                        <label htmlFor="remark">Nota importante 
                        { validationError.remark ? <span className="tip-warning">* {validationError.remark[0]}</span> : null }
                        </label>
                    </div>
                </div>
            </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving ? true : ''}>
                    { saving ? <LoadingOutlined /> : <SafetyOutlined /> } Guardar anexo
                </button>
            </div>
        </form>

        <hr />

        {loading && <>
            Cargando...
        </>}

        <article className="p-4">
            {profileToView?.attachments?.length > 0 && profileToView?.attachments.map( (att, i) => (
            <div className="row" key={i}>
                <div className="col-1">
                    <Link target="_blank" className="ctaActions"
                        to={`${import.meta.env.VITE_API_BASE_URL}/${att.file}`}
                    ><DownloadOutlined /></Link>
                </div>
                <div className="col-3">
                {att.title}</div>
                <div className="col-6"><small>{att.remark}</small></div>
                <div className="col-2 text-end">
                    <button 
                        className="ctaActions ctaDelete"
                        title="ELIMINAR ANEXO"
                        onClick={ () => Swal.fire({
                                        title: '¿Deseas eliminar este anexo?',
                                        'icon' : 'question',
                                        'showCancelButton': 'true',
                                        'cancelButtonText' : 'Cancelar',
                                        'confirmButtonText' : 'SI, Eliminar'
                                    }).then( (result) => {
                                        if( result.isConfirmed){
                                            deleteAnexo(att.id)
                                        }
                                    })
                                }
                    ><DeleteOutlined /></button>
                </div>
                <div className="col-12"><hr /></div>
            </div>
            ))}
        </article>
    </>);
}
 
export default Attachments;