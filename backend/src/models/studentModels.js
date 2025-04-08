import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    studentClass: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true,
    },
    roll: {
        type: Number,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique:true
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum:["student","admin"],
        default:"student"
    }
});

studentSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

const Student = mongoose.model("Student", studentSchema);
export default Student;  // Default export
