// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const EmployeeHoursCeilings = ({ projectId, isSearched, updatedBy = "user" }) => {
//   const [employees, setEmployees] = useState([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});

//   // Validate projectId format (e.g., "PROJ\d{3}")
//   const isValidProjectId = (id) => id && id.match(/^PROJ\d{3}$/);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Project/GetEmployeesByProjectId/${projectId}`
//           );
//           const data = response.data || [];
//           setEmployees(data.map(emp => ({
//             projectId: emp.projectId || "",
//             firstName: emp.firstName || "",
//             lastName: emp.lastName || "",
//             laborCategory: emp.plcGlcCode || "",
//             hoursCeiling: emp.perHourRate || 0
//           })));
//           setIsDataFetched(true);
//         } catch (error) {
//           console.error("Error fetching employees:", error);
//           setEmployees([]);
//           setIsDataFetched(true);
//         }
//       } else if (!isValidProjectId(projectId)) {
//         setEmployees([]);
//         setIsDataFetched(false);
//       }
//     };
//     fetchEmployees();
//   }, [projectId, isSearched]);

//   const handleHoursChange = (projectId, value) => {
//     setEmployees((prevEmployees) =>
//       prevEmployees.map((emp) =>
//         emp.projectId === projectId ? { ...emp, hoursCeiling: value } : emp
//       )
//     );
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({ hoursCeiling: employees[index].hoursCeiling });
//   };

//   const handleEditChange = (e) => {
//     const { value } = e.target;
//     setEditRow((prev) => ({ ...prev, hoursCeiling: value }));
//   };

//   const handleUpdate = async (index) => {
//     const emp = employees[index];
//     const requestBody = {
//       projectId,
//       employeeId: emp.projectId,
//       laborCategoryId: emp.laborCategory,
//       hoursCeiling: parseFloat(editRow.hoursCeiling) || 0,
//       applyToRbaCode: "N" // Default value, can be adjusted
//     };
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       setEmployees((prev) =>
//         prev.map((emp, i) =>
//           i === index ? { ...emp, hoursCeiling: requestBody.hoursCeiling } : emp
//         )
//       );
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       alert("Failed to update. Please try again.");
//     }
//   };

//   const handleNewClick = () => {
//     setEmployees((prev) => [
//       ...prev,
//       { projectId: "", firstName: "", lastName: "", laborCategory: "", hoursCeiling: "" }
//     ]);
//   };

//   const handleSaveNew = async (index) => {
//     const emp = employees[index];
//     const requestBody = {
//       projectId,
//       employeeId: emp.projectId,
//       laborCategoryId: emp.laborCategory,
//       hoursCeiling: parseFloat(emp.hoursCeiling) || 0,
//       applyToRbaCode: "N" // Default value, can be adjusted
//     };
//     if (!emp.projectId || !emp.laborCategory || !emp.hoursCeiling) {
//       alert("Please fill all fields.");
//       return;
//     }
//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       // Refresh data
//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//       );
//       const data = response.data || [];
//       setEmployees(data.map(emp => ({
//         projectId: emp.projectId || "",
//         firstName: emp.firstName || "",
//         lastName: emp.lastName || "",
//         laborCategory: emp.plcGlcCode || "",
//         hoursCeiling: emp.perHourRate || 0
//       })));
//     } catch (error) {
//       alert("Failed to save. Please check your input and try again.");
//     }
//   };

//   const handleDeleteUI = (index) => {
//     setEmployees((prev) => prev.filter((_, i) => i !== index));
//   };

//   if (!isSearched || !isValidProjectId(projectId)) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fade-in">
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Employee Hours Ceilings
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">
//               Project:
//             </label>
//             <span className="text-sm text-gray-900">{projectId}</span>
//             <span className="ml-4 text-sm text-gray-900">Org ID: 1.02</span>
//           </div>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>
//         {employees.length === 0 ? (
//           <p className="text-gray-600">No data available for this project ID.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Empl ID
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Employee Name
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Labor Category
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Hours Ceiling
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((emp, index) => (
//                   <tr
//                     key={emp.projectId || index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {emp.projectId}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {`${emp.lastName}, ${emp.firstName}`}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {emp.laborCategory}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.hoursCeiling || ""}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                           placeholder="0.00"
//                         />
//                       ) : (
//                         <span className="font-normal">{emp.hoursCeiling}</span>
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       {editIndex === index ? (
//                         <button
//                           onClick={() => handleUpdate(index)}
//                           className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
//                         >
//                           Update
//                         </button>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUI(index)}
//                             className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
//                           >
//                             Delete
//                           </button>
//                         </>
//                       )}
//                       {!emp.projectId && (
//                         <button
//                           onClick={() => handleSaveNew(index)}
//                           className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
//                         >
//                           Save
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeHoursCeilings;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrash, FaSave, FaPlus } from "react-icons/fa";

// const EmployeeHoursCeilings = ({ projectId, isSearched, updatedBy = "user" }) => {
//   const [employees, setEmployees] = useState([]);
//   const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
//   const [laborCategories, setLaborCategories] = useState([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [isValidId, setIsValidId] = useState(true);

//   // Validate projectId format (e.g., "PROJ\d{3}")
//   const isValidProjectId = (id) => id && id.match(/^PROJ\d{3}$/);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsValidId(isValidProjectId(projectId));
//       if (!isSearched || !isValidProjectId(projectId)) {
//         setEmployees([]);
//         setIsDataFetched(false);
//         return;
//       }

//       // Fetch employee suggestions
//       try {
//         const empResponse = await axios.get(
//           `${backendUrl}/Project/GetEmployeesByProject/${projectId}`
//         );
//         const empData = empResponse.data || [];
//         setEmployeeSuggestions(Array.isArray(empData) ? empData : []);
//       } catch (error) {
//         console.error("Error fetching employee suggestions:", error);
//         setEmployeeSuggestions([]);
//       }

//       // Fetch current hours ceilings
//       try {
//         const ceilingResponse = await axios.get(
//           `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//         );
//         const ceilingData = ceilingResponse.data || [];
//         setEmployees(
//           Array.isArray(ceilingData)
//             ? ceilingData.map((emp) => ({
//                 projectId: emp.projectId || "",
//                 applyToRbaCode: `${emp.lastName || ""}, ${emp.firstName || ""}`,
//                 laborCategory: emp.plcGlcCode || "",
//                 hoursCeiling: emp.perHourRate || 0,
//               }))
//             : []
//         );
//       } catch (error) {
//         console.error("Error fetching ceiling data:", error);
//         setEmployees([]);
//       }

//       // Fetch labor categories
//       try {
//         const laborResponse = await axios.get(
//           `${backendUrl}/Project/GetAllPlcs/W`
//         );
//         const laborData = laborResponse.data || [];
//         setLaborCategories(Array.isArray(laborData) ? laborData : []);
//       } catch (error) {
//         console.error("Error fetching labor categories:", error);
//         setLaborCategories([]);
//       }

//       setIsDataFetched(true);
//     };
//     fetchData();
//   }, [projectId, isSearched]);

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow(employees[index]);
//   };

//   const handleEditChange = (field, value) => {
//     setEditRow((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEmployeeIdChange = (index, value) => {
//     const selected = employeeSuggestions.find((sug) => sug.empId === value);
//     if (selected) {
//       setEditRow((prev) => ({
//         ...prev,
//         projectId: selected.empId,
//         applyToRbaCode: selected.applyToRbaCode,
//       }));
//     } else {
//       setEditRow((prev) => ({ ...prev, projectId: value, applyToRbaCode: "" }));
//     }
//   };

//   const handleLaborCategoryChange = (index, value) => {
//     const selected = laborCategories.find((cat) => cat.laborCategoryCode === value);
//     if (selected) {
//       setEditRow((prev) => ({
//         ...prev,
//         laborCategory: selected.laborCategoryCode,
//       }));
//     } else {
//       setEditRow((prev) => ({ ...prev, laborCategory: value }));
//     }
//   };

//   const handleUpdate = async (index) => {
//     const updatedEmp = editRow;
//     const requestBody = {
//       projectId,
//       employeeId: updatedEmp.projectId,
//       laborCategoryId: updatedEmp.laborCategory,
//       hoursCeiling: parseFloat(updatedEmp.hoursCeiling) || 0,
//       applyToRbaCode: "N",
//     };
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       setEmployees((prev) =>
//         prev.map((emp, i) => (i === index ? updatedEmp : emp))
//       );
//       toast.success("Update successful");
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Failed to update");
//     }
//   };

//   const handleNewClick = () => {
//     const newIndex = employees.length;
//     setEmployees((prev) => [
//       ...prev,
//       { projectId: "", applyToRbaCode: "", laborCategory: "", hoursCeiling: "" },
//     ]);
//     setEditIndex(newIndex);
//     setEditRow({ projectId: "", applyToRbaCode: "", laborCategory: "", hoursCeiling: "" });
//   };

//   const handleSaveNew = async (index) => {
//     const newEmp = editRow;
//     if (!newEmp.projectId || !newEmp.laborCategory || !newEmp.hoursCeiling) {
//       toast.error("Please fill all fields");
//       return;
//     }
//     const requestBody = {
//       projectId,
//       employeeId: newEmp.projectId,
//       laborCategoryId: newEmp.laborCategory,
//       hoursCeiling: parseFloat(newEmp.hoursCeiling) || 0,
//       applyToRbaCode: "A",
//     };
//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       toast.success("Save successful");
//       // Refresh data
//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//       );
//       const data = response.data || [];
//       setEmployees(
//         Array.isArray(data)
//           ? data.map((emp) => ({
//               projectId: emp.projectId || "",
//               applyToRbaCode: `${emp.lastName || ""}, ${emp.firstName || ""}`,
//               laborCategory: emp.plcGlcCode || "",
//               hoursCeiling: emp.perHourRate || 0,
//             }))
//           : []
//       );
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Failed to save");
//     }
//   };

//   const handleDeleteUI = (index) => {
//     setEmployees((prev) => prev.filter((_, i) => i !== index));
//     toast.info("Row deleted (UI only; implement API delete if needed)");
//   };

//   if (!isSearched) {
//     return <div className="text-gray-600">Please search for a project to view details.</div>;
//   }

//   if (!isValidId) {
//     return <div className="text-red-600">Invalid project ID.</div>;
//   }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Employee Hours Ceilings</h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">Project:</label>
//             <span className="text-sm text-gray-900">{projectId}</span>
//             <span className="ml-4 text-sm text-gray-900">Org ID: 1.02</span>
//           </div>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center"
//             onClick={handleNewClick}
//           >
//             <FaPlus className="mr-1" /> New
//           </button>
//         </div>
//         {employees.length === 0 && isDataFetched ? (
//           <p className="text-gray-600">No data available for this project ID.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Empl ID</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Employee Name</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Labor Category</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Hours Ceiling</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((emp, index) => (
//                   <tr
//                     key={emp.projectId || index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`empSuggestions-${index}`}
//                             value={editRow.projectId || ""}
//                             onChange={(e) => handleEmployeeIdChange(index, e.target.value)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                             placeholder="Search Empl ID"
//                           />
//                           <datalist id={`empSuggestions-${index}`}>
//                             {employeeSuggestions.map((sug) => (
//                               <option key={sug.empId} value={sug.empId}>
//                                 {sug.empId} - {sug.applyToRbaCode}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.projectId
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.applyToRbaCode || ""}
//                           disabled
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         emp.applyToRbaCode
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`laborSuggestions-${index}`}
//                             value={editRow.laborCategory || ""}
//                             onChange={(e) => handleLaborCategoryChange(index, e.target.value)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                             placeholder="Search Labor Category"
//                           />
//                           <datalist id={`laborSuggestions-${index}`}>
//                             {laborCategories.map((cat, idx) => (
//                               <option key={idx} value={cat.laborCategoryCode}>
//                                 {cat.laborCategoryCode} - {cat.description}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.laborCategory
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           value={editRow.hoursCeiling || ""}
//                           onChange={(e) => handleEditChange("hoursCeiling", e.target.value)}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                           placeholder="0.00"
//                         />
//                       ) : (
//                         emp.hoursCeiling
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       {editIndex === index ? (
//                         <button
//                           onClick={() => (emp.projectId ? handleUpdate(index) : handleSaveNew(index))}
//                           className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
//                         >
//                           <FaSave />
//                         </button>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUI(index)}
//                             className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
//                           >
//                             <FaTrash />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeHoursCeilings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import { backendUrl } from "./config";

// const EmployeeHoursCeilings = ({
//   projectId,
//   isSearched,
//   updatedBy = "user",
// }) => {
//   const [employees, setEmployees] = useState([]);
//   const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
//   const [laborCategories, setLaborCategories] = useState([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [isValidId, setIsValidId] = useState(true);

//   // Validate projectId format (e.g., "PROJ\d{3}")

//   // const isValidProjectId = (id) => id && id.match(/^PROJ\d{3}$/);

//   const isValidProjectId = (id) => !!id;

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsValidId(isValidProjectId(projectId));
//       if (!isSearched || !isValidProjectId(projectId)) {
//         setEmployees([]);
//         setIsDataFetched(false);
//         return;
//       }

//       // Fetch employee suggestions
//       try {
//         const empResponse = await axios.get(
//           `${backendUrl}/Project/GetEmployeesByProject/${projectId}`
//         );

//         const empData = empResponse.data || [];
//         setEmployeeSuggestions(Array.isArray(empData) ? empData : []);
//       } catch (error) {
//         console.error("Error fetching employee suggestions:", error);
//         setEmployeeSuggestions([]);
//       }

//       // Fetch current hours ceilings
//       try {
//         const ceilingResponse = await axios.get(
//           `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//         );
//         console.log("Ceiling data response:", ceilingResponse);
//         const ceilingData = ceilingResponse.data?.data || [];

//         // setEmployees(
//         //   Array.isArray(ceilingData)
//         //     ? ceilingData.map((emp) => ({
//         //         projectId: emp.projectId || "",
//         //         applyToRbaCode: `${emp.lastName || ""}, ${emp.firstName || ""}`,
//         //         laborCategory: emp.plcGlcCode || "",
//         //         hoursCeiling: emp.perHourRate || 0,
//         //       }))
//         setEmployees(
//           Array.isArray(ceilingData)
//             ? ceilingData.map((emp) => ({
//                 projectId: emp.projectId || "",
//                 empId: emp.employeeId?.trim() || "",
//                 employeeName: emp.employeeName || "",
//                 laborCategoryId: emp.laborCategoryId || "",
//                 laborCategoryDesc: emp.laborCategoryDesc || "", // ✅ added
//                 hoursCeiling: emp.hoursCeiling ?? 0,
//                 applyToRbaCode: emp.applyToRbaCode || "",
//               }))
//             : []
//         );
//         console.log("Raw ceilingData:", ceilingData);
//       } catch (error) {
//         console.error("Error fetching ceiling data:", error);
//         setEmployees([]);
//       } finally {
//         setIsDataFetched(true); // ✅ make sure this runs
//       }

//       // Fetch labor categories
//       try {
//         const laborResponse = await axios.get(
//           `${backendUrl}/Project/GetAllPlcs/W`
//         );
//         console.log("Labor categories response:", laborResponse);
//         const laborData = laborResponse.data || [];
//         setLaborCategories(Array.isArray(laborData) ? laborData : []);
//       } catch (error) {
//         console.error("Error fetching labor categories:", error);
//         setLaborCategories([]);
//       }

//       setIsDataFetched(true);
//     };
//     fetchData();
//   }, [projectId, isSearched]);

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow(employees[index]);
//   };

//   const handleEditChange = (field, value) => {
//     setEditRow((prev) => ({ ...prev, [field]: value }));
//   };

//   // const handleEmployeeIdChange = (index, value) => {
//   //   const selected = employeeSuggestions.find((sug) => sug.empId === value);
//   //   if (selected) {
//   //     setEditRow((prev) => ({
//   //       ...prev,
//   //       projectId: selected.empId,
//   //       applyToRbaCode: selected.applyToRbaCode,
//   //     }));
//   //   } else {
//   //     setEditRow((prev) => ({ ...prev, projectId: value, applyToRbaCode: "" }));
//   //   }
//   // };

//   // const handleEmployeeIdChange = (index, value) => {
//   //   const selected = employeeSuggestions.find((sug) => sug.empId === value);
//   //   if (selected) {
//   //     setEditRow((prev) => ({
//   //       ...prev,
//   //       empId: selected.empId,
//   //       employeeName: selected.employeeName, // ✅ use employeeName
//   //     }));
//   //   } else {
//   //     setEditRow((prev) => ({ ...prev, empId: value, employeeName: "" }));
//   //   }
//   // };

//   // const handleLaborCategoryChange = (index, value) => {
//   //   const selected = laborCategories.find(
//   //     (cat) => cat.laborCategoryCode === value
//   //   );
//   //   if (selected) {
//   //     setEditRow((prev) => ({
//   //       ...prev,
//   //       laborCategory: selected.laborCategoryCode,
//   //       laborCategoryDesc: selected.description,
//   //     }));
//   //   } else {
//   //     setEditRow((prev) => ({
//   //       ...prev,
//   //       laborCategory: value,
//   //       laborCategoryDesc: "",
//   //     }));
//   //   }
//   // };
//   const handleEmployeeIdChange = (index, value) => {
//     const selected = employeeSuggestions.find((sug) => sug.empId === value);
//     if (selected) {
//       setEditRow((prev) => ({
//         ...prev,
//         empId: selected.empId,
//         employeeName: selected.employeeName,
//       }));
//     } else {
//       setEditRow((prev) => ({ ...prev, empId: value, employeeName: "" }));
//     }
//   };

//   const handleLaborCategoryChange = (index, value) => {
//     const selected = laborCategories.find(
//       (cat) => cat.laborCategoryCode === value
//     );
//     if (selected) {
//       setEditRow((prev) => ({
//         ...prev,
//         laborCategoryId: selected.laborCategoryCode,
//         laborCategoryDesc: selected.description,
//       }));
//     } else {
//       setEditRow((prev) => ({
//         ...prev,
//         laborCategoryId: value,
//         laborCategoryDesc: "",
//       }));
//     }
//   };

//   // const handleUpdate = async (index) => {
//   //   const updatedEmp = editRow;
//   //   const requestBody = {
//   //     projectId,
//   //     employeeId: updatedEmp.empId,
//   //     laborCategoryId: updatedEmp.laborCategory,
//   //     hoursCeiling: parseFloat(updatedEmp.hoursCeiling) || 0,
//   //     applyToRbaCode: "N",
//   //   };
//   //   try {
//   //     await axios.put(
//   //       `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//   //       requestBody
//   //     );
//   //     setEmployees((prev) =>
//   //       prev.map((emp, i) => (i === index ? updatedEmp : emp))
//   //     );
//   //     toast.success("Update successful");
//   //     setEditIndex(null);
//   //     setEditRow({});
//   //   } catch (error) {
//   //     toast.error("Failed to update");
//   //   }
//   // };

//   //handle upadte

//   // const handleUpdate = async (index) => {
//   //   const updatedEmp = editRow;

//   //   // ✅ Build request body according to schema
//   //   const requestBody = {
//   //     projectId, // comes from props
//   //     employeeId: updatedEmp.empId, // from editRow
//   //     laborCategoryId: updatedEmp.laborCategory, // from editRow
//   //     hoursCeiling: parseFloat(updatedEmp.hoursCeiling) || 0,
//   //     applyToRbaCode: updatedEmp.applyToRbaCode || "N", // keep user's value or fallback
//   //     employeeName: updatedEmp.employeeName || "", // ✅ new field
//   //     laborCategoryDesc: updatedEmp.laborCategoryDesc || "", // ✅ new field
//   //   };

//   //   try {
//   //     await axios.put(
//   //       `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//   //       requestBody
//   //     );

//   //     // ✅ Update local state with latest row
//   //     setEmployees((prev) =>
//   //       prev.map((emp, i) => (i === index ? { ...emp, ...requestBody } : emp))
//   //     );

//   //     toast.success("Update successful");
//   //     setEditIndex(null);
//   //     setEditRow({});
//   //   } catch (error) {
//   //     toast.error("Failed to update");
//   //   }
//   // };

//   const handleNewClick = () => {
//     const newIndex = employees.length;
//     setEmployees((prev) => [
//       ...prev,
//       {
//         projectId: "",
//         applyToRbaCode: "",
//         laborCategory: "",
//         hoursCeiling: "",
//       },
//     ]);
//     setEditIndex(newIndex);
//     setEditRow({
//       projectId: "",
//       applyToRbaCode: "",
//       laborCategory: "",
//       hoursCeiling: "",
//     });
//   };

//   // const handleSaveNew = async (index) => {
//   //   const newEmp = editRow;
//   //   if (!newEmp.empId || !newEmp.laborCategory || !newEmp.hoursCeiling) {
//   //     toast.error("Please fill all fields");
//   //     return;
//   //   }
//   //   const requestBody = {
//   //     projectId,
//   //     employeeId: newEmp.empId,
//   //     laborCategoryId: newEmp.laborCategory,
//   //     hoursCeiling: parseFloat(newEmp.hoursCeiling) || 0,
//   //     applyToRbaCode: "N",
//   //   };
//   //   try {
//   //     await axios.post(
//   //       `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//   //       requestBody
//   //     );
//   //     toast.success("Save successful");
//   //     // Refresh data
//   //     const response = await axios.get(
//   //       `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//   //     );
//   //     const data = response.data || [];
//   //     setEmployees(
//   //       Array.isArray(ceilingData)
//   //         ? ceilingData.map((emp) => ({
//   //             projectId: emp.projectId || "",
//   //             laborCategoryId: emp.laborCategoryId || "",
//   //             hoursCeiling: emp.hoursCeiling ?? 0,
//   //             applyToRbaCode: emp.applyToRbaCode || "",
//   //           }))
//   //         : []
//   //     );
//   //     setEditIndex(null);
//   //     setEditRow({});
//   //   } catch (error) {
//   //     toast.error("Failed to save");
//   //   }
//   // };

//   // const handleSaveNew = async (index) => {
//   //   const newEmp = editRow;

//   //   // Validation
//   //   if (!newEmp.empId || !newEmp.laborCategory || !newEmp.hoursCeiling) {
//   //     toast.error("Please fill all fields");
//   //     return;
//   //   }

//   //   // Prepare request body according to schema
//   //   const requestBody = {
//   //     projectId,
//   //     employeeId: newEmp.empId,
//   //     laborCategoryId: newEmp.laborCategoryId, // ✅ correct field
//   //     hoursCeiling: Number(newEmp.hoursCeiling) || 0, // ✅ always number
//   //     applyToRbaCode: newEmp.applyToRbaCode || "N",
//   //     employeeName: newEmp.employeeName || "",
//   //     laborCategoryDesc: newEmp.laborCategoryDesc || "",
//   //   };

//   //   try {
//   //     // Save to backend
//   //     await axios.post(
//   //       `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//   //       requestBody
//   //     );
//   //     toast.success("Save successful");

//   //     // Refresh list after save
//   //     const response = await axios.get(
//   //       // `${backendUrl}/Project/GetAllCeilingHrForEmp?projectId=${projectId}`
//   //       `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//   //     );

//   //     // const data = response.data || [];

//   //     // ✅ map with correct keys from API
//   //     // setEmployees(
//   //     //   Array.isArray(data)
//   //     //     ? data.map((emp) => ({
//   //     //         projectId: emp.projectId || "",
//   //     //         empId: emp.employeeId || "", // ✅ employeeId → empId
//   //     //         employeeName: emp.employeeName || "", // ✅ employeeName
//   //     //         laborCategoryId: emp.laborCategoryId || "",
//   //     //         hoursCeiling: emp.hoursCeiling ?? 0,
//   //     //         applyToRbaCode: emp.applyToRbaCode || "",
//   //     //       }))
//   //     //     : []
//   //     // API returns { success, message, data: [...] }
//   //     const ceilingData = response.data?.data || [];

//   //     setEmployees(
//   //       Array.isArray(ceilingData)
//   //         ? ceilingData.map((emp) => ({
//   //             projectId: emp.projectId || "",
//   //             empId: emp.employeeId || "",
//   //             employeeName: emp.employeeName || "",
//   //             laborCategoryId: emp.laborCategoryId || "",
//   //             laborCategoryDesc: emp.laborCategoryDesc || "", // ✅ map desc
//   //             hoursCeiling: emp.hoursCeiling ?? 0,
//   //             applyToRbaCode: emp.applyToRbaCode || "",
//   //           }))
//   //         : []
//   //     );

//   //     // Reset edit state
//   //     setEditIndex(null);
//   //     setEditRow({});
//   //   } catch (error) {
//   //     toast.error("Failed to save");
//   //   }
//   // };

//   //hand save nbew

//   // const handleSaveNew = async (index) => {
//   //   const newEmp = editRow;

//   //   // Validation (use correct field names)
//   //   // if (!newEmp.empId || !newEmp.laborCategoryId || !newEmp.hoursCeiling) {
//   //   //   toast.error("Please fill all fields");
//   //   //   return;
//   //   // }

//   //   // Prepare request body exactly as schema
//   //   const requestBody = {
//   //     projectId,
//   //     employeeId: newEmp.empId,
//   //     laborCategoryId: newEmp.laborCategoryId,
//   //     hoursCeiling: Number(newEmp.hoursCeiling) || 0,
//   //     applyToRbaCode: newEmp.applyToRbaCode || "N",
//   //     employeeName: newEmp.employeeName || "",
//   //     laborCategoryDesc: newEmp.laborCategoryDesc || "",
//   //   };

//   //   try {
//   //     await axios.post(
//   //       `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//   //       requestBody
//   //     );

//   //     toast.success("Save successful");

//   //     // Refresh after save
//   //     const response = await axios.get(
//   //       `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//   //     );

//   //     const ceilingData = response.data?.data || [];

//   //     setEmployees(
//   //       Array.isArray(ceilingData)
//   //         ? ceilingData.map((emp) => ({
//   //             projectId: emp.projectId || "",
//   //             empId: emp.employeeId?.trim() || "",
//   //             employeeName: emp.employeeName || "",
//   //             laborCategoryId: emp.laborCategoryId || "",
//   //             laborCategoryDesc: emp.laborCategoryDesc || "",
//   //             hoursCeiling: emp.hoursCeiling ?? 0,
//   //             applyToRbaCode: emp.applyToRbaCode || "",
//   //           }))
//   //         : []
//   //     );

//   //     setEditIndex(null);
//   //     setEditRow({});
//   //   } catch (error) {
//   //     console.error("Save error:", error.response?.data || error.message);
//   //     toast.error(error.response?.data?.message || "Failed to save");
//   //   }
//   // };

//   const handleCancel = (index, isNew) => {
//     if (isNew) {
//       setEmployees((prev) => prev.filter((_, i) => i !== index));
//     }
//     setEditIndex(null);
//     setEditRow({});
//   };

//   // const handleDeleteUI = (index) => {
//   //   setEmployees((prev) => prev.filter((_, i) => i !== index));
//   //   toast.info("Row deleted (UI only; implement API delete if needed)");
//   // };

//   // const handleDelete = async (index) => {
//   //   const employee = employees[index];
//   //   if (!employee) return;

//   //   try {
//   //     const response = await fetch(
//   //       `${backendUrl}/Project/DeleteCeilingHrForEmp/${employee.projectId}/${employee.empId}/${employee.laborCategoryId}`,
//   //       { method: "DELETE" }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to delete employee");
//   //     }

//   //     // ✅ Update UI
//   //     setEmployees((prev) => prev.filter((_, i) => i !== index));

//   //     // ✅ Toast success
//   //     toast.success("Employee record deleted successfully!");
//   //   } catch (error) {
//   //     console.error("Delete error:", error);
//   //     toast.error("Could not delete employee. Please try again.");
//   //   }
//   // };

//   const handleSaveNew = async (index) => {
//     const newEmp = editRow;

//     // Validation
//     if (!newEmp.empId || !newEmp.laborCategoryId || !newEmp.hoursCeiling) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     const requestBody = {
//       projectId,
//       employeeId: newEmp.empId,
//       laborCategoryId: newEmp.laborCategoryId,
//       hoursCeiling: Number(newEmp.hoursCeiling) || 0,
//       applyToRbaCode: newEmp.applyToRbaCode || "N",
//       employeeName: newEmp.employeeName || "",
//       laborCategoryDesc: newEmp.laborCategoryDesc || "",
//     };

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       toast.success("Save successful");

//       // Refresh after save
//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
//       );
//       const ceilingData = response.data?.data || [];

//       setEmployees(
//         ceilingData.map((emp) => ({
//           projectId: emp.projectId || "",
//           empId: emp.employeeId || "",
//           employeeName: emp.employeeName || "",
//           laborCategoryId: emp.laborCategoryId || "",
//           laborCategoryDesc: emp.laborCategoryDesc || "",
//           hoursCeiling: emp.hoursCeiling ?? 0,
//           applyToRbaCode: emp.applyToRbaCode || "",
//         }))
//       );

//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       console.error("Save error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to save");
//     }
//   };

//   // ----------------------------
//   // Update Existing
//   // ----------------------------
//   const handleUpdate = async (index) => {
//     const updatedEmp = editRow;

//     const requestBody = {
//       projectId,
//       employeeId: updatedEmp.empId,
//       laborCategoryId: updatedEmp.laborCategoryId,
//       hoursCeiling: Number(updatedEmp.hoursCeiling) || 0,
//       applyToRbaCode: updatedEmp.applyToRbaCode || "N",
//       employeeName: updatedEmp.employeeName || "",
//       laborCategoryDesc: updatedEmp.laborCategoryDesc || "",
//     };

//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody
//       );

//       setEmployees((prev) =>
//         prev.map((emp, i) => (i === index ? { ...emp, ...requestBody } : emp))
//       );

//       toast.success("Update successful");
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       console.error("Update error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to update");
//     }
//   };

//   // ----------------------------
//   // Delete
//   // ----------------------------
//   const handleDelete = async (index) => {
//     const employee = employees[index];
//     if (!employee) return;

//     try {
//       const response = await fetch(
//         `${backendUrl}/Project/DeleteCeilingHrForEmp/${employee.projectId}/${employee.empId}/${employee.laborCategoryId}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) throw new Error("Failed to delete employee");

//       setEmployees((prev) => prev.filter((_, i) => i !== index));
//       toast.success("Employee record deleted successfully!");
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Could not delete employee. Please try again.");
//     }
//   };

//   if (!isSearched) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   if (!isValidId) {
//     return <div className="text-red-600">Invalid project ID.</div>;
//   }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Employee Hours Ceilings
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">
//               Project:
//             </label>
//             <span className="text-sm text-gray-900">{projectId}</span>
//             <span className="ml-4 text-sm text-gray-900">Org ID: 1.02</span>
//           </div>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>
//         {employees.length === 0 && isDataFetched ? (
//           <p className="text-gray-600">
//             No data available for this project ID.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Empl ID
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Employee Name
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Labor Category
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Labor Desc
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Hours Ceiling
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((emp, index) => (
//                   <tr
//                     key={emp.projectId || index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`empSuggestions-${index}`}
//                             value={editRow.empId || ""}
//                             onChange={(e) =>
//                               handleEmployeeIdChange(index, e.target.value)
//                             }
//                             className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                             placeholder="Search Empl ID"
//                           />
//                           <datalist id={`empSuggestions-${index}`}>
//                             {employeeSuggestions.map((sug) => (
//                               <option key={sug.empId} value={sug.empId}>
//                                 {sug.empId} - {sug.applyToRbaCode}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.empId
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.employeeName || ""}
//                           disabled
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         emp.employeeName // ✅ employeeName
//                       )}
//                     </td>
//                     {/* <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.applyToRbaCode || ""}
//                           disabled
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         emp.applyToRbaCode
//                       )}
//                     </td> */}
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`laborSuggestions-${index}`}
//                             value={editRow.laborCategory || ""}
//                             onChange={(e) =>
//                               handleLaborCategoryChange(index, e.target.value)
//                             }
//                             className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                             placeholder="Search Labor Category"
//                           />
//                           <datalist id={`laborSuggestions-${index}`}>
//                             {laborCategories.map((cat, idx) => (
//                               <option key={idx} value={cat.laborCategoryCode}>
//                                 {cat.laborCategoryCode} - {cat.description}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.laborCategoryId
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.laborCategoryDesc || ""}
//                           disabled
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         emp.laborCategoryDesc || ""
//                       )}
//                     </td>

//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           value={editRow.hoursCeiling || ""}
//                           onChange={(e) =>
//                             handleEditChange("hoursCeiling", e.target.value)
//                           }
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                           placeholder="0.00"
//                         />
//                       ) : (
//                         emp.hoursCeiling
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() =>
//                               emp.projectId
//                                 ? handleUpdate(index)
//                                 : handleSaveNew(index)
//                             }
//                             className="text-green-700 hover:text-green-800"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaSave size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleCancel(index, !emp.projectId)}
//                             className="text-gray-500 hover:text-gray-700"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaTimes size={16} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="text-blue-400 hover:text-blue-700"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="text-gray-400 hover:text-gray-800"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// import { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { FaSave, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const EmployeeHoursCeilings = ({
  projectId,
  isSearched,
  updatedBy = "user",
}) => {
  const [employees, setEmployees] = useState([]);
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [laborCategories, setLaborCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    empId: "",
    employeeName: "",
    laborCategoryId: "",
    laborCategoryDesc: "",
    hoursCeiling: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Validate projectId
  const isValidProjectId = (id) => !!id;

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);
        try {
          const [empResponse, ceilingResponse, laborResponse] =
            await Promise.all([
              axios.get(
                `${backendUrl}/Project/GetEmployeesByProject/${projectId}`
              ),
              axios.get(
                `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`
              ),
              axios.get(`${backendUrl}/Project/GetAllPlcs/W`),
            ]);

          if (isMounted) {
            setEmployeeSuggestions(empResponse.data || []);
            setEmployees(
              Array.isArray(ceilingResponse.data?.data)
                ? ceilingResponse.data.data.map((emp) => ({
                    projectId: emp.projectId || "",
                    empId: emp.employeeId?.trim() || "",
                    employeeName: emp.employeeName || "",
                    laborCategoryId: emp.laborCategoryId || "",
                    laborCategoryDesc: emp.laborCategoryDesc || "",
                    hoursCeiling: emp.hoursCeiling ?? 0,
                    applyToRbaCode: emp.applyToRbaCode || "",
                  }))
                : []
            );
            setLaborCategories(laborResponse.data || []);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          if (isMounted) {
            setEmployees([]);
            setEmployeeSuggestions([]);
            setLaborCategories([]);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
            toast.error("Failed to fetch project details.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
            setShowNewRow(false);
          }
        }
      } else if (isMounted) {
        setEmployees([]);
        setEmployeeSuggestions([]);
        setLaborCategories([]);
        setIsLoading(false);
        setShowNewRow(false);
        setLastSearchedProjectId("");
        setHasSearched(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [projectId, isSearched]);

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  // Handle new employee row
  const handleNewClick = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }
    setShowNewRow(true);
    setNewRow({
      empId: "",
      employeeName: "",
      laborCategoryId: "",
      laborCategoryDesc: "",
      hoursCeiling: "",
    });
  };

  // Handle employee ID change for new row
  const handleNewEmployeeIdChange = (value) => {
    const selected = employeeSuggestions.find((sug) => sug.empId === value);
    setNewRow((prev) => ({
      ...prev,
      empId: value,
      employeeName: selected ? selected.employeeName : "",
    }));
  };

  // Handle labor category change for new row
  const handleNewLaborCategoryChange = (value) => {
    const selected = laborCategories.find(
      (cat) => cat.laborCategoryCode === value
    );
    setNewRow((prev) => ({
      ...prev,
      laborCategoryId: value,
      laborCategoryDesc: selected ? selected.description : "",
    }));
  };

  // Save new employee
  const handleSave = async () => {
    if (!newRow.empId || !newRow.laborCategoryId || !newRow.hoursCeiling) {
      toast.error("Please fill all fields.");
      return;
    }
    const requestBody = {
      projectId,
      employeeId: newRow.empId,
      laborCategoryId: newRow.laborCategoryId,
      hoursCeiling: Number(newRow.hoursCeiling) || 0,
      applyToRbaCode: "N",
      employeeName: newRow.employeeName || "",
      laborCategoryDesc: newRow.laborCategoryDesc || "",
    };
    try {
      await axios.post(
        `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
        requestBody
      );
      toast.success("Saved successfully.");
      const response = await axios.get(
        `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${lastSearchedProjectId}`
      );
      setEmployees(
        Array.isArray(response.data?.data)
          ? response.data.data.map((emp) => ({
              projectId: emp.projectId || "",
              empId: emp.employeeId?.trim() || "",
              employeeName: emp.employeeName || "",
              laborCategoryId: emp.laborCategoryId || "",
              laborCategoryDesc: emp.laborCategoryDesc || "",
              hoursCeiling: emp.hoursCeiling ?? 0,
              applyToRbaCode: emp.applyToRbaCode || "",
            }))
          : []
      );
      setShowNewRow(false);
      setNewRow({
        empId: "",
        employeeName: "",
        laborCategoryId: "",
        laborCategoryDesc: "",
        hoursCeiling: "",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save. Please check your input and try again.");
    }
  };

  // Cancel new row
  const handleCancelNewRow = () => {
    setShowNewRow(false);
    setNewRow({
      empId: "",
      employeeName: "",
      laborCategoryId: "",
      laborCategoryDesc: "",
      hoursCeiling: "",
    });
    toast.info("New row canceled.");
  };

  // Handle edit click
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditRow({ ...employees[index] });
  };

  // Handle edit field change
  const handleEditChange = (field, value) => {
    setEditRow((prev) => ({ ...prev, [field]: value }));
  };

  // Handle employee ID change for edit row
  const handleEmployeeIdChange = (index, value) => {
    const selected = employeeSuggestions.find((sug) => sug.empId === value);
    setEditRow((prev) => ({
      ...prev,
      empId: value,
      employeeName: selected ? selected.employeeName : "",
    }));
  };

  // Handle labor category change for edit row
  const handleLaborCategoryChange = (index, value) => {
    const selected = laborCategories.find(
      (cat) => cat.laborCategoryCode === value
    );
    setEditRow((prev) => ({
      ...prev,
      laborCategoryId: value,
      laborCategoryDesc: selected ? selected.description : "",
    }));
  };

  // Update existing employee
  const handleUpdate = async (index) => {
    const updatedEmp = editRow;
    if (
      !updatedEmp.empId ||
      !updatedEmp.laborCategoryId ||
      !updatedEmp.hoursCeiling
    ) {
      toast.error("Please fill all fields.");
      return;
    }
    const requestBody = {
      projectId,
      employeeId: updatedEmp.empId,
      laborCategoryId: updatedEmp.laborCategoryId,
      hoursCeiling: Number(updatedEmp.hoursCeiling) || 0,
      applyToRbaCode: updatedEmp.applyToRbaCode || "N",
      employeeName: updatedEmp.employeeName || "",
      laborCategoryDesc: updatedEmp.laborCategoryDesc || "",
    };
    try {
      await axios.put(
        `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
        requestBody
      );
      setEmployees((prev) =>
        prev.map((emp, i) => (i === index ? { ...emp, ...requestBody } : emp))
      );
      toast.success("Update successful");
      setEditIndex(null);
      setEditRow({});
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update.");
    }
  };

  // Delete employee
  const handleDelete = async (index) => {
    const employee = employees[index];
    if (!employee) return;
    try {
      await axios.delete(
        `${backendUrl}/Project/DeleteCeilingHrForEmp/${employee.projectId}/${employee.empId}/${employee.laborCategoryId}`
      );
      setEmployees((prev) => prev.filter((_, i) => i !== index));
      toast.success("Employee record deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Could not delete employee. Please try again.");
    }
  };

  if (!shouldShowTable) {
    return (
      <div className="text-gray-600">
        Please search for a project to view details.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ToastContainer />
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Employee Hours Ceilings
          </h2>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Project:
            </label>
            <span className="text-sm text-gray-900">
              {lastSearchedProjectId}
            </span>
          </div>
          <button
            className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
            onClick={handleNewClick}
          >
            New
          </button>
        </div>
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : employees.length === 0 && !showNewRow ? (
          <p className="text-gray-600">
            No data available for this project ID.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Empl ID
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Employee Name
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Labor Category
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Labor Desc
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Hours Ceiling
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {showNewRow && (
                  <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-2 py-1">
                      <input
                        list="emp-suggestions"
                        value={newRow.empId}
                        onChange={(e) =>
                          handleNewEmployeeIdChange(e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                        placeholder="Search Empl ID"
                      />
                      <datalist id="emp-suggestions">
                        {employeeSuggestions.map((sug) => (
                          <option key={sug.empId} value={sug.empId}>
                            {sug.empId} - {sug.employeeName}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {newRow.employeeName}
                    </td>
                    <td className="px-2 py-1">
                      <input
                        list="labor-suggestions"
                        value={newRow.laborCategoryId}
                        onChange={(e) =>
                          handleNewLaborCategoryChange(e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                        placeholder="Search Labor Category"
                      />
                      <datalist id="labor-suggestions">
                        {laborCategories.map((cat) => (
                          <option
                            key={cat.laborCategoryCode}
                            value={cat.laborCategoryCode}
                          >
                            {cat.laborCategoryCode} - {cat.description}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {newRow.laborCategoryDesc}
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={newRow.hoursCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            hoursCeiling: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-1 flex gap-1">
                      <button
                        onClick={handleSave}
                        className="text-green-700 hover:text-green-800"
                        style={{ background: "none", border: "none" }}
                      >
                        <FaSave size={16} />
                      </button>
                      <button
                        onClick={handleCancelNewRow}
                        className="text-gray-500 hover:text-gray-700"
                        style={{ background: "none", border: "none" }}
                      >
                        <FaTimes size={16} />
                      </button>
                    </td>
                  </tr>
                )}
                {employees.map((emp, index) => (
                  <tr
                    key={`${emp.projectId}-${emp.empId}-${index}`}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {editIndex === index ? (
                        <>
                          <input
                            list={`empSuggestions-${index}`}
                            value={editRow.empId || ""}
                            onChange={(e) =>
                              handleEmployeeIdChange(index, e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                            placeholder="Search Empl ID"
                          />
                          <datalist id={`empSuggestions-${index}`}>
                            {employeeSuggestions.map((sug) => (
                              <option key={sug.empId} value={sug.empId}>
                                {sug.empId} - {sug.employeeName}
                              </option>
                            ))}
                          </datalist>
                        </>
                      ) : (
                        emp.empId
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editRow.employeeName || ""}
                          disabled
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                        />
                      ) : (
                        emp.employeeName
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {editIndex === index ? (
                        <>
                          <input
                            list={`laborSuggestions-${index}`}
                            value={editRow.laborCategoryId || ""}
                            onChange={(e) =>
                              handleLaborCategoryChange(index, e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                            placeholder="Search Labor Category"
                          />
                          <datalist id={`laborSuggestions-${index}`}>
                            {laborCategories.map((cat) => (
                              <option
                                key={cat.laborCategoryCode}
                                value={cat.laborCategoryCode}
                              >
                                {cat.laborCategoryCode} - {cat.description}
                              </option>
                            ))}
                          </datalist>
                        </>
                      ) : (
                        emp.laborCategoryId
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editRow.laborCategoryDesc || ""}
                          disabled
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                        />
                      ) : (
                        emp.laborCategoryDesc
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 font-normal">
                      {editIndex === index ? (
                        <input
                          type="number"
                          value={editRow.hoursCeiling || ""}
                          onChange={(e) =>
                            handleEditChange("hoursCeiling", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
                          placeholder="0"
                        />
                      ) : (
                        emp.hoursCeiling
                      )}
                    </td>
                    <td className="px-2 py-1 flex gap-1">
                      {editIndex === index ? (
                        <>
                          <button
                            onClick={() => handleUpdate(index)}
                            className="text-green-700 hover:text-green-800"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaSave size={16} />
                          </button>
                          <button
                            onClick={() => setEditIndex(null)}
                            className="text-gray-500 hover:text-gray-700"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(index)}
                            className="text-blue-400 hover:text-blue-700"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-gray-800"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaTrash size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHoursCeilings;
