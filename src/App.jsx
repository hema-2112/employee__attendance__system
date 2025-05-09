import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import Add from "./components/employee/Add";
import List from "./components/employee/List";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import Summary from "./components/EmployeeDashboard/Summary";
import AddLeave from "./components/leave/Add";
import LeaveList from "./components/leave/List";
import ViewSalary from "./components/salary/View";
import AddSalary from "./components/salary/Add";
import Table from "./components/leave/Table";
import Setting from "./components/EmployeeDashboard/Setting";
import Detail from "./components/leave/Detail";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";



function App() {
  return (
    <Routes>
      {/* Redirect root path to admin-dashboard */}
      <Route path="/" element={<Navigate to="/admin-dashboard" />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<AdminSummary />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="department/:id" element={<EditDepartment />} />
        <Route path="add-employee" element={<Add />} />
        <Route path="employees" element={<List />} />
        <Route path="employees/:id" element={<View />} />
        <Route path="employees/edit/:id" element={<Edit />} />
        <Route path="employees/salary/:id" element={<ViewSalary />} />
        <Route path="salary/add" element={<AddSalary />} />
       
        <Route path="leaves" element={<Table />} />
        <Route path="leaves/:id" element={<Detail />} />
        <Route path="employees/leaves/:id" element={<LeaveList />} />
        <Route path="setting" element={<Setting />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance-report" element={<AttendanceReport />}/>
       
       
      </Route>

      {/* Employee Routes */}
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<Summary />} />
        <Route path="profile/:id" element={<View />} />
        <Route path="leaves/:id" element={<LeaveList />} />
        <Route path="add-leave" element={<AddLeave />} />
        <Route path="salary/:id" element={<ViewSalary />} />
        <Route path="setting" element={<Setting />} />
       <Route path="attendance/:id" element={<Attendance/>}/>
       <Route path="attendance-report/" element={<AttendanceReport />}/>
       
      </Route>
    </Routes>
  );
}

export default App;
