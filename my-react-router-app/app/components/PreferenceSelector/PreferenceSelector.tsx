import { ArrowBigRight,ArrowBigDown } from 'lucide-react'
import React, { useState } from 'react'
import { useInternalCheckAuth } from '~/hooks/api_hook';
import { save_preferences } from '~/utils/Api/Api';


//define params type
interface PreferenceSelectorProps{
    user_preferences?:string[],
    setUserPreferencesList?: React.Dispatch<React.SetStateAction<string[]>>,
    added_prefernce?:string[],
    setAdded_preference?:React.Dispatch<React.SetStateAction<string[]>>
}
function PreferenceSelector({user_preferences,setUserPreferencesList,hasChanged}:PreferenceSelectorProps) {
// ["technology","sports","politics","science","education"]
// user_preferences coming from parent component of user_preference state
console.log('User Preferences in PreferenceSelector:',user_preferences);
    // State for checking the status of the component
    const [isExpanded,setIsExpanded]=useState<boolean>(false) 
    // States for saving preference result(error/success)
      const [error,setError]=useState<string|null>(null)
      const [success,setSuccess]=useState<string|null>(null)
    //  Custom callback function to be passsed for the HTTP POST method 
      let {api_fetch}=useInternalCheckAuth()

    function handleToggle(){
        setIsExpanded(!isExpanded)
    }
    // function to handle selecting fields
    function handleSelectPreference(e:React.ChangeEvent<HTMLInputElement>){
        const {value,checked}=e.target
        if(checked){
            // this for db update
            // setSelectedPreferences([...selectedPreferences,value])
            // this for preview list
            setUserPreferencesList?.((prevPreferences)=>[...prevPreferences,value])
        }else{
            // delete from current obj for db
            // setSelectedPreferences(selectedPreferences.filter(pref=>pref!==value))
            // delete from preview list
            setUserPreferencesList?.((prevPreferences)=>prevPreferences.filter(pref=>pref!==value))
        }
    }
    // define categories selectedPreferences filter or the obj from parent
    let categories:string[]=["Technology","Sports","Business","Science","Entertainment","Education"]
    // probably filter user_preferences_list [[or selectedPreferences]]
    function check_existing_preferences(current_category:string){
        // LowerCase all elements in user_preferences
        let lowercasepreferences=user_preferences?.map(item=>item.toLowerCase())
        let lowercaseitem=current_category.toLowerCase()
        return lowercasepreferences?.includes(lowercaseitem)
    }
  
    async function handleSave(){
        try{
            // make api call to save preferences
            const response=await save_preferences(user_preferences||[],api_fetch)
            if(response){
                setSuccess("Preferences saved successfully!")
                setTimeout(()=>{
                    setSuccess(null)
                },3000)
            }
        }catch(err){
            console.log(err)
            setError(err.message)
            setTimeout(()=>{
                setError(null)
            },3000)
        }
    }
  return (
    <div className='container'>
      <div className='header' onClick={handleToggle}>

        <ArrowBigDown className={`arrow ${!isExpanded&&"down_arrow__not_active"}`}/>
        <h3>Add Preference</h3>
      </div>
      {
        isExpanded&&(
            <div>
            <div className='preferences_list'>
                {
                    categories.map(category=>(
                        check_existing_preferences(category)?null:(
                            <div key={category} className='preference_item'>
                                <input type="checkbox" id={category} name={category} value={category} onChange={handleSelectPreference} checked={user_preferences?user_preferences.includes(category):false}/>
                                <label htmlFor={category} style={{textTransform:'capitalize',marginLeft:'0.5rem'}}>{category}</label>
                            </div>
                        )
                    ))
                }
         <div>
            {
                error&&(
                    <p className='error_message'>{error}</p>
                )

            }
            {
                 success&&(
                    <p className='success_message'>{success}</p>
                )
            }
            {
            hasChanged&&(
            <button type='submit' className='preference_btn' onClick={handleSave}> Save Preferences
            </button>
        )

      }
      </div>
      </div>
            </div>
             
        

      
            )
        
         

      }

     

    </div>
  )
}

export default PreferenceSelector
