import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
    addEmployee, 
    uploads, 
    getEmployees, 
    getEmployee, 
    updateEmployee,  // ✅ Import updateEmployee
    fetchEmployeesByDepId
} from '../controllers/employeeController.js';


const router = express.Router();

router.get('/', authMiddleware, getEmployees);
router.post('/add', authMiddleware, uploads.single('image'), addEmployee);
router.get('/:id', authMiddleware, getEmployee);
router.put('/:id', authMiddleware, updateEmployee); // ✅ Fix the update route
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId);


export default router;
