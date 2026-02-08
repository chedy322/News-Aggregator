import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useUser } from '~/hooks/user_hooks'; 
// import { update_profile } from '~/utils/Api/user_api';
import { ThemeContext } from '~/utils/context';
import { User, Mail, Settings, Save, X, RotateCw } from 'lucide-react';
import { update_user_info, url } from '~/utils/Api/user';
import { useInternalCheckAuth } from '~/hooks/api_hook';



const EditProfile = () => {
    const { setting_user_data } = useContext(ThemeContext);
    const { loading, user_data, fetching_error } = useUser();
    const navigate = useNavigate();
    const {api_fetch}=useInternalCheckAuth()
   interface form_type{
    username:string|null;
    email:string|null;
    image:string|null;
   }
   let form_data={
    username:null,
    email:null,
    image:null,
   }
    
    const [formData, setFormData] = useState<form_type>(form_data);
    // state for showing the image
    const [FileUrl, setFileurl] = useState<string|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Ensure form data is initialized when user_data loads
    useEffect(() => {
        if (user_data) {
            setFormData({
                username: user_data.username,
                email:user_data.email,
                image:url+user_data.image,
            });
        }
    }, [user_data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };


    // handle image change value


  function handle_file_change() {
    let input=document.querySelector('.image-file')
  const files = input?.files;
  let original_photo=user_data.image
  //   delete prev selected photo
setFormData(prev=>({...prev,image:""}))
    if(files.length===0 || !files){
      setFormData(prev=>({...prev,image:url+original_photo}))
    }
  if (files && files.length > 0) {
    setFormData(prev=>({...prev,image:URL.createObjectURL(files[0])}))
    setFileurl(files[0])
   
  }
}
    const handleFormSubmit = async (e) => {
            e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsSubmitting(true);

    //     // Simple validation
    let fd=new FormData()
        if (!formData.username.trim()) {
            setMessage({ type: 'error', text: 'Username cannot be empty.' });
            setIsSubmitting(false);
            return;
        }

        try {
            fd.append("username",formData.username.trim())
            fd.append("email",formData.email)
            if(FileUrl){
                fd.append("image",FileUrl)
            }
            const result = await update_user_info(fd,api_fetch);
            if(result){
                setting_user_data({
                    role:user_data.role,
                    username:formData.username,
                    email:formData.email,
                })
                 setMessage({ type: 'success', text: 'Profile updated successfully! Redirecting...' });
                 setTimeout(() => {
                    navigate('/profile'); // Redirect back to the profile view
                }, 2000);

            } else {
                throw new Error("Update failed for an unknown reason.");
            }
        
        }catch(err){
            console.log(err)
             const errorText = err.message || "An unexpected error occurred during profile update.";
            setMessage({ type: 'error', text: errorText });
            
        }finally {
            setIsSubmitting(false);
        }

    //         const result = await update_user_info(payload);

    //         if (result.success) {
    //             // Update the context/global state with the new data
    //             set_user_data(result.new_data); 
    //             setMessage({ type: 'success', text: 'Profile updated successfully! Redirecting...' });
                
    //             setTimeout(() => {
    //                 navigate('/profile'); // Redirect back to the profile view
    //             }, 2000);
    //         } else {
    //             throw new Error("Update failed for an unknown reason.");
    //         }
    //     } catch (err) {
    //         const errorText = err.message || "An unexpected error occurred during profile update.";
    //         setMessage({ type: 'error', text: errorText });
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    };

    if (loading) {
        return <div className="loading-container"><h5>Loading profile for editing...</h5></div>;
    }
    if(!user_data){
        return <div className="error-container"><h6>Something went wrong!...</h6></div>
    }
    if (fetching_error) {
        return <div className="error-container"><h6>Error loading data: {fetching_error}</h6></div>;
    }

    return (
        <div className="edit-profile-container">
            <style>
                {`
                /* General Styles & Variables */
                :root {
                    --color-primary: #10b981; /* Changed primary color for a different feel */
                    --color-primary-dark: #059669;
                    --color-secondary: #f0fdf4; /* Light green background */
                    --color-text: #1f2937;
                    --color-light-text: #4b5563;
                    --color-border: #d1d5db;
                    --color-success: #10b981;
                    --color-error: #ef4444;
                    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
                }
                
                .edit-profile-container {
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem 1rem;
                    min-height: 100vh;
                    background-color: var(--color-secondary);
                }

                .edit-card {
                    width: 100%;
                    max-width: 600px;
                    background-color: white;
                    border-radius: 16px;
                    box-shadow: var(--shadow);
                    padding: 2.5rem;
                }

                .edit-card h2 {
                    text-align: center;
                    color: var(--color-primary-dark);
                    margin-bottom: 2rem;
                    font-size: 1.75rem;
                    border-bottom: 2px solid var(--color-border);
                    padding-bottom: 1rem;
                }

                /* --- Avatar Section --- */
                .avatar-upload-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .current-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid var(--color-primary);
                    margin-bottom: 0.75rem;
                }

                .email-display {
                    color: var(--color-light-text);
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    font-size: 0.9rem;
                }

                .email-display svg {
                    width: 16px;
                    height: 16px;
                    margin-right: 6px;
                }

                /* --- Form Elements --- */
                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    color: var(--color-text);
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .form-group label svg {
                    width: 18px;
                    height: 18px;
                    margin-right: 8px;
                    color: var(--color-primary);
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    font-size: 1rem;
                    color: var(--color-text);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-primary);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                }
                
                .form-group textarea {
                    min-height: 80px;
                    resize: vertical;
                }

                /* --- Buttons --- */
                .button-group {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    justify-content: space-between;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease-in-out;
                    width: 50%;
                }
                
                .btn svg {
                    margin-right: 8px;
                }

                .btn-primary {
                    background-color: var(--color-primary);
                    color: white;
                    border: 2px solid var(--color-primary);
                }
                
                .btn-primary:hover:not(:disabled) {
                    background-color: var(--color-primary-dark);
                    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
                    transform: translateY(-1px);
                }

                .btn-secondary {
                    background-color: white;
                    color: var(--color-light-text);
                    border: 2px solid var(--color-border);
                }
                
                .btn-secondary:hover:not(:disabled) {
                    background-color: var(--color-secondary);
                    color: var(--color-text);
                    transform: translateY(-1px);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* --- Messages --- */
                .message {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                    text-align: center;
                    width: 100%;
                    max-width: 600px;
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
                `}
            </style>

            <div className="message-container">
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="edit-card">
                <h2>Update Your Profile</h2>
                <form onSubmit={handleFormSubmit} enctype="multipart/form-data">
                <div className="avatar-upload-section">
                       <img 
                        src={formData.image || "https://placehold.co/120x120/D1D5DB/4B5563?text=N/A"} 
                        alt="User Avatar" 
                        className="current-avatar" 
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/D1D5DB/4B5563?text=N/A"; }}
                    />
                    <input type="file" 
                    className='image-file'
                    name='image'
                    onChange={handle_file_change}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/120x120/D1D5DB/4B5563?text=N/A"}
                }
                    />
                 
                    <div className="email-display">
                        <Mail /> {user_data.email}
                    </div>
                </div>

                
                    
                    <div className="form-group">
                        <label htmlFor="username">
                            <User /> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your new username"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">
                            <Mail /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your new Email"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="button-group">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/profile')}
                            disabled={isSubmitting}
                        >
                            <X />
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <RotateCw className="spinner" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;