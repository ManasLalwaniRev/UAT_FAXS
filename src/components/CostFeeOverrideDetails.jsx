// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { backendUrl } from "./config";

// const applyToRBAOptions = [
//   { value: "R", label: "Revenue" },
//   { value: "B", label: "Billing" },
//   { value: "A", label: "All" },
//   { value: "N", label: "None" },
// ];

// const CostFeeOverrideDetails = ({
//   projectId,
//   isSearched,
//   updatedBy = "user",
// }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [costFeeOverrides, setCostFeeOverrides] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Validate projectId format (e.g., "PROJ123")
//   const isValidProjectId = (id) => !!id;

//   useEffect(() => {
//     let isMounted = true;
//     const fetchAccounts = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAccountsByProjectId/${projectId}`
//           );
//           if (isMounted) {
//             setAccounts(res.data || []);
//             // Initialize cost fee overrides based on accounts
//             const initialOverrides = (res.data || []).map((account) => ({
//               accountId: account.acctId,
//               accountName: account.acctName,
//               feePercent: "0.000000%",
//               functionalCurrencyFeeOnHours: "0.0000",
//               applyToRbaCode: "A",
//             }));
//             setCostFeeOverrides(initialOverrides);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch {
//           if (isMounted) {
//             setAccounts([]);
//             setCostFeeOverrides([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } finally {
//           if (isMounted) setIsLoading(false);
//         }
//       } else if (isMounted) {
//         setAccounts([]);
//         setCostFeeOverrides([]);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//         setIsLoading(false);
//       }
//     };
//     fetchAccounts();
//     return () => {
//       isMounted = false;
//     };
//   }, [isSearched, projectId]);

