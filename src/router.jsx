import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from './views/Login.jsx';
import Signup from './views/Signup.jsx';
import Forgot from './views/Forgot.jsx';
import NotFound from './views/NotFound.jsx';
import Account from './views/Account.jsx';
import Vacants from './views/Vacants.jsx';
import GuestLayout from "./layouts/GuestLayout.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import AccountLayout from "./layouts/AccountLayout.jsx";
import VacantDetail from "./views/VacantDetail.jsx";
import SecureLayout from "./layouts/SecureLayout.jsx";
import UserForm from "./components/backoffice/UserForm.jsx";
import PrintLayout from "./layouts/PrintLayout.jsx";
import ResumePrint from "./views/ResumePrint.jsx";
import ClientForm from "./components/backoffice/ClientForm.jsx";
import ClientDetail from "./components/backoffice/ClientDetail.jsx";
import LocalityDetail from "./components/backoffice/LocalityDetail.jsx";
import LocalityForm from "./components/backoffice/LocalityForm.jsx";
import VacanciesForm from "./components/backoffice/VacanciesForm.jsx";
import VacanciesDetail from "./components/backoffice/VacanciesDetail.jsx";
import Questions from "./components/backoffice/Questions.jsx";
import RequestsList from "./components/backoffice/RequestsList.jsx";
import ResetPassword from "./views/ResetPassword.jsx";
import ChangePassword from "./views/ChangePassword.jsx";


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/vacantes" />
            },
            {
                path: '/vacantes',
                element: <Vacants />
            },
            {
                path: '/vacante/:id/:slug',
                element: <VacantDetail />
            }
        ]
    },
    {
        path: '/',
        element: <SecureLayout />,
        // children: [
        //     {
        //         path: '/vacante/:id/:slug/aplicar',
        //         element: <VacantAplicar />
        //     }
        // ]
    },
    {
        path: '/',
        element: <AccountLayout />,
        children: [
            {
                path: '/account',
                element: <Navigate to={'/account/users'} />
            },
            {
                path: '/account/users',
                element: <Account />
            },
            {
                path: '/account/postulants',
                element: <Account />
            },
            {
                path: '/account/clients',
                element: <Account />
            },
            {
                path: '/account/localities',
                element: <Account />
            },
            {
                path: '/account/locality/:id',
                element: <LocalityDetail key="localityView" />
            },
            {
                path: '/account/locality/:id/edit',
                element: <LocalityForm key="localityUpdate" />
            },
            {
                path: '/account/locality/create',
                element: <LocalityForm key="localityCreate" />
            },
            {
                path: '/account/vacancies',
                element: <Account />
            },
            {
                path: '/account/vacant/:id',
                element: <VacanciesDetail key="vacanciesView" />
            },
            {
                path: '/account/vacant/:id/questions',
                element: <Questions />
            },
            {
                path: '/account/vacancies/create',
                element: <VacanciesForm key="vacanciesCreate" />
            },
            {
                path: '/account/vacancies/:id/edit',
                element: <VacanciesForm key="vacanciesUpdate" />
            },
            {
                path: '/account/requests',
                element: <Account />
            },
            {
                path: '/account/requests/:id',
                element: <RequestsList />
            },
            {
                path: '/account/profile',
                element: <ChangePassword />
            },
            {
                path: '/account/user/:id/edit',
                element: <UserForm key="userUpdate" />
            },
            {
                path: '/account/user/create',
                element: <UserForm key="userCreate" />
            },
            {
                path: '/account/client/:id',
                element: <ClientDetail key="clientView" />
            },
            {
                path: '/account/client/:id/edit',
                element: <ClientForm key="clientUpdate" />
            },
            {
                path: '/account/client/create',
                element: <ClientForm key="clientCreate" />
            }
        ]
    },
    {
        path: '/',
        element: <PrintLayout />,
        children: [
            {
                path: '/account/user/:id/resume',
                element: <ResumePrint />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/forgot',
                element: <Forgot />
            },
            {
                path: '/reset-password/:token',
                element: <ResetPassword />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])
 
export default router;