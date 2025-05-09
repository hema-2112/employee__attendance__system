import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ DepartmentButtons as a named export
export const DepartmentButtons = ({ DepId, onDepartmentDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        console.log("Delete button clicked for:", DepId);
        const confirmDelete = window.confirm("Do you want to delete?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/department/${DepId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success) {
                    alert("Department deleted successfully.");
                    onDepartmentDelete(DepId);
                } else {
                    alert("Delete failed: " + response.data.message);
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert(error.response?.data?.error || "Delete failed");
            }
        }
    };

    return (
        <div className="flex space-x-3">
            <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => navigate(`/admin-dashboard/department/${DepId}`)}
            >
                Edit
            </button>
            <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );
};

// ✅ Clean and compatible named export for column function
export const getDepartmentColumns = (onDepartmentDelete) => [
    { name: "S No", selector: (row) => row.sno },
    { name: "Department Name", selector: (row) => row.dep_name, sortable: true },
    {
        name: "Action",
        cell: (row) => (
            <DepartmentButtons
                DepId={row._id}
                onDepartmentDelete={onDepartmentDelete}
            />
        ),
    },
];
