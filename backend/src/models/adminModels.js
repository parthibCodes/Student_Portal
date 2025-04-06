import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password,this.password);
}

const Admin = mongoose.model("Admin",adminSchema);
export default Admin;