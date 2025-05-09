import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import leaveRouter from './routes/leave.js';
import salaryRouter from './routes/salary.js';
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js';
import connectToDatabase from './db/db.js';
import attendanceRouter from './routes/attendance.js';
dotenv.config();
connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/setting', settingRouter);
app.use('/api/attendance',attendanceRouter);
app.use('/api/dashboard', dashboardRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
