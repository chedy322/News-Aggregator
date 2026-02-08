import React, { useContext, useEffect, useState } from 'react';

import Nav from '~/components/Nav/Nav';
import { ThemeContext } from '../context';
import { Navigate, Outlet,useNavigate } from 'react-router';
import { user_info } from '../Api/user';


// Define a simple loading component for better UX
const LoadingSpinner: React.FC = () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
        Authenticating...
    </div>
);

function Auth_layout() {
    const {userData,authLoading} = useContext(ThemeContext);

   
    if (authLoading){
        return <LoadingSpinner/>
    }
    if(!userData){
        return <Navigate to='login' replace/>
    }

    // 5. RENDERING
    return (
        <div>
            <Nav/>
            <Outlet />
        </div>
    );
}

export default Auth_layout;