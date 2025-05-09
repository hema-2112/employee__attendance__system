import axios from "axios";
// Inside another .jsx or .js React component


import { useNavigate } from "react-router-dom";


// Get table columns
export const getColumns = () => [
    { name: <strong>S No</strong>, selector: (row) => row.sno, width: "90px" },
    { name: <strong>Name</strong>, selector: (row) => row.name, sortable: true, width: "150px" },
    { name: <strong>Image</strong>, selector: (row) => row.profileImage, width: "150px" },
    { name: <strong>Department</strong>, selector: (row) => row.dep_name, width: "130px"},
    { name: <strong>DOB</strong>, selector: (row) => row.dob, sortable: true, width: "150px" },
    { name: <strong>Action</strong>, selector: (row) => row.action, center: "true" },
];

// Fetch departments from API
export const fetchDepartments = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/department", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data.success ? response.data.departments : [];
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

//employees for salary form  
   
export const getEmployees = async (id) => { 
    try {
        const response = await axios.get(`http://localhost:5000/api/employee/department/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Fetched Employees:", response.data.employees); // Debugging

        return response.data.success ? response.data.employees : [];
    } catch (error) {
        console.error("Error fetching employees:", error);
        return []; // Ensure it always returns an array
    }
};


// Employee Action Buttons Component
export const EmployeeButtons = ({ Id }) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-3">
            <button
                className="px-3 py-1 bg-teal-600 text-white"
                onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
            >
                View
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white" 
            onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}>Edit</button>
            <button className="px-3 py-1 bg-yellow-600 text-white"
            onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}>Salary</button>
            <button className="px-3 py-1 bg-red-600 text-white"
            onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}>Leave</button>
        </div>
    );
};
