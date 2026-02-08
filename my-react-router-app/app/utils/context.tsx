import React, { createContext, useEffect, useState } from "react";
import { decrypt, encrypt } from "./helper";
import { useInternalCheckAuth } from "~/hooks/api_hook";
import { user_info } from "./Api/user";


// defining interfae for user_data
interface User_type {
    id: number;
    username: string;
    email: string;
    role: number;
}

// declaring interface for context type
interface context_type {
    userData: User_type|null;
    setting_user_data: (data: User_type | null) => void;
    authLoading:boolean;
}


export const ThemeContext = createContext<context_type | null>(null);

function Context_Theme({ children }: { children: React.ReactNode }) {
    const [authLoading, setAuthLoading] = useState(true);

    // 1Initialize state to null. This prevents the error during SSR.
    const [userData, setUserData] = useState<User_type | null>(()=>{
       try {
            const storedData = localStorage.getItem("user_data");
            if (storedData) {
                return JSON.parse(decrypt(storedData));
            }
        } catch (e) {
            console.error("Failed to parse user data from localStorage", e);
        }
        return null;
    });

    const {api_fetch}=useInternalCheckAuth()
    // Hook that will handle encrypting userdata whenever userData changes
    useEffect(() => {
        if (userData) {
            const encrypted_data = encrypt(JSON.stringify(userData));
            console.log("Saving encrypted user data...");
            localStorage.setItem("user_data", encrypted_data);
        } else {
            console.log("Removing user data from storage.");
            localStorage.removeItem("user_data");
        }

    }, [userData]);


    // Hook that handle Api Token Validation
    useEffect(()=>{
        let isMounted=true
        if(userData){
            async function syncUser(){
                try{
                    await user_info(api_fetch)
                }catch(err){
                    console.log(err)
                    if(isMounted){
                        setUserData(null)
                    }
                }
            }
            syncUser()
        }
        if(isMounted){
            setAuthLoading(false)
        }
        return ()=>{isMounted=false}
    },[api_fetch])

    // Setter Function to set UserData (after login,logout,etc...) 
    function setting_user_data(user_data: User_type | null) {
        setUserData(user_data);
    }

    return (
        <ThemeContext.Provider value={{ userData, setting_user_data,authLoading }}>
            {/* You may choose to show a loading screen here if !isReady */}
            {children}
        </ThemeContext.Provider>
    );
}

export default Context_Theme;