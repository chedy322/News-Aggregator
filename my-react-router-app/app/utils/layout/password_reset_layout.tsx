import React, { useEffect, useState } from 'react';
import { Outlet, useParams, Navigate } from 'react-router'; // Using react-router-dom imports
import { token_checker } from '../Api/authentication'; // Assumed API function

// Spinner for the period when the token is being checked
const LoadingSpinner: React.FC = () => (
     <div style={{ padding: '50px', textAlign: 'center' }}>
        Authenticating...
    </div>
);

// Component for when the token check fails
const UnauthorizedView: React.FC = () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1 style={{fontSize:'20px'}}>Unauthorized</h1>
        <p>The password reset link is invalid, expired, or missing.</p>
    </div>
);

function Reset_password_layout() {
    const { id:token } = useParams(); 
    
    // State variables
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        console.log(token)
        // 2. Initial check for missing token in the URL path
        if (!token) {
            setIsLoading(false);
            return; // No token, stop here, component will render UnauthorizedView implicitly
        }

        const checking_token = async () => {
            try {
                // 3. CRITICAL SECURITY STEP: Server API call
                const response = await token_checker(token); 
                console.log(response)
                if (isMounted) {
                    // Assuming token_checker returns a truthy value on success
                    setIsAuthorized(!!response); 
                }
            } catch (err) {
                // 4. API call failed (e.g., 401, 404, expired token)
                if (isMounted) {
                    console.error('Token validation failed:', err);
                    setIsAuthorized(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        checking_token();

        // Cleanup function
        return () => {
            isMounted = false;
        };
        
    // 5. Only depend on the token value for stability
    }, [token]);

    // --- Render Flow ---

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return <UnauthorizedView />;
    }

    // If authorized is true, render the child component (the reset form)
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default Reset_password_layout;