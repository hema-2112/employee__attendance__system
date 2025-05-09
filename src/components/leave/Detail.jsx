import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        console.error("Error fetching leave:", error);
        alert(error.response?.data?.error || "Failed to fetch leave details");
      }
    };

    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/leave/${id}`, { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert(error.response?.data?.error || "Failed to update status");
    }
  };

  if (!leave) {
    return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
  }

  console.log("Leave Status:", leave.status); // Debug line

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Leave Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={`http://localhost:5000/${leave?.employeeId?.userId?.profileImage || "default.png"}`}
            alt="Profile"
            className="rounded-full border w-64 h-64 object-cover mx-auto"
          />
        </div>
        <div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Name:</p>
            <p className="font-medium">{leave.employeeId?.userId?.name || "N/A"}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Employee ID:</p>
            <p className="font-medium">{leave.employeeId?.employeeId || "N/A"}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Leave Type:</p>
            <p className="font-medium">{leave.leaveType}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Reason:</p>
            <p className="font-medium">{leave.reason}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Department:</p>
            <p className="font-medium">{leave.employeeId?.department?.dep_name || "N/A"}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Start Date:</p>
            <p className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">End Date:</p>
            <p className="font-medium">{new Date(leave.endDate).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-3 mb-3 items-center">
            <p className="text-lg font-bold">
              {leave.status?.toLowerCase() === "pending" ? "Action" : "Status"}:
            </p>
            {leave.status?.toLowerCase() === "pending" ? (
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => changeStatus(leave._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => changeStatus(leave._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p className="font-medium">{leave.status}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
