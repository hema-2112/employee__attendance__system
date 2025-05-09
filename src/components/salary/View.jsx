import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const View = () => {
    const [salaries, setSalaries] = useState(null);
    const [filteredSalaries, setFilteredSalaries] = useState(null);
    const [error, setError] = useState("");
    const { id } = useParams();
    const {user} = useAuth();

    const fetchSalaries = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/salary/${id}/${user.role}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.data.success) {
                setSalaries(response.data.salary);
                setFilteredSalaries(response.data.salary);
                setError(""); // Clear any previous error
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("No salary records found.");
                setSalaries([]);
                setFilteredSalaries([]);
            } else {
                setError("Server error while fetching salary data.");
                setSalaries([]);
                setFilteredSalaries([]);
            }
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, [id]);

    const filterSalaries = (query) => {
        if (!salaries) return;

        const filteredRecords = salaries.filter((salary) =>
            salary.employeeId.employeeId.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSalaries(filteredRecords);
    };

    return (
        <>
            {filteredSalaries === null ? (
                <div>Loading....</div>
            ) : (
                <div className="overflow-x-auto p-5">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Salary History</h2>
                    </div>
                    <div className="flex justify-end my-3">
                        <input
                            type="text"
                            placeholder="Search By EMP ID"
                            className="border px-2 rounded-md py-0.5 border-gray-300"
                            onChange={(e) => filterSalaries(e.target.value)}
                        />
                    </div>

                    {error ? (
                        <div className="text-red-500 text-center mt-4">{error}</div>
                    ) : filteredSalaries.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">SNO</th>
                                    <th className="px-6 py-3">Emp ID</th>
                                    <th className="px-6 py-3">Salary</th>
                                    <th className="px-6 py-3">Allowance</th>
                                    <th className="px-6 py-3">Deduction</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Pay Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSalaries.map((salary, index) => (
                                    <tr
                                        key={salary._id}
                                        className="bg-white border-b dark:bg-white-800 dark:border-gray-700"
                                    >
                                        <td className="px-6 py-3">{index + 1}</td>
                                        <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                                        <td className="px-6 py-3">{salary.basicSalary}</td>
                                        <td className="px-6 py-3">{salary.allowances}</td>
                                        <td className="px-6 py-3">{salary.deductions}</td>
                                        <td className="px-6 py-3">{salary.netSalary}</td>
                                        <td className="px-6 py-3">
                                            {new Date(salary.payDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500 mt-4">No Records</div>
                    )}
                </div>
            )}
        </>
    );
};

export default View;
