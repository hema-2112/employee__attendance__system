import { useNavigate } from "react-router-dom";

// Define LeaveButtons before using it in columns
export const LeaveButtons = ({ Id }) => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    };

    return (
        <button
            className="px-4 py-1 bg-purple-500 rounded text-white hover:bg-purple-600"
            onClick={() => handleView(Id)}
        >
            View
        </button>
    );
};

// Now define columns after LeaveButtons
export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "70px",   
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId || "", // fix here
        width: "120px",   
    },
    {
        name: "Name",
        selector: (row) => row.name,
        width: "120px",   
    },
    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "140px",   
    },
    {
        name: "Department",
        selector: (row) => row.dep_name,
        width: "170px",   
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width: "80px",   
    },
    {
        name: "Status",
        selector: (row) => row.status,
        width: "120px",   
    },
    {
        name: "Action",
        selector: (row) => row.action,
        cell: (row) => (
            <div style={{ textAlign: "center", width: "100%" }}>
                {row.action}
            </div>
        ),
        width: "120px",
    }
    
];
