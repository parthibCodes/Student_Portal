import Student from "../models/studentModels.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { encryptPassword } from "../utils/encrypt.js";
import { generateJWT } from "../utils/generateJWT.js";
import nodemailer from "nodemailer";

const registerStudents = asyncHandler(async (req, res, next) => {
  console.log("📥 Received request to /signup:", req.body);

  const { name, email, roll, studentClass, section, password, mobile, address } =
    req.body;

  // Check for missing fields
  if (
    !name ||
    !email ||
    !roll ||
    !studentClass ||
    !section ||
    !password ||
    !mobile ||
    !address
  ) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if the student already exists
  const studentExists = await Student.findOne({ roll });
  if (studentExists) {
    console.log("❌ Student already registered:", studentExists);
    return res.status(409).json({ error: "Student is already registered" });
  }

  console.log("🔒 Encrypting password...");
  const hashedPassword = await encryptPassword(password);

  // Create student
  const newStudent = await Student.create({
    name,
    email,
    studentClass,
    section,
    roll,
    mobile,
    address,
    password: hashedPassword,
  });

  const token = generateJWT({
    name: newStudent.name,
    id: newStudent.id,
    studentClass: newStudent.studentClass,
  });

  console.log("✅ Student registered successfully:");
  res.cookie('token',token,{
    httpOnly:true,
    secure:true,
    expires:new Date(Date.now()+2*60*60*60)
  })
  res.status(201).json({
    student: {
      id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      studentClass: newStudent.studentClass,
      section: newStudent.section,
      roll: newStudent.roll,
      mobile: newStudent.mobile,
      address: newStudent.address,
    },
    token,
  });
});

const loginStudent = asyncHandler(async (req, res, next) => {
  const { name, mobile, password } = req.body;
  const isStudent = await Student.findOne({ name, mobile });
  if (!isStudent)
    return res.status(404).json({ error: "Student does't exist" });
  if (!(await isStudent.comparePassword(password)))
    return res.status(401).json({ message: "Invalid password" });

  const payload = {
    id: isStudent.id,
    name: isStudent.name,
  };
  const token = generateJWT(payload);
  res.json({
    message: "Login successful",
    student: {
      id: isStudent._id,
      name: isStudent.name,
      studentClass: isStudent.studentClass,
      section: isStudent.section,
      roll: isStudent.roll,
      mobile: isStudent.mobile,
      address: isStudent.address,
    },
    token,
  });
});

const studentDetails = asyncHandler(async (req, res, next) => {
  const studentData = req.user;
  if (!studentData) {
    return res.status(404).status({ error: "User data is not found" });
  }
  // console.log("Student data: ", studentData);
  const student = await Student.findById(studentData.id);
  if (!student) {
    return res.status(404).json({ error: "Student id is not found" });
  }
  res.status(200).json({ student });
});

const updateData = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const {mobile,address,password,email} = req.body;
  let updateFieldes = {};
  if(email){
    updateFieldes.email = email;
  }
  if(password){
    const hashedPassword = await encryptPassword(password);
    updateFieldes.password = hashedPassword;
  }
  if(mobile){
    updateFieldes.mobile = mobile;
  }
  if(address){
    updateFieldes.address = address;
  }
  const updatedStudent = await Student.findByIdAndUpdate(studentId,updateFieldes,{new:true});
  if(!updatedStudent){
    return res.status(404).json({error:"Student id is not found"});
  }
  res.status(200).json({message:"Your data updated successfully",updatedStudent});
});

const changeRequest = asyncHandler(async(req,res,next)=>{
  const {email} = req.body;
  const validEmail = await Student.findOne({email});
  if(!validEmail){
    return res.status(404).json({error:"Your email is not registered"});
  }
  if(!email){
    return res.status(400).json({ error: "email is required" });
  }
  const transporter = nodemailer.createTransport({
    host:email,
    port:465,
    secure:true,
    service:"gmail",
    auth:{
      user:process.env.GMAIL_USER,
      pass:process.env.GMAIL_PASS
    }
  });
  const mailOptions = {
    from:process.env.GMAIL_USER,
    to:"parthibchakraborty2023@gmail.com",
    subject:"Studnet data change request",
    text:`Data change request is raised by ${email}`,
    replyTo:email
  };
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      console.log(error);
    }
    else{
      console.log("Message sent:"+info.response);
      return res.status(200).json({message:"Message sent"});
    }
  });
});

export { registerStudents, loginStudent, studentDetails, updateData ,changeRequest};
