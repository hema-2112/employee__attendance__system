import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { EmployeeButtons, getColumns, fetchDepartments } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';

const List = () => {
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(false);
    const [filteredEmployee, setFilteredEmployee] = useState([])

    useEffect(() => {
        const fetchEmployee = async () => {
            setEmpLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/employee', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                console.log("API Response:", response.data);

                if (response.data.success) {
                    let sno = 1;

                    // Filter out employees with missing userId
                    const validEmployees = response.data.employees.filter(emp => emp.userId);

                    const data = validEmployees.map((emp) => ({
                        _id: emp._id,
                        sno: sno++,
                        dep_name: emp.department?.dep_name || "No Department",
                        name: emp.userId?.name || "No Name",
                        dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "No DOB",
                        profileImage: emp.userId.profileImage ? (
                            <img 
                                src={`http://localhost:5000/${emp.userId.profileImage}`} 
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                            />
                        ) : "No Image",
                        action: <EmployeeButtons Id={emp._id} />
                    }));

                    setEmployees(data);
                    setFilteredEmployee(data)
                }
            } catch (error) {
                console.error("Fetch error:", error);
                alert(error.response?.data?.error || "Failed to fetch employees");
            } finally {
                setEmpLoading(false);
            }
        };

        fetchEmployee();
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();
        const records = employees.filter((emp) => emp.name.toLowerCase().includes(searchText));
        setFilteredEmployee(records);
    };
    

    return (
        <div className='p-6'>
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Manage Employee</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search By Dep Name"
                    className="px-4 py-2 border rounded-md"
                    onChange={handleFilter}
                />
                <Link
                    to="/admin-dashboard/add-employee"
                    className="px-4 py-2 bg-purple-600 rounded text-white hover:bg-purple-700 transition"
                >
                    Add New Employee
                </Link>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <DataTable columns={getColumns()} data={filteredEmployee} pagination />
            </div>
        </div>
    );
};

export default List;
