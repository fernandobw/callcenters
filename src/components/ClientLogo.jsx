import { useStateContext } from "../contexts/ContextProvider";
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from "react";
import axiosClient from "../axios-client";
import Swal   from 'sweetalert2';

const ClientLogo = ({theClient}) => {
    const { setNotification, setRefreshData } = useStateContext()
    const [uploading, setUploading] = useState(false)
    const [attachedFile, setAttachedFile] = useState()

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

        setUploading(true)

        const payload = {
            logo: attachedFile,
            id: theClient.id
        }

        axiosClient.put(`/clients/${theClient.id}`, payload).then( ({data}) => {
            setUploading(false)
            setRefreshData(Math.random())
            setNotification('La imagen ha sido subida satisfactoriamente.')
        }).catch(err => {
            setUploading(false)
            console.log(err.response)
        })
    }


    const deletePhoto = (id) => {
        setUploading(true)

        const payload = {
            logo: null,
            id: theClient.id,
            deletePhoto: true
        }

        axiosClient.put(`/clients/${theClient.id}`, payload).then( ({data}) => {
            setUploading(false)
            setRefreshData(Math.random())
            setNotification('La imagen ha sido eliminada satisfactoriamente.')
        }).catch(err => {
            setUploading(false)
            console.log(err.response)
        })
    }

    return (<>
        {theClient.logo &&
        <>
            <button title="Eliminar logo" className="ctaDeleteAvatar"
                onClick={ () => Swal.fire({
                        title: '¿Está seguro que desea eliminarlo?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: "Cancelar",
                        confirmButtonText: '¡Si, eliminarla!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deletePhoto( theClient.id );
                        }
                    })
                }
            ><DeleteOutlined /></button>
            <img src={import.meta.env.VITE_STATIC_URL + theClient.logo} alt={theClient.client_name} className="img-fluid d-block logoLoggedIn rounded" />
        </>
        }

        {!theClient.logo &&
        <form onSubmit={onSubmit} className="formAddAvatar">
            <br />
            <input type="file" className="fileAvatar" 
                accept="image/png, image/jpg, image/jpeg" 
                onChange={onFileChoose} 
            />
            <button type="submit" className="btn btn-success btnAddEduc" disabled={uploading ? true : ''}>{ uploading ? <LoadingOutlined /> : null } Aplicar</button>
        </form>
        }
    </>);
}
 
export default ClientLogo;