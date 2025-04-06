import express from "express";
const router = express.Router();
import { loginStudent, registerStudents, studentDetails, updateData } from '../controllers/studentController.js';
import { authJWT } from "../utils/verifyJWT.js";

router.post('/signup', registerStudents);
router.post('/login',loginStudent);
router.get('/getDetails',authJWT,studentDetails);
router.patch('/update/:id',authJWT,updateData);

export default router;