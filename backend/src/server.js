import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./config/db.js";
import "./controllers/studentController.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use('/api/admin',adminRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});