import { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const MyAppliedJobs = () => {
    const { user } = useStateContext()

    return (
        <div className="block">
            <h3>Listado de vacantes aplicadas</h3>
            <div className="content">

                <table className="table table-hover recordList">
                    <thead>
                        <tr>
                            <td></td>
                            <td>FECHA</td>
                            <td>PUESTO</td>
                            <td>CALLCENTER</td>
                            <td>STATUS</td>
                        </tr>
                    </thead>
                    <tbody>
                        {user.applications.length === 0 ?
                            <tr>
                                <td colSpan={8} className="text-center p-3">No hay solicitudes a vacantes disponibles.</td>
                            </tr>
                        :null}
                        
                        {user.applications.length > 0 && user.applications.map( (row, i) => (
                            <tr key={row.id}>
                                <td>{i+1}</td>
                                <td>{row.created_at}</td>
                                <td>{row.vacant?.title}</td>
                                <td>
                                    {row.vacant?.confidential === 1 ? 'Confidencial' : row.locality?.name}
                                </td>
                                <td>{row.status ? row.status.status : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}
 
export default MyAppliedJobs;