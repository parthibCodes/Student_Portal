import express from "express";
import { registerAdmin,logInAdmin,updateStudentDetails,deleteStudent } from "../controllers/adminController.js";
import { authJWT } from "../utils/verifyJWT.js";
const adminRouter = express.Router();

adminRouter.post('/register',registerAdmin);
adminRouter.post('/login',logInAdmin);
adminRouter.patch('/update/:id',authJWT,updateStudentDetails);
adminRouter.delete('/delete/:id',authJWT,deleteStudent);

export default adminRouter;