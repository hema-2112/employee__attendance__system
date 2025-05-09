import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import Department from '../models/Department.js';

// Multer Storage Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads"); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Multer Middleware
const uploads = multer({ storage: storage });

// Add Employee Controller
const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus = "Single",
            designation,
            department,
            salary,
            password,
            role,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already registered" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create User with profileImage if uploaded
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.filename : ""
        });

        // Save User
        const savedUser = await newUser.save();

        // Create Employee linked to User
        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary
        });

        // Save Employee
        await newEmployee.save();

        return res.status(200).json({ success: true, message: "Employee created successfully" });

    } catch (error) {
        console.error("Error in addEmployee:", error.message);
        return res.status(500).json({ success: false, error: "Server error in adding employee" });
    }
};

// Get all Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('userId', { password: 0 })
            .populate("department");

        return res.status(200).json({ success: true, employees });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in getting employees" });
    }
};

// Get Single Employee
const getEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        let employee;
        employee = await Employee.findById(id)
            .populate('userId', { password: 0 })
            .populate("department");
            if(!employee) {
               employee = await Employee.findOne({ userId: id })
            .populate('userId', { password: 0 })
            .populate("department");
            }

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        return res.status(200).json({ success: true, employee });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error in fetching employee" });
    }
};

// ✅ Update Employee (Fixed)
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, maritalStatus, designation, department, salary } = req.body;

        // Find employee by ID
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Find user linked to the employee
        const user = await User.findById(employee.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Update user name
        await User.findByIdAndUpdate(employee.userId, { name }, { new: true });

        // Update employee details
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { maritalStatus, designation, salary, department },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Employee updated successfully", updatedEmployee });

    } catch (error) {
        console.error("Error updating employee:", error);
        return res.status(500).json({ success: false, error: "Server error in updating employee" });
    }
};

const fetchEmployeesByDepId = async (req, res) => {
    const { id } = req.params;
    try {
        const employees = await Employee.find({ department: id})
        return res.status(200).json({success: true, employees});
    } catch (error) {
        return res
           .status(500)
           .json({success: false, error: "get employeesbyDepId server error"})
    }

    }


export { addEmployee, uploads, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId};