//   // Only show table if last search was valid and not blank
//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({
//       accountId: costFeeOverrides[index].accountId,
//       functionalCurrencyFeeOnHours:
//         costFeeOverrides[index].functionalCurrencyFeeOnHours,
//       applyToRbaCode: costFeeOverrides[index].applyToRbaCode,
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const updatedRow = {
//       ...costFeeOverrides[index],
//       accountId: editRow.accountId,
//       functionalCurrencyFeeOnHours: editRow.functionalCurrencyFeeOnHours,
//       applyToRbaCode: editRow.applyToRbaCode,
//     };
//     const updatedOverrides = [...costFeeOverrides];
//     updatedOverrides[index] = updatedRow;
//     setCostFeeOverrides(updatedOverrides);
//     setEditIndex(null);
//     setEditRow({});
//     // Note: This is UI-only update; actual API call would be needed for persistence
//   };

//   const handleDelete = (index) => {
//     const updatedOverrides = costFeeOverrides.filter((_, i) => i !== index);
//     setCostFeeOverrides(updatedOverrides);
//     setEditIndex(null);
//     setEditRow({});
//     // Note: This is UI-only delete; actual API call would be needed for persistence
//   };

//   // if (!shouldShowTable) {
//   //   return (
//   //     <div className="text-gray-600">
//   //       Please search for a project to view details.
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="animate-fade-in">
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <h2 className="text-xl font-bold text-gray-900 mb-2">
//           Cost Fee Override Details
//         </h2>
//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : costFeeOverrides.length === 0 ? (
//           <p className="text-gray-600">No data available.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Account
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Account Name
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Fee Percent
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Functional Currency Fee on Hours
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Apply to R/B/A
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {costFeeOverrides.map((override, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <select
//                           name="accountId"
//                           value={editRow.accountId}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         >
//                           {accounts.map((account) => (
//                             <option key={account.acctId} value={account.acctId}>
//                               {account.acctId}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <span className="font-normal">
//                           {override.accountId}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {override.accountName}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {override.feePercent}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="functionalCurrencyFeeOnHours"
//                           value={editRow.functionalCurrencyFeeOnHours}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         <span className="font-normal">
//                           {override.functionalCurrencyFeeOnHours}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <select
//                           name="applyToRbaCode"
//                           value={editRow.applyToRbaCode}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         >
//                           {applyToRBAOptions.map((option) => (
//                             <option key={option.value} value={option.value}>
//                               {option.label}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <span className="font-normal">
//                           {override.applyToRbaCode}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-2 py-1">
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
//                             className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs mr-1"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
//                           >
//                             Delete
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

// export default CostFeeOverrideDetails;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { FaSave, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";

// const CostFeeOverrideDetails = ({
//   projectId,
//   isSearched,
//   updatedBy = "System",
// }) => {
//   const [costFeeOverrides, setCostFeeOverrides] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     feePercent: "",
//     functionalCurrencyFeeOnHours: "",
//     applyToRbaCode: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);

//   const isValidProjectId = (id) => !!id;

//   // Fetch override + accounts
//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const [overridesRes, accountsRes] = await Promise.all([
//             axios.get(
//               `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//             ),
//           ]);

//           if (isMounted) {
//             setCostFeeOverrides(overridesRes.data?.data || []);
//             setAccounts(accountsRes.data || []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch (error) {
//           if (isMounted) {
//             setCostFeeOverrides([]);
//             setAccounts([]);
//             toast.error("Failed to fetch cost fee overrides.");
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (isMounted) {
//         setCostFeeOverrides([]);
//         setAccounts([]);
//         setIsLoading(false);
//         setShowNewRow(false);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//       }
//     };

//     fetchData();
//     return () => {
//       isMounted = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   const handleNewClick = () => {
//     if (!shouldShowTable) {
//       toast.warning("Please search for a valid project first.");
//       return;
//     }
//     setShowNewRow(true);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       feePercent: "",
//       functionalCurrencyFeeOnHours: "",
//       applyToRbaCode: "",
//     });
//   };

//   const handleSave = async () => {
//     if (!newRow.accountId || !newRow.feePercent) {
//       toast.warning("Please fill required fields.");
//       return;
//     }

//     const requestBody = {
//       projectId,
//       ...newRow,
//     };

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCostFeeOverride`,
//         requestBody,
//         { params: { updatedBy } }
//       );
//       toast.success("Saved successfully.");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetCostFeeOverrides`,
//         { params: { projId: lastSearchedProjectId } }
//       );
//       setCostFeeOverrides(response.data?.data || []);

//       setShowNewRow(false);
//       setNewRow({
//         accountId: "",
//         accountName: "",
//         feePercent: "",
//         functionalCurrencyFeeOnHours: "",
//         applyToRbaCode: "",
//       });
//     } catch (error) {
//       console.error("Save error:", error);
//       toast.error("Failed to save.");
//     }
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({ ...costFeeOverrides[index] });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const row = costFeeOverrides[index];
//     if (!row) return;

//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCostFeeOverride`,
//         { ...editRow, projectId: lastSearchedProjectId },
//         { params: { updatedBy } }
//       );

//       toast.success("Updated successfully.");
//       const response = await axios.get(
//         `${backendUrl}/Project/GetCostFeeOverrides`,
//         { params: { projId: lastSearchedProjectId } }
//       );
//       setCostFeeOverrides(response.data?.data || []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Error updating record.");
//     }
//   };

//   const handleDelete = async (index) => {
//     const row = costFeeOverrides[index];
//     if (!row) return;

//     try {
//       await axios.delete(
//         `${backendUrl}/Project/DeleteCostFeeOverride/${row.projectId}/${row.accountId}`
//       );
//       setCostFeeOverrides((prev) => prev.filter((_, i) => i !== index));
//       toast.success("Deleted successfully");
//     } catch (error) {
//       toast.error("Error deleting record");
//     }
//   };

//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       feePercent: "",
//       functionalCurrencyFeeOnHours: "",
//       applyToRbaCode: "",
//     });
//     toast.info("New row canceled.");
//   };

//   // if (!shouldShowTable) {
//   //   return (
//   //     <div className="text-gray-600">
//   //       Please search for a project to view details.
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Cost Fee Overrides
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">
//               Project:
//             </label>
//             <span className="text-sm text-gray-900">
//               {lastSearchedProjectId}
//             </span>
//           </div>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>

//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : costFeeOverrides.length === 0 && !showNewRow ? (
//           <p className="text-gray-600">
//             No data available for this project ID.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Account
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Account Name
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Fee %
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Fee on Hours
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Apply to R/B/A
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-2 py-1">
//                       <select
//                         value={newRow.accountId}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             accountId: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                       >
//                         <option value="">Select</option>
//                         {accounts.map((acc) => (
//                           <option key={acc.acctId} value={acc.acctId}>
//                             {acc.acctId}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-2 py-1 text-xs">{newRow.accountName}</td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="text"
//                         value={newRow.feePercent}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             feePercent: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="text"
//                         value={newRow.functionalCurrencyFeeOnHours}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             functionalCurrencyFeeOnHours: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="text"
//                         value={newRow.applyToRbaCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             applyToRbaCode: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       <button
//                         onClick={handleSave}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <FaSave />
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <FaTimes />
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 {costFeeOverrides.map((row, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs">{row.accountId}</td>
//                     <td className="px-2 py-1 text-xs">{row.accountName}</td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="feePercent"
//                           value={editRow.feePercent}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.feePercent
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="functionalCurrencyFeeOnHours"
//                           value={editRow.functionalCurrencyFeeOnHours}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.functionalCurrencyFeeOnHours
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="applyToRbaCode"
//                           value={editRow.applyToRbaCode}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.applyToRbaCode
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="text-blue-500 hover:text-blue-700"
//                           >
//                             <FaSave />
//                           </button>
//                           <button
//                             onClick={() => setEditIndex(null)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTimes />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="text-yellow-500 hover:text-yellow-700"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="text-red-500 hover:text-red-700"
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

// export default CostFeeOverrideDetails;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaTrash, FaSave, FaTimes, FaEdit } from "react-icons/fa";
// import { backendUrl } from "./config";
// // replace with your backend URL

// const CostFeeOverrideDetails = ({
//   projectId,
//   isSearched,
//   updatedBy = "System",
// }) => {
//   const [overrides, setOverrides] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     costCeiling: "",
//     feeCeiling: "",
//     totalValueCeiling: "",
//     ceilingCode: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);

//   const applyToRBAOptions = [
//     { value: "", label: "Select" },
//     { value: "R", label: "Revenue" },
//     { value: "B", label: "Billing" },
//     { value: "A", label: "All" },
//     { value: "N", label: "None" },
//   ];

//   const isValidProjectId = (id) => !!id;

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//             { params: { projId: projectId } }
//           );
//           if (isMounted) {
//             setOverrides(response.data?.data || []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch (error) {
//           if (isMounted) {
//             setOverrides([]);
//             toast.error("Failed to fetch cost fee override details ");
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (isMounted) {
//         setOverrides([]);
//         setIsLoading(false);
//         setShowNewRow(false);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//       }
//     };

//     fetchData();
//     return () => {
//       isMounted = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // 🔹 Handle new row
//   const handleNewClick = () => {
//     if (!shouldShowTable) {
//       toast.warning("Please search for a valid project first.");
//       return;
//     }
//     setShowNewRow(true);
//     setNewRow({
//       costCeiling: "",
//       feeCeiling: "",
//       totalValueCeiling: "",
//       ceilingCode: "",
//     });
//   };

//   const handleSave = async () => {
//     if (!newRow.costCeiling || !newRow.feeCeiling) {
//       toast.warning("Please fill required fields.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForTotalProjectCost`,
//         { projectId, ...newRow },
//         { params: { updatedBy } }
//       );
//       toast.success("Saved successfully ");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//         { params: { projId: lastSearchedProjectId } }
//       );
//       setOverrides(response.data?.data || []);
//       setShowNewRow(false);
//     } catch (error) {
//       toast.error("Failed to save ");
//     }
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({ ...overrides[index] });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForTotalProjectCost`,
//         { ...editRow, projectId: lastSearchedProjectId },
//         { params: { updatedBy } }
//       );
//       toast.success("Updated successfully ");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//         { params: { projId: lastSearchedProjectId } }
//       );
//       setOverrides(response.data?.data || []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Error updating record ");
//     }
//   };

//   const handleDelete = async (index) => {
//     const row = overrides[index];
//     if (!row) return;

//     try {
//       await axios.delete(
//         `${backendUrl}/Project/DeleteCeilingAmtForTotalProjectCostAsync/${row.projectId}`
//       );
//       setOverrides((prev) => prev.filter((_, i) => i !== index));
//       toast.success("Deleted successfully 🗑️");
//     } catch (error) {
//       toast.error("Error deleting record ");
//     }
//   };

//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       costCeiling: "",
//       feeCeiling: "",
//       totalValueCeiling: "",
//       ceilingCode: "",
//     });
//     toast.info("New row canceled.");
//   };

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Cost Fee Overrides
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">
//               Project:
//             </label>
//             <span className="text-sm text-gray-900">
//               {lastSearchedProjectId}
//             </span>
//           </div>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>

//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : overrides.length === 0 && !showNewRow ? (
//           <p className="text-gray-600">
//             No data available for this project ID.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Project ID
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Cost Ceiling
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Fee Ceiling
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Total Value Ceiling
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Ceiling Code
//                   </th>
//                   <th className="px-2 py-1 text-xs font-semibold text-gray-700">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-2 py-1 text-xs">
//                       {lastSearchedProjectId}
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="number"
//                         value={newRow.costCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             costCeiling: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="number"
//                         value={newRow.feeCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             feeCeiling: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="number"
//                         value={newRow.totalValueCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             totalValueCeiling: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td>
//                     {/* <td className="px-2 py-1">
//                       <input
//                         type="text"
//                         value={newRow.ceilingCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             ceilingCode: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       />
//                     </td> */}
//                     <td className="px-2 py-1 text-center">
//                       <select
//                         value={newRow.applyToRbaCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             applyToRbaCode: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                       >
//                         {applyToRBAOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       <button
//                         onClick={handleSave}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <FaSave />
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <FaTimes />
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 {overrides.map((row, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs">{row.projectId}</td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="costCeiling"
//                           value={editRow.costCeiling}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.costCeiling
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="feeCeiling"
//                           value={editRow.feeCeiling}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.feeCeiling
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="totalValueCeiling"
//                           value={editRow.totalValueCeiling}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.totalValueCeiling
//                       )}
//                     </td>
//                     {/* <td className="px-2 py-1 text-xs">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="ceilingCode"
//                           value={editRow.ceilingCode}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         />
//                       ) : (
//                         row.ceilingCode
//                       )}
//                     </td> */}
//                     <td className="px-2 py-1 text-xs text-gray-900 text-center">
//                       {editIndex === index ? (
//                         <select
//                           name="applyToRbaCode"
//                           value={editRow.applyToRbaCode}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                         >
//                           {applyToRBAOptions.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         row.ceilingCode
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="text-blue-500 hover:text-blue-700"
//                           >
//                             <FaSave />
//                           </button>
//                           <button
//                             onClick={() => setEditIndex(null)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTimes />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="text-yellow-500 hover:text-yellow-700"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="text-red-500 hover:text-red-700"
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

// export default CostFeeOverrideDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSave, FaTimes, FaEdit } from "react-icons/fa";
import { backendUrl } from "./config"; // replace with your backend URL

const CostFeeOverrideDetails = ({
  projectId,
  isSearched,
  updatedBy = "System",
}) => {
  const [overrides, setOverrides] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    costCeiling: "",
    feeCeiling: "",
    totalValueCeiling: "",
    ceilingCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const applyToRBAOptions = [
    { value: "", label: "Select" },
    { value: "R", label: "Revenue" },
    { value: "B", label: "Billing" },
    { value: "A", label: "All" },
    { value: "N", label: "None" },
  ];

  const isValidProjectId = (id) => !!id;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
            { params: { projId: projectId } }
          );
          if (isMounted) {
            setOverrides(response.data?.data || []);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } catch (error) {
          if (isMounted) {
            setOverrides([]);
            toast.error("Failed to fetch cost fee override details ");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
            setShowNewRow(false);
          }
        }
      } else if (isMounted) {
        setOverrides([]);
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
  }, [isSearched, projectId]);

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  const handleNewClick = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }
    setShowNewRow(true);
    setNewRow({
      costCeiling: "",
      feeCeiling: "",
      totalValueCeiling: "",
      ceilingCode: "",
    });
  };

  const handleSave = async () => {
    if (!newRow.costCeiling || !newRow.feeCeiling) {
      toast.warning("Please fill required fields.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/Project/CreateCeilingAmtForTotalProjectCost`,
        { projectId, ...newRow },
        { params: { updatedBy } }
      );
      toast.success("Saved successfully ");

      const response = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
        { params: { projId: lastSearchedProjectId } }
      );
      setOverrides(response.data?.data || []);
      setShowNewRow(false);
    } catch (error) {
      toast.error("Failed to save ");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditRow({ ...overrides[index] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (index) => {
    try {
      await axios.put(
        `${backendUrl}/Project/UpdateCeilingAmtForTotalProjectCost`,
        { ...editRow, projectId: lastSearchedProjectId },
        { params: { updatedBy } }
      );
      toast.success("Updated successfully ");

      const response = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
        { params: { projId: lastSearchedProjectId } }
      );
      setOverrides(response.data?.data || []);
      setEditIndex(null);
      setEditRow({});
    } catch (error) {
      toast.error("Error updating record ");
    }
  };

  const handleDelete = async (index) => {
    const row = overrides[index];
    if (!row) return;

    try {
      await axios.delete(
        `${backendUrl}/Project/DeleteCeilingAmtForTotalProjectCostAsync/${row.projectId}`
      );
      setOverrides((prev) => prev.filter((_, i) => i !== index));
      toast.success("Deleted successfully 🗑️");
    } catch (error) {
      toast.error("Error deleting record ");
    }
  };

  const handleCancelNewRow = () => {
    setShowNewRow(false);
    setNewRow({
      costCeiling: "",
      feeCeiling: "",
      totalValueCeiling: "",
      ceilingCode: "",
    });
    toast.info("New row canceled.");
  };

  return (
    <div className="animate-fade-in">
      <ToastContainer />
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Cost Fee Overrides
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
        ) : overrides.length === 0 && !showNewRow ? (
          <p className="text-gray-600">
            No data available for this project ID.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  {/* <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Project ID
                  </th> */}
                  <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Cost Ceiling
                  </th>
                  <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Fee Ceiling
                  </th>
                  <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Total Value Ceiling
                  </th>
                  <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Ceiling Code
                  </th>
                  <th className="px-2 py-1 text-xs font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {showNewRow && (
                  <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    {/* <td className="px-2 py-1 text-xs">
                      {lastSearchedProjectId}
                    </td> */}
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={newRow.costCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            costCeiling: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={newRow.feeCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            feeCeiling: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={newRow.totalValueCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            totalValueCeiling: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <select
                        name="ceilingCode"
                        value={newRow.ceilingCode}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            ceilingCode: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
                      >
                        {applyToRBAOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
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

                {overrides.map((row, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    {/* <td className="px-2 py-1 text-xs">{row.projectId}</td> */}
                    <td className="px-2 py-1 text-xs">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="costCeiling"
                          value={editRow.costCeiling}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                        />
                      ) : (
                        row.costCeiling
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="feeCeiling"
                          value={editRow.feeCeiling}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                        />
                      ) : (
                        row.feeCeiling
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="totalValueCeiling"
                          value={editRow.totalValueCeiling}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                        />
                      ) : (
                        row.totalValueCeiling
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-center">
                      {editIndex === index ? (
                        <select
                          name="ceilingCode"
                          value={editRow.ceilingCode}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
                        >
                          {applyToRBAOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.ceilingCode
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

export default CostFeeOverrideDetails;
