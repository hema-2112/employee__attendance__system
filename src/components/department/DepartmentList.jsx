import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getDepartmentColumns } from '/src/utils/DepartmentHelper';
import axios from 'axios';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [depLoading, setDepLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState([]);

    // ✅ Handle Delete from Child Component
    const onDepartmentDelete = (id) => {
        const data = departments.filter(dep => dep._id !== id);
        setDepartments(data);
        setFilteredDepartments(data);
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            setDepLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/department', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success) {
                    let sno = 1;
                    const data = response.data.departments.map((dep) => ({
                        _id: dep._id,
                        sno: sno++,
                        dep_name: dep.dep_name,
                    }));
                    setDepartments(data);
                    setFilteredDepartments(data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                alert(error.response?.data?.error || "Failed to fetch departments");
            } finally {
                setDepLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const filterDepartments = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchTerm(e.target.value);
        const filtered = departments.filter(dep =>
            dep.dep_name.toLowerCase().includes(searchText)
        );
        setFilteredDepartments(filtered);
    };

    const columns = getDepartmentColumns(onDepartmentDelete);

    return (
        <>
            {depLoading ? (
                <div className="text-center text-lg p-4">Loading ....</div>
            ) : (
                <div className="p-5">
                    <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold">Manage Departments</h3>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search By Dep Name"
                            className="px-4 py-1 border rounded"
                            onChange={filterDepartments}
                            value={searchTerm}
                        />
                        <Link
                            to="/admin-dashboard/add-department"
                            className="px-4 py-1 bg-purple-600 rounded text-white hover:bg-purple-700 transition"
                        >
                            Add New Department
                        </Link>
                    </div>
                    <div className="mt-5">
                        <DataTable
                            columns={columns}
                            data={filteredDepartments}
                            pagination
                            highlightOnHover
                            responsive
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default DepartmentList;
