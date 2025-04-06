import jwt from "jsonwebtoken";


const generateJWT = (userData)=>{
    if(!userData){
        throw new Error("user data must be provided");
    }
    return jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:"2h"});
}

export {generateJWT};