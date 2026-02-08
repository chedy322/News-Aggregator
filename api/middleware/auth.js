const jwt=require('jsonwebtoken')
const { promisify } = require('util');

// Re-use the promisified verify function if it's not globally available
const jwtVerify = promisify(jwt.verify); 
const authenticate=async(req,res,next)=>{
    try{
        const token=req.cookies.access_token
        console.log("cookies",req.cookies)
        if(!token) return res.status(401).json({message:'Unauthorized.Please log in'})
    //     jwt.verify(token,process.env.PRIVATE_KEY,(err,decoded)=>{
    // if(err) return res.status(401).json({message:'Unauthorized.PLease try again'})
    //     req.user={
    // _id:decoded._id,
    // username:decoded.username,
    // email:decoded.email,
    // role:decoded.role
    // }
    // })
    const decoded=await jwtVerify(token,process.env.PRIVATE_KEY)
    req.user={
    _id: decoded._id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
    }
    return next()
    }catch(err){
        console.log(err)
        next(err)
    }
}
module.exports=authenticate