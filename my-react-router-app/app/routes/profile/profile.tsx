import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Settings, LogOut, Lock, Bookmark, X } from 'lucide-react';
import { logout } from '~/utils/Api/authentication';
import { useUser } from '~/hooks/user_hooks';
import { ThemeContext } from '~/utils/context';
import PreferenceSelector from '~/components/PreferenceSelector/PreferenceSelector';


const Profile = () => {
  const {setting_user_data}=useContext(ThemeContext)
  const [error,setError]=useState<string|null>(null)
  const [success,setSuccess]=useState<string|null>(null)
  const navigate=useNavigate()
  const {loading,user_data,fetching_error}=useUser()
//   this state for showing existing prefernces and adding new selected prefernces even  before adding to db
const [user_preferences_list,setUserPreferencesList]=useState<string[]>([])

useEffect(()=>{
    setUserPreferencesList(user_data?.preferences||[])
    // deleted setUserPreferencesList ffrom array params so we odn't have inficnnet loop
},[user_data])

  async function handle_logout(){

    try{

      const result=await logout()
      if(result){
        setSuccess("Logged out successully,Redirecting...")
       setTimeout(() => {
        setting_user_data(null); 
        setSuccess(null);
        navigate("/login", { replace: true });
      }, 3000);
    }

    }catch(err){

      const message = err?.message || "An unexpected error occurred during reset.";

      setError(message)

      setTimeout(()=>{
          setError(null)
        },3000)

    }
  }


    const handle_password_reset = async () => {
        navigate('/request_password_reset');
    };

    const handle_update_profile = () => {
        // Assume this navigates to an edit page
        navigate('/edit_profile')
    };

    const handle_saved_articles = () => {
        // Assume this navigates to a saved articles list
        navigate('/bookmarks');
    };
    // fix this feature
// this function for deleting preference from preview list when user removes it from PreferenceSelector
    function remove_preference_from_list(removed_preference:string){
        // we take exisitng user_preferences_list and we filter out the removed preference 
        setUserPreferencesList(prev=>prev.filter(pref=>pref!==removed_preference))
    }
    //create state to check if any mmodification to original array has been made
    let hasChanged=useMemo(()=>{
        // compare user_data.preferences with user_preferences_list
       if (!user_data) return false;
    // Create copies and sort them to guarantee deterministic order
    const current = [...user_preferences_list].sort();
    const original = [...(user_data.preferences || [])].sort();
    
    //Compare the resulting strings. If they are different, the content changed.
    return JSON.stringify(current) !== JSON.stringify(original);
    },[user_data,user_preferences_list])

    // UpperCase the first char of text
    function UpperChar(text:string):string{
        text=text.charAt(0).toUpperCase()+text.slice(1)
        return text
    }
    
    // --- Loading and Error States ---
    if (loading) {
        return <div className="loading-container"><h5>Loading user data...</h5></div>;
    }

    if (fetching_error) {
        return <div className="error-container"><h6>Error: {fetching_error}</h6></div>;
    }

    // --- Component Rendering ---
    return (
        <div className="profile-container">
            <style>
                {`
                /* General Styles & Variables */
                :root {
                    --color-primary: #4f46e5;
                    --color-secondary: #f3f4f6;
                    --color-text: #1f2937;
                    --color-light-text: #4b5563;
                    --color-border: #e5e7eb;
                    --color-success: #10b981;
                    --color-error: #ef4444;
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
                }
                
                .profile-container {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    justify-content: center;
                    padding: 2rem 1rem;
                    min-height: 100vh;
                    background-color: var(--color-secondary);
                }

                .profile-card {
                    width: 100%;
                    max-width: 800px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: var(--shadow);
                    padding: 2rem;
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: 1fr; /* Default mobile layout */
                }

                @media (min-width: 768px) {
                    .profile-card {
                        grid-template-columns: 2fr 1fr; /* Desktop layout: Info on left, Actions on right */
                    }
                }

                /* --- Header/Info Section --- */
                .profile-info {
                    border-right: none;
                    padding-right: 0;
                }

                @media (min-width: 768px) {
                    .profile-info {
                        border-right: 1px solid var(--color-border);
                        padding-right: 2rem;
                    }
                }

                .avatar-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 1.5rem;
                }

                .avatar {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid var(--color-primary);
                    margin-right: 1.5rem;
                }

                .user-details h3 {
                    margin: 0;
                    color: var(--color-text);
                    font-size: 1.5rem;
                }
                
                .user-details p {
                    margin: 0.25rem 0 0;
                    color: var(--color-light-text);
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }

                .user-details svg {
                    width: 14px;
                    height: 14px;
                    margin-right: 5px;
                }

                /* --- Preferences Section --- */
                .preferences-section {
                    margin-top: 1.5rem;
                }

                .preferences-section h4 {
                    font-size: 1.1rem;
                    color: var(--color-text);
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                }
                
                .preferences-section svg {
                    width: 18px;
                    height: 18px;
                    margin-right: 8px;
                    color: var(--color-primary);
                }

                .preference-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                    .preference_icon{
                    background-color: var(--color-primary);
                    color: white;
                    padding: 0.3rem 0.75rem;
                    border-radius: 9999px;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    flex_direction: row;
                    }
                    .x_btn{
                    size:16px;
                    background-color:var(--color-secondary);
                    margin-right:0.5rem;
                    cursor:pointer;
                    border-radius:50%;
                    }

                .preference-tag {
                    font-size: 0.8rem;
                    font-weight: 500;
                    
                }
                
                .preference-tag:hover {
                    background-color: #3730a3;
                }
                
                .no-preferences {
                    color: var(--color-error);
                    font-style: italic;
                    font-size: 0.9rem;
                    padding: 0.3rem 0.5rem;
                }

                /* --- Actions Section --- */
                .actions-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding-left: 0;
                    padding-top: 1rem;
                }

                @media (min-width: 768px) {
                    .actions-section {
                        padding-left: 2rem;
                        padding-top: 0;
                    }
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 1rem;
                    background-color: var(--color-secondary);
                    color: var(--color-text);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    width: 100%;
                    text-align: left;
                }

                .action-button svg {
                    width: 20px;
                    height: 20px;
                    margin-right: 12px;
                }
                
                .action-button:hover {
                    background-color: var(--color-primary);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
                }

                .action-button.logout {
                    background-color: var(--color-error);
                    color: white;
                    border-color: var(--color-error);
                    margin-top: 1rem;
                }
                
                .action-button.logout:hover {
                    background-color: #b91c1c;
                    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
                }

                /* --- Messages --- */
                .message {
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    font-weight: 600;
                    text-align: center;
                    width: 100%;
                    max-width: 800px;
                }

                .success {
                    background-color: #d1fae5;
                    color: var(--color-success);
                    border: 1px solid var(--color-success);
                }

                .error {
                    background-color: #fee2e2;
                    color: var(--color-error);
                    border: 1px solid var(--color-error);
                }
                    .header{
                        display:flex;
                flex-direction:row;
                align-items:center;
                background-color:#f0f0f0;
                cursor:pointer;
                font-size:1rem;
                    }
                .header h3{
                font-size: 1.1rem;
                    color: var(--color-text);
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                    }
                .arrow{
                size:16px;
                margin-right:0.5rem;
                display: block; 
    transition: all 0.3s ease-in-out; 
                }
    .arrow.down_arrow__not_active {
    transform: rotate(-90deg); /* Rotate the icon 90 degrees */
                }
    .container{
    margin-top:1rem;
    max-width:600px;
    max_height:400px;
    transition: max-height 0.3s ease-in-out;
    }
    .preference_btn{
    margin-top:1rem;
    padding:0.5rem 1rem;
    background-color:var(--color-primary);
    color:white;
    border:none;
    border-radius:6px;
    cursor:pointer;
    font-weight:600;
    }
   
}

                `}
            </style>

            <div className="profile-card">
                {/* 1. User Information Column */}
                <div className="profile-info">
                    
                    {/* Header: Avatar, Username, Email */}
                    <div className="avatar-header">
                        <img 
                            src={user_data?.image|| "https://placehold.co/90x90/D1D5DB/4B5563?text=N/A"} 
                            alt={`${user_data?.username}'s avatar`} 
                            className="avatar" 
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/90x90/D1D5DB/4B5563?text=N/A"; }}
                        />
                        <div className="user-details">
                            <h3>{user_data?.username}</h3>
                            <p><Mail size={14} />{user_data?.email}</p>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="preferences-section">
                        <h4><Settings />Your Preferences</h4>
                        <div className="preference-list">
                            {user_preferences_list && user_preferences_list.length>0?
                             (
                                user_preferences_list.map((p, index) => (
                                    <div className='preference_icon'>
                                    <X className='x_btn' onClick={() => remove_preference_from_list(p)}/>
                                    <span key={index} className="preference-tag">
                                        {UpperChar(p)}
                                    </span>
                                    </div>
                                ))
                            ) : (
                                <span className="no-preferences">
                                    No preferences selected yet.
                                </span>
                            )}
                        </div>
                        <div>
                            {/* <h3 style={{marginTop:'1rem'}}>Add Preference</h3> */}
                            {/* here i preplaced the userdata_.pref by this param */}
                            <PreferenceSelector 
                            user_preferences={user_preferences_list} 
                            setUserPreferencesList={setUserPreferencesList}
                            hasChanged={hasChanged}
                            />
                            

                        </div>
                    </div>

                    {/* Saved Articles Link */}
                    <button 
                        className="action-button saved-articles-link"
                        onClick={handle_saved_articles}
                        style={{ marginTop: '2rem' }}
                    >
                        <Bookmark />
                        View Saved Articles ({user_data.saved_articles_count || 0})
                    </button>
                </div>
                

                {/* 2. Actions Column */}
                <div className="actions-section">
                    
                    <h3>Account Actions</h3>
                    
                    <button 
                        className="action-button"
                        onClick={handle_update_profile}
                    >
                        <User />
                        Update Profile Info
                    </button>
                    
                    <button 
                        className="action-button"
                        onClick={handle_password_reset}
                    >
                        <Lock />
                        Reset Password
                    </button>

                    <button 
                        className="action-button logout"
                        onClick={handle_logout}
                    >
                        <LogOut />
                        Sign Out
                    </button>
                     {(error || success) && (
                <div className={`message ${error ? 'error' : 'success'}`}>
                    {error || success}
                </div>
            )}
            
                </div>
            </div>
        </div>
    );
}

export default Profile;