import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns } from "../../utils/LeaveHelper";
import axios from "axios";
import { LeaveButtons } from "../../utils/LeaveHelper";

const Table = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Added loading state

    const fetchLeaves = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/leave", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                let sno = 1;

                const data = response.data.leaves.map((leave) => ({
                    _id: leave?._id || "N/A",
                    sno: sno++,
                    employeeId: leave?.employeeId?.employeeId || "N/A",
                    name: leave?.employeeId?.userId?.name || "Unknown",
                    leaveType: leave?.leaveType || "N/A",
                    dep_name: leave?.employeeId?.department?.dep_name || "No Department",
                    days: leave?.startDate && leave?.endDate
                        ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24))
                        : "N/A",
                    status: leave?.status || "N/A",
                    action: <LeaveButtons Id={leave?._id} />,
                }));

                setLeaves(data);
                setFilteredLeaves(data);
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        } finally {
            setLoading(false); // ✅ Stop loading once fetch completes
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const filterByInput = (e) => {
        const searchText = e.target.value.toLowerCase();
        const data = leaves.filter((leave) =>
            leave.employeeId.toLowerCase().includes(searchText)
        );
        setFilteredLeaves(data);
    };

    const filterByButton = (status) => {
        const data = leaves.filter((leave) =>
            leave.status.toLowerCase().includes(status.toLowerCase())
        );
        setFilteredLeaves(data);
    };

    return (
        <>
            {loading ? (
                <div>Loading ...</div>
            ) : (
                <div className="p-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">Manage Leaves</h3>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search By Emp ID"
                            className="px-4 py-1 border rounded"
                            onChange={filterByInput}
                        />
                        <div className="space-x-3">
                            <button
                                className="px-2 py-1 bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => filterByButton("Pending")}
                            >
                                Pending
                            </button>
                            <button
                                className="px-2 py-1 bg-purple-600 text-white hover:bg-pruple-700"
                                onClick={() => filterByButton("Approved")}
                            >
                                Approved
                            </button>
                            <button
                                className="px-2 py-1 bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => filterByButton("Rejected")}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <DataTable
                            columns={columns}
                            data={filteredLeaves}
                            pagination
                            noDataComponent="There are no records to display."
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Table;
