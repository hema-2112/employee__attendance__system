import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AttendanceHelper, columns } from '../../utils/AttendanceHelper';
import DataTable from 'react-data-table-component';


const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredAttendance, setFilteredAttendance] = useState([])
   const statusChange2 = () => {
fetchAttendance();
}
    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/attendance', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

           

            if (response.data.success) {
                let sno = 1;


               

                const data = await response.data.attendance.map((att) => ({
                    employeeId: att.employeeId.employeeId,
                    sno: sno++,
                    department: att.employeeId.department?.dep_name || "No Department",
                    name: att.employeeId.userId?.name || "No Name",
                
                    action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange2={statusChange2} />
                }));

                setAttendance(data);
                setFilteredAttendance(data)
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert(error.response?.data?.error || "Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAttendance()
        
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();
        const records = attendance.filter((emp) => emp.name.toLowerCase().includes(searchText));
        setFilteredAttendance(records);
    };
    if(!filteredAttendance){
        return <div>Loading....</div>
    }
    

    return (
        <div className='p-6'>
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Manage Attendance</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search By Dep Name"
                    className="px-4 py-2 border rounded-md"
                    onChange={handleFilter}
                />
                <p className='text-2xl'>
                    Mark Employee For <span className='font-bold underline'>{new Date().toISOString().split('T')[0]}{" "}</span>
                </p>
                <Link
                    to="/employee-dashboard/attendance-report"
                   
                    className="px-4 py-2 bg-purple-600 rounded text-white hover:bg-purple-700 transition">
                
                    Attendance Report
                </Link>
              
            </div>
            <div className="bg-white p-4 rounded shadow">
                <DataTable columns={columns} data={filteredAttendance} pagination />
            </div>
        </div>
    );
};

export default Attendance;
