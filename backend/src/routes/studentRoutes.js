import express from "express";
const router = express.Router();
import { loginStudent, registerStudents, studentDetails, updateData ,changeRequest} from '../controllers/studentController.js';
import { authJWT } from "../utils/verifyJWT.js";

router.post('/signup', registerStudents);
router.post('/login',loginStudent);
router.get('/getDetails',authJWT,studentDetails);
router.patch('/update/:id',authJWT,updateData);
router.post('/requestAdmin',changeRequest);

export default router;