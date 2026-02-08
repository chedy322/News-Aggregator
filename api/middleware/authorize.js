const AppError = require("../src/Error")

const authorize=(required_roles)=>{
    if(typeof(required_roles)=="number"){
        required_roles=[required_roles]
    }
    return (req,res,next)=>{
        console.log(req.user)
        if(!req.user){
            next(new AppError(400,'Forbidden.PLease try again'))
        }
        // check if the in the array is the same as the user role
        const has_access=required_roles.includes(req.user.role)
        if(!has_access){
            next(new AppError(400,"Forbidden Requst.You don't have access to this resource"))
        }else{
            next()
        }
    }
}

module.exports=authorize