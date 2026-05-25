import { useStateContext } from "../contexts/ContextProvider"
import SuperAdminRol from "../components/roles/SuperAdminRol"
import ClientRol from "../components/roles/ClientRol"
import ConsultorRol from "../components/roles/ConsultorRol"
import SoporteRol from "../components/roles/SoporteRol"
import LocalidadRol from "../components/roles/LocalidadRol"
import SubclienteRol from "../components/roles/SubclienteRol"
import PostulanteRol from "../components/roles/PostulanteRol"

const Account = () => {
    const { user } = useStateContext()

    return (
        <> 
            {/* SUPER ADMINISTRADOR */}
            {user.role_id === 1 && 
                <SuperAdminRol />
            }


            {/* CLIENTE */}
            {user.role_id === 2 && 
                <ClientRol />
            }


            {/* CONSULTOR */}
            {user.role_id === 3 && 
                <ConsultorRol />
            }


            {/* SOPORTE */}
            {user.role_id === 4 && 
                <SoporteRol />
            }

            {/* SUBCLIENTE */}
            {user.role_id === 5 && 
                <SubclienteRol />
            }


            {/* LOCALIDAD */}
            {user.role_id === 6 && 
                <LocalidadRol />
            }


            {user.role_id === 7 && 
                <PostulanteRol />
            }

        </>
    );
}
 
export default Account;