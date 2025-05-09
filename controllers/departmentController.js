import Department from '../models/Department.js';

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        return res.status(200).json({success: true, departments})
    } catch(error) {
        return res.status(500).json({ success: false, error: "get department server error" })
    }
}

const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;
        console.log("Received Data:", req.body);  // 👈 Log incoming data

        if (!dep_name) {
            return res.status(400).json({ success: false, error: "Department name is required" });
        }

        const newDep = new Department({ dep_name, description });
        await newDep.save();

        console.log("Saved Department:", newDep);  // 👈 Confirm save
        return res.status(200).json({ success: true, department: newDep });
    } catch (error) {
        console.error("Server Error in addDepartment:", error);  // 👈 Log exact error
        return res.status(500).json({ success: false, error: "Server error in add department" });
    }
};

const getDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const department =  await Department.findById({_id: id})
        return res.status(200).json({success: true, department})
    } catch(error) {
        return res.status(500).json({ success: false, error: "get department server error" })
    }
    }

    const updateDepartment = async (req, res) => {
         try {
            const { id } = req.params;
            const {dep_name, description} = req.body;
            const updateDep = await Department.findByIdAndUpdate({_id: id}, {
                 dep_name,
                 description
                })
                return res.status(200).json({success: true, updateDep})
         } catch(error) {
                return res.status(500).json({ success: false, error: "edit department server error" })
         }
}

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedep = await Department.findByIdAndDelete({_id: id})
        await deletedep.deleteOne()
            return res.status(200).json({success: true, deletedep})
     } catch(error) {
            return res.status(500).json({ success: false, error: "delete department server error" })
     }

}
    

export { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment }; 