import Admin from "../models/adminModels.js";
import Student from "../models/studentModels.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { encryptPassword } from "../utils/encrypt.js";
import { generateJWT } from "../utils/generateJWT.js";

const registerAdmin = asyncHandler(async(req,res,next)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({error:"Please fill the required credentials correctly"});
    }
    const isAdminExists = await Admin.findOne({username});
    if(isAdminExists){
        return res.status(409).json({error:"Admin already exists"});
    }
    const hashedPassword = await encryptPassword(password);
    const newAdmin = await Admin.create({
        username,
        password:hashedPassword
    });
    const token = generateJWT({
        username:newAdmin.username,
        id:newAdmin.id
    });
    res.status(201).json({message:"Admin registered successfully",token});
});

const logInAdmin = asyncHandler(async(req,res,next)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({error:"Please fill the required credentials correctly"});
    }
    const isAdminExists = await Admin.findOne({username});
    if(!isAdminExists){
        return res.status(404).json({error:"There is no such admin"});
    }
    if(!(await isAdminExists.comparePassword(password))){
        return res.status(401).json({error:"Invalid password"})
    }
    const payLoad = {
        username:isAdminExists.username,
        id:isAdminExists.id
    }
    const token = generateJWT(payLoad);
    res.json({
        message:"Admin login successful",
        token
    });
});

const updateStudentDetails = asyncHandler(async(req,res,next)=>{
    const studentId = req.params.id;
    if(!studentId){
        return res.status(404).json({error:"Student doesn't exist"});
    }
    const {name,studentClass,section,roll,mobile} = req.body;
    const response = await Student.findByIdAndUpdate(studentId,{name:name,studentClass:studentClass,section:section,roll:roll,mobile:mobile},{
        new:true,
        lean:true,
        runValidators:true
    });
    if(!response){
        return res.status(404).json({ error: "Student data not found" });
    }
    res.status(200).json({response});
});

const deleteStudent = asyncHandler(async(req,res,next)=>{
    const studentId = req.params.id;
    if(!studentId){
        return res.status(404).json({error:"Student doesn't exist"});
    }
    await Student.findByIdAndDelete(studentId).then(deletedStudent=>{
        if(deleteStudent){
            return res.status(303).json({message:"Student data deleted successfully",deleteStudent});
        }
        else{
            return res.status(404).json({error:"Student doesn't exist"});
        }
    }).catch(err=>{
        res.status(500).json({error:"Error deleting user: ",err});
    });
}); 

export {registerAdmin,logInAdmin,updateStudentDetails,deleteStudent};