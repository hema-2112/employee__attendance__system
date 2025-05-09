import axios from 'axios';

import React from 'react';


export const columns =  [
    { name: <strong>S No</strong>,
         selector: (row) => row.sno, 
         width: "90px" },
    { name: <strong>Name</strong>,
         selector: (row) => row.name,
          sortable: true, width: "150px" },
    { name: <strong>Emp ID</strong>,
         selector: (row) => row.employeeId,
          width: "130px"},
    { name: <strong>Department</strong>, 
        selector: (row) => row.department, 
        width: "170px"},
    { name: <strong>Action</strong>,
         selector: (row) => row.action, 
         center: "true" },
];



export const AttendanceHelper =({status,employeeId,statusChange2}) => {
    const markEmployee = async (status,employeeId) => {
        const response = await axios.put(`http://localhost:5000/api/attendance/update/${employeeId}`,{status}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
      
        })
        if(response.data.success){
            statusChange2();
        };
    };
    return(
        <div>
            {status == null ? (
            <div className='flex space-x-8'>
                <button className='px-4 py-2 bg-green-500 text-white'
                onClick={() => markEmployee("Present",employeeId)}>
                    Present</button>
                <button className='px-4 py-2 bg-red-500 text-white'
                  onClick={() => markEmployee("absent",employeeId)}>
                  Absent</button>
                <button className='px-4 py-2 bg-blue-500 text-white'
                  onClick={() => markEmployee("sick",employeeId)}>
                    sick</button>
                <button className='px-4 py-2 bg-rose-500 text-black'
                  onClick={() => markEmployee("leave",employeeId)}>
                    Leave</button>
            </div>
            ):(
        <p className='bg-purple-400 w-20 text-center py-2 rounded'>{status}</p>
    )}


        </div>
    );

    
};
export default AttendanceHelper