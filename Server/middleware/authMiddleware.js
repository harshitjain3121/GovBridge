const jwt=require('jsonwebtoken')
const HttpError=require('../models/errorModel')

const authMiddleware= async (req,res,next)=>{
    const Authorization= req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith("Bearer")){
        const token=Authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, async (err,info)=>{
            if(err){
                return next(new HttpError("Unauthorized. Invalid token",403))
            }
            req.user=info;
            
            // Fetch user details to get role
            try {
                const UserModel = require('../models/userModel');
                const user = await UserModel.findById(info.id).select('role');
                if (user) {
                    req.user.role = user.role;
                }
            } catch (userErr) {
                console.error("Failed to fetch user role:", userErr);
            }
            
            next()
        })
    }
    else{
        return next(new HttpError("Unauthorized. No token",401))
    }
}
module.exports=authMiddleware;