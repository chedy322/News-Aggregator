const AppError=require('../src/Error')

const handle_error=(err,req,res,next)=>{
    if(err instanceof AppError){
        console.log(err)
        return res.status(err.StatusCode).json({message:err.message})
    }else{
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error',
        })
    }
}

module.exports=handle_error
