import jwt from "jsonwebtoken";

const authJWT = (req,res,next)=>{
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error:"Token is not found"});
    }
    const token = authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({error:"Invalid or expired token"});
    }
};

export {authJWT};