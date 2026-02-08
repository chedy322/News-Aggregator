const jwt=require('jsonwebtoken')
// this is optional so it doesn't force user to login
// it just checks user has sent token it attachs it to req.user so it can be avaible for our route
// otherwise it treats user as guest 
const { promisify } = require('util');

// Re-use the promisified verify function if it's not globally available
const jwtVerify = promisify(jwt.verify); 
const optionalAuth=async(req,res,next)=>{
    try{
        console.log("option middl been targeted")
        const token=req.cookies?.access_token;
        console.log("token",token)
        // :no need for blocking in case no token provided bcz it s an optional authentication 
        if(!token) {
            return next()
        }
         const decoded = await jwtVerify(token, process.env.PRIVATE_KEY);
        
        // 2. Set req.user (verification was successful)
        console.log("Token verified. Decoded:", decoded);
        req.user = {
            _id: decoded._id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };

        // 3. Proceed with req.user defined
        return next(); 
    
    }catch(err){
    //    do nothing just skip here
    console.log(err);
    return next()
    }
}


module.exports=optionalAuth