import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    refreshData: null,
    notification: null,
    complements: [],
    cities: [],
    setUser: () => {},
    setToken: () => {},
    setRefreshData: () => {},
    setNotification: () => {},
    setComplements: () => {},
    setCities: () => {}
})


export const ContextProvider = ({children}) => {
    const [refreshData, setRefreshData] = useState(null)
    const [user, setUser] = useState({})
    const [complements, setComplements] = useState({})
    const [cities, setCities] = useState({})
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN_ENTE'))
    const [notification, _setNotification] = useState('')

    const setToken = (token) => {
        _setToken(token)

        if( token ){
            localStorage.setItem('ACCESS_TOKEN_ENTE', token)
        }else{
            localStorage.removeItem('ACCESS_TOKEN_ENTE')
        }
    }

    const setNotification = message => {
        _setNotification(message)

        setTimeout(() => {
            _setNotification('')
        }, 5000);
    }

    return(
        <StateContext.Provider value={{
            user,
            token,
            refreshData,
            notification,
            complements,
            cities,
            setUser,
            setToken,
            setRefreshData,
            setNotification,
            setComplements,
            setCities
        }}>
            {children}
        </StateContext.Provider>
    )
}
 
export const useStateContext = () => useContext(StateContext);