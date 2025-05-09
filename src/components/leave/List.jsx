import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";



const List = () => {
    const [leaves, setLeaves] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const {user} = useAuth()

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("Response data:", response.data);

            if (response.data.success) {
                setLeaves(response.data.leaves);
            }
        } catch (error) {
            console.error("API Error:", error);
            alert(error.response?.data?.message || "Failed to fetch leaves");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchLeaves();
    }, []);

    if (!leaves) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Leaves</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search By Dep Name"
                    className="px-4 py-1 border rounded"
                />
                {user.role === "employee" && (
                <Link
                    to="/employee-dashboard/add-leave"
                    className="px-4 py-2 bg-purple-500 rounded text-white hover:bg-purple-700 transition"
                >
                    Add New Leave
                </Link>
)}
            </div>

            {loading ? (
                <p className="text-center text-gray-500 py-4">Loading leaves...</p>
            ) : (
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                        <tr>
                            <th className="px-6 py-3">SNO</th>
                            <th className="px-6 py-3">Leave Type</th>
                            <th className="px-6 py-3">From</th>
                            <th className="px-6 py-3">To</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length > 0 ? (
                            leaves.map((leave, index) => (
                                <tr key={leave._id} className="bg-white border-b dark:bg-white-600 dark:border-gray-700">
                                    <td className="px-6 py-3">{index + 1}</td>
                                    <td className="px-6 py-3">{leave.leaveType || "N/A"}</td>
                                    <td className="px-6 py-3">
                                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-3">
                                        {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-3">{leave.reason || "N/A"}</td>
                                    <td className="px-6 py-3">
                                        {leave.status ? (
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                                                leave.status === "Approved"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                                {leave.status}
                                            </span>
                                        ) : (
                                            "Pending"
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No leaves found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default List;
