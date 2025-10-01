// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const DirectCostCeilings = ({ projectId, isSearched, updatedBy = "user" }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [directCostCeilings, setDirectCostCeilings] = useState([]);
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     ceilingAmountFunc: "",
//   });
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Validate projectId format (e.g., "PROJ123")
//   const isValidProjectId = (id) => id && /^PROJ\d{3}$/.test(id);

//   // Fetch all accounts
//   useEffect(() => {
//     let isMounted = true;
//     const fetchAccounts = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAccountsByProjectId/${projectId}`
//           );
//           if (isMounted) setAccounts(res.data || []);
//         } catch {
//           if (isMounted) setAccounts([]);
//         }
//       } else if (isMounted) {
//         setAccounts([]);
//       }
//     };
//     fetchAccounts();
//     return () => { isMounted = false; };
//   }, [isSearched, projectId]);

//   // Fetch direct cost ceilings
//   useEffect(() => {
//     let isMounted = true;
//     const fetchDirectCostCeilings = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`
//           );
//           if (isMounted) {
//             setDirectCostCeilings(res.data?.data || []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch {
//           if (isMounted) {
//             setDirectCostCeilings([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (isMounted) {
//         setDirectCostCeilings([]);
//         setShowNewRow(false);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//         setIsLoading(false);
//       }
//     };
//     fetchDirectCostCeilings();
//     return () => { isMounted = false; };
//   }, [isSearched, projectId]);

//   // Only show table if last search was valid and not blank
//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // Show new row
//   const handleNewClick = () => {
//     setShowNewRow(true);
//     setNewRow({
//       accountId: "",
//       ceilingAmountFunc: "",
//     });
//   };

//   // Handle new row changes
//   const handleNewChange = (e) => {
//     const { name, value } = e.target;
//     setNewRow((prev) => ({ ...prev, [name]: value }));
//   };

//   // Save new direct cost ceiling
//   const handleSave = async () => {
//     if (!newRow.accountId || !newRow.ceilingAmountFunc) {
//       alert("Please fill all required fields.");
//       return;
//     }
//     if (!updatedBy) {
//       alert("updatedBy is required. Please provide a user name.");
//       return;
//     }
//     const requestBody = {
//       projectId: lastSearchedProjectId,
//       accountId: newRow.accountId,
//       ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
//       ceilingAmountBilling: 0,
//       applyToRbaCode: "R",
//     };
//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(res.data?.data || []);
//       setShowNewRow(false);
//       setNewRow({
//         accountId: "",
//         ceilingAmountFunc: "",
//       });
//     } catch (err) {
//       alert("Failed to save. Please check your input and try again.");
//     }
//   };

//   // Edit row handlers
//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({
//       ceilingAmountFunc: directCostCeilings[index].ceilingAmountFunc,
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const row = directCostCeilings[index];
//     const requestBody = {
//       projectId: row.projectId,
//       accountId: row.accountId,
//       ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
//       ceilingAmountBilling: 0,
//       applyToRbaCode: "R",
//     };
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(res.data?.data || []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch {
//       // handle error
//     }
//   };

//   // UI-only delete
//   const handleDeleteUI = (index) => {
//     setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Cancel new row
//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       accountId: "",
//       ceilingAmountFunc: "",
//     });
//   };

//   if (!shouldShowTable) {
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
//             Direct Cost Ceilings
//           </h2>
//           <button
//             className="mb-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>
//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : directCostCeilings.length === 0 && !showNewRow ? (
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
//                     Functional Currency Ceiling Amount
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-2 py-1">
//                       <select
//                         name="accountId"
//                         value={newRow.accountId}
//                         onChange={handleNewChange}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                       >
//                         <option value="">-- Select Account --</option>
//                         {accounts.map((account) => (
//                           <option key={account.acctId} value={account.acctId}>
//                             {account.acctId}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {accounts.find((a) => a.acctId === newRow.accountId)
//                         ?.acctName || ""}
//                     </td>
//                     <td className="px-2 py-1">
//                       <input
//                         type="text"
//                         name="ceilingAmountFunc"
//                         value={newRow.ceilingAmountFunc}
//                         onChange={handleNewChange}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         placeholder="0"
//                       />
//                     </td>
//                     <td className="px-2 py-1 flex gap-1">
//                       <button
//                         onClick={handleSave}
//                         className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 )}
//                 {directCostCeilings.map((ceiling, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {ceiling.accountId}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {accounts.find((a) => a.acctId === ceiling.accountId)
//                         ?.acctName || "N/A"}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 font-normal">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="ceilingAmountFunc"
//                           value={editRow.ceilingAmountFunc}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs font-normal"
//                         />
//                       ) : (
//                         <span className="font-normal">
//                           {ceiling.ceilingAmountFunc}
//                         </span>
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

// export default DirectCostCeilings;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const applyToRBAOptions = [
//   { value: "", label: "Select" },
//   { value: "R", label: "Revenue" },
//   { value: "B", label: "Billing" },
//   { value: "A", label: "All" },
//   { value: "N", label: "None" },
// ];

// const DirectCostCeilings = ({ projectId, isSearched }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [directCostCeilings, setDirectCostCeilings] = useState([]);
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     ceilingAmountFunc: "",
//     applyToRbaCode: "",
//   });
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Validate projectId format (e.g., "PROJ123")
//   const isValidProjectId = (id) => id && /^PROJ\d{3}$/.test(id);

//   // Fetch accounts from GetAllProjectByProjId using laborAccounts + nonLaborAccounts
//   useEffect(() => {
//     let active = true;
//     if (!isSearched || !isValidProjectId(projectId)) {
//       setAccounts([]);
//       return;
//     }
//     axios
//       .get(
//         `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//       )
//       .then((res) => {
//         const project = res.data?.[0] || {};
//         const labor = Array.isArray(project.laborAccounts)
//           ? project.laborAccounts.map((code) => ({
//               acctId: code,
//               acctName: code,
//             }))
//           : [];
//         const nonLabor = Array.isArray(project.nonLaborAccounts)
//           ? project.nonLaborAccounts.map((code) => ({
//               acctId: code,
//               acctName: code,
//             }))
//           : [];
//         if (active) setAccounts([...labor, ...nonLabor]);
//       })
//       .catch(() => {
//         if (active) setAccounts([]);
//       });
//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   // Fetch direct cost ceilings
//   useEffect(() => {
//     let active = true;
//     if (isSearched && isValidProjectId(projectId)) {
//       setIsLoading(true);
//       axios
//         .get(
//           `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`
//         )
//         .then((res) => {
//           if (active) {
//             setDirectCostCeilings(res.data?.data || []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         })
//         .catch(() => {
//           if (active) {
//             setDirectCostCeilings([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         })
//         .finally(() => {
//           if (active) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         });
//     } else if (active) {
//       setDirectCostCeilings([]);
//       setShowNewRow(false);
//       setLastSearchedProjectId("");
//       setHasSearched(false);
//       setIsLoading(false);
//     }
//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // Show new row
//   const handleNewClick = () => {
//     setShowNewRow(true);
//     setNewRow({
//       accountId: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//   };

//   // Handle new row changes
//   const handleNewChange = (e) => {
//     const { name, value } = e.target;
//     setNewRow((prev) => ({ ...prev, [name]: value }));
//   };

//   // Save new direct cost ceiling
//   const handleSave = async () => {
//     if (!newRow.accountId || !newRow.ceilingAmountFunc || !newRow.applyToRbaCode) {
//       alert("Please fill all required fields.");
//       return;
//     }
//     const requestBody = {
//       projectId: lastSearchedProjectId,
//       accountId: newRow.accountId,
//       ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
//       ceilingAmountBilling: 0,
//       applyToRbaCode: newRow.applyToRbaCode,
//     };
//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=TEST`,
//         requestBody
//       );
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(res.data?.data || []);
//       setShowNewRow(false);
//       setNewRow({
//         accountId: "",
//         ceilingAmountFunc: "",
//         applyToRbaCode: "",
//       });
//     } catch (err) {
//       alert("Failed to save. Please check your input and try again.");
//     }
//   };

//   // Edit handlers
//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({
//       ceilingAmountFunc: directCostCeilings[index].ceilingAmountFunc,
//       applyToRbaCode: directCostCeilings[index].applyToRbaCode || "",
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const row = directCostCeilings[index];
//     const requestBody = {
//       projectId: row.projectId,
//       accountId: row.accountId,
//       ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
//       ceilingAmountBilling: 0,
//       applyToRbaCode: editRow.applyToRbaCode,
//     };
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=test`,
//         requestBody
//       );
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(res.data?.data || []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch {
//       alert("Update failed");
//     }
//   };

//   // Delete UI
//   const handleDeleteUI = (index) => {
//     setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Cancel new row
//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       accountId: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//   };

//   if (!shouldShowTable) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fade-in">
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4 flex justify-between items-center">
//           <h2 className="text-xl font-bold text-gray-900">
//             Direct Cost Ceilings
//           </h2>
//           <button
//             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>
//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : directCostCeilings.length === 0 && !showNewRow ? (
//           <p className="text-gray-600">No data available.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-left">
//               <thead className="bg-gray-100 border-b border-gray-200">
//                 <tr>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Account</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs">Account Name</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">Functional Currency Ceiling Amount</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">Apply to R/B/A</th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-2 py-1">
//                       <select
//                         name="accountId"
//                         value={newRow.accountId}
//                         onChange={handleNewChange}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                       >
//                         <option value="">-- Select Account --</option>
//                         {accounts.map((account) => (
//                           <option key={account.acctId} value={account.acctId}>
//                             {account.acctId}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900">
//                       {accounts.find((a) => a.acctId === newRow.accountId)
//                         ?.acctName || ""}
//                     </td>
//                     <td className="px-2 py-1 text-center">
//                       <input
//                         type="text"
//                         name="ceilingAmountFunc"
//                         value={newRow.ceilingAmountFunc}
//                         onChange={handleNewChange}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                         placeholder="0"
//                       />
//                     </td>
//                     <td className="px-2 py-1 text-center">
//                       <select
//                         name="applyToRbaCode"
//                         value={newRow.applyToRbaCode}
//                         onChange={handleNewChange}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                       >
//                         {applyToRBAOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-2 py-1 flex gap-1 justify-center">
//                       <button
//                         onClick={handleSave}
//                         className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
//                       >
//                         Cancel
//                       </button>
//                     </td>
//                   </tr>
//                 )}
//                 {directCostCeilings.map((ceiling, index) => (
//                   <tr
//                     key={`${ceiling.accountId}-${index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs">{ceiling.accountId}</td>
//                     <td className="px-2 py-1 text-xs">
//                       {accounts.find((a) => a.acctId === ceiling.accountId)
//                         ?.acctName || "N/A"}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-center">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           name="ceilingAmountFunc"
//                           value={editRow.ceilingAmountFunc}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                         />
//                       ) : (
//                         ceiling.ceilingAmountFunc
//                       )}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-center">
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
//                         ceiling.applyToRbaCode || ""
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-1 justify-center">
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

// export default DirectCostCeilings;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaSave, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const applyToRBAOptions = [
//   { value: "", label: "Select" },
//   { value: "R", label: "Revenue" },
//   { value: "B", label: "Billing" },
//   { value: "A", label: "All" },
//   { value: "N", label: "None" },
// ];

// // Accept any non-empty trimmed projectId
// const isValidProjectId = (id) => typeof id === "string" && id.trim().length > 0;

// const DirectCostCeilings = ({ projectId, isSearched, updatedBy = "TEST" }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [directCostCeilings, setDirectCostCeilings] = useState([]);
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     ceilingAmountFunc: "",
//     applyToRbaCode: "",
//   });
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Prepare datalist/account suggestions
//   const accountSuggestions = accounts;

//   // Only fetch accounts if search triggered and valid projectId
//   useEffect(() => {
//     let active = true;
//     const fetchAccounts = async () => {
//       if (!isSearched || !isValidProjectId(projectId)) {
//         setAccounts([]);
//         return;
//       }
//       try {
//         const res = await axios.get(
//           `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//         );
//         const project = Array.isArray(res.data) ? res.data[0] : {};
//         const labor = Array.isArray(project?.laborAccounts)
//           ? project.laborAccounts.map((code) => ({
//               acctId: code,
//               acctName: code,
//             }))
//           : [];
//         const nonLabor = Array.isArray(project?.nonLaborAccounts)
//           ? project.nonLaborAccounts.map((code) => ({
//               acctId: code,
//               acctName: code,
//             }))
//           : [];
//         if (active) setAccounts([...labor, ...nonLabor]);
//       } catch (err) {
//         setAccounts([]);
//         toast.error("Failed to load accounts");
//       }
//     };
//     fetchAccounts();
//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   // Only fetch ceilings if search triggered and valid projectId
//   useEffect(() => {
//     let active = true;
//     const fetchDirectCostCeilings = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`
//           );
//           if (active) {
//             setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch (err) {
//           setDirectCostCeilings([]);
//           setLastSearchedProjectId(projectId);
//           setHasSearched(true);
//           toast.error("Failed to load direct cost ceilings");
//         } finally {
//           if (active) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (active) {
//         setDirectCostCeilings([]);
//         setShowNewRow(false);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//         setIsLoading(false);
//       }
//     };
//     fetchDirectCostCeilings();
//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable = hasSearched && isValidProjectId(lastSearchedProjectId);

//   // Account input change for new row (typed suggestion)
//   const handleNewAccountInput = (value) => {
//     const selected = accountSuggestions.find((a) => a.acctId === value);
//     if (selected) {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: selected.acctId,
//         accountName: selected.acctName,
//       }));
//     } else {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: value,
//         accountName: "",
//       }));
//     }
//   };

//   // Show new row
//   const handleNewClick = () => {
//     if (!isSearched || !isValidProjectId(projectId)) {
//       toast.error("Invalid project ID. Please search again.");
//       return;
//     }
//     setShowNewRow(true);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//   };

//   // Save new ceiling
//   const handleSave = async () => {
//     if (!newRow.accountId || !newRow.ceilingAmountFunc || !newRow.applyToRbaCode) {
//       toast.warning("Please fill all required fields.");
//       return;
//     }
//     try {
//       const requestBody = {
//         projectId: lastSearchedProjectId,
//         accountId: newRow.accountId,
//         ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: newRow.applyToRbaCode,
//       };
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       toast.success("Saved successfully");
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
//       setShowNewRow(false);
//       setNewRow({
//         accountId: "",
//         accountName: "",
//         ceilingAmountFunc: "",
//         applyToRbaCode: "",
//       });
//     } catch (err) {
//       toast.error("Failed to save. Try again.");
//     }
//   };

//   // Edit handlers
//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     const row = directCostCeilings[index];
//     setEditRow({
//       ceilingAmountFunc: row.ceilingAmountFunc,
//       applyToRbaCode: row.applyToRbaCode || "",
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const row = directCostCeilings[index];
//     try {
//       const requestBody = {
//         projectId: row.projectId,
//         accountId: row.accountId,
//         ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: editRow.applyToRbaCode,
//       };
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody
//       );
//       toast.success("Updated successfully");
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
//       );
//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch (err) {
//       toast.error("Failed to update");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditIndex(null);
//     setEditRow({});
//     toast.info("Edit canceled");
//   };

//   // UI-only delete
//   const handleDeleteUI = (index) => {
//     setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));
//     toast.info("Row removed (UI only)");
//   };

//   // Cancel new row
//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//     toast.info("Canceled");
//   };

//   // UI feedback for unsearched/invalid/empty
//   if (!isSearched) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   if (isSearched && !isValidProjectId(projectId)) {
//     return (
//       <div className="text-red-600 font-medium">Invalid project ID.</div>
//     );
//   }

//   if (!shouldShowTable) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer position="top-right" autoClose={1800} />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Direct Cost Ceilings
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-sm font-medium text-gray-700 mr-2">
//               Project:
//             </label>
//             <span className="text-sm text-gray-900">{lastSearchedProjectId}</span>
//             <span className="ml-4 text-sm text-gray-900">Org ID: 1.02</span>
//           </div>
//           <button
//             className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//             onClick={handleNewClick}
//           >
//             New
//           </button>
//         </div>

//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : directCostCeilings.length === 0 && !showNewRow ? (
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
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
//                     Functional Currency Ceiling Amount
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
//                     Apply to R/B/A
//                   </th>
//                   <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-2 py-1">
//                       <input
//                         list="dc-account-suggestions"
//                         value={newRow.accountId}
//                         onChange={(e) => handleNewAccountInput(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         placeholder="Search account"
//                       />
//                       <datalist id="dc-account-suggestions">
//                         {accountSuggestions.map((a) => (
//                           <option key={a.acctId} value={a.acctId}>
//                             {a.acctId}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900">
//                       {newRow.accountName}
//                     </td>
//                     <td className="px-2 py-1 text-center">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={newRow.ceilingAmountFunc}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             ceilingAmountFunc: e.target.value,
//                           }))
//                         }
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                         placeholder="0"
//                       />
//                     </td>
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
//                     <td className="px-2 py-1 flex gap-2 justify-center">
//                       <button
//                         onClick={handleSave}
//                         className="text-green-700 hover:text-green-800"
//                         title="Save"
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaSave size={16} />
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="text-gray-500 hover:text-gray-700"
//                         title="Cancel"
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaTimes size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 {directCostCeilings.map((ceiling, index) => (
//                   <tr
//                     key={`${ceiling.accountId}-${ceiling.projectId || "proj"}-${index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-1 text-xs text-gray-900">
//                       {ceiling.accountId}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900">
//                       {accounts.find((a) => a.acctId === ceiling.accountId)?.acctName || "N/A"}
//                     </td>
//                     <td className="px-2 py-1 text-xs text-gray-900 text-center">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           name="ceilingAmountFunc"
//                           value={editRow.ceilingAmountFunc}
//                           onChange={handleEditChange}
//                           className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
//                         />
//                       ) : (
//                         ceiling.ceilingAmountFunc
//                       )}
//                     </td>
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
//                         ceiling.applyToRbaCode || ""
//                       )}
//                     </td>
//                     <td className="px-2 py-1 flex gap-2 justify-center">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="text-green-700 hover:text-green-800"
//                             title="Save"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaSave size={16} />
//                           </button>
//                           <button
//                             onClick={handleCancelEdit}
//                             className="text-gray-500 hover:text-gray-700"
//                             title="Cancel"
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
//                             title="Edit"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaEdit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUI(index)}
//                             className="text-gray-400 hover:text-gray-800"
//                             title="Delete"
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

// export default DirectCostCeilings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const applyToRBAOptions = [
  { value: "", label: "Select" },
  { value: "R", label: "Revenue" },
  { value: "B", label: "Billing" },
  { value: "A", label: "All" },
  { value: "N", label: "None" },
];

// Accept any non-empty trimmed projectId
const isValidProjectId = (id) => !!id;

const DirectCostCeilings = ({ projectId, isSearched, updatedBy = "TEST" }) => {
  const [accounts, setAccounts] = useState([]);
  const [directCostCeilings, setDirectCostCeilings] = useState([]);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newRow, setNewRow] = useState({
    accountId: "",
    accountName: "",
    ceilingAmountFunc: "",
    applyToRbaCode: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Don't fetch until a real search and valid projectId.
  // useEffect(() => {
  //   let active = true;
  //   const fetchAccounts = async () => {
  //     if (!(isSearched && isValidProjectId(projectId))) {
  //       setAccounts([]);
  //       return;
  //     }
  //     try {
  //       const res = await axios.get(
  //         `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
  //       );
  //       const project = Array.isArray(res.data) ? res.data[0] : {};
  //       const labor = Array.isArray(project?.laborAccounts)
  //         ? project.laborAccounts.map((code) => ({
  //             acctId: code,
  //             acctName: code,
  //           }))
  //         : [];
  //       const nonLabor = Array.isArray(project?.nonLaborAccounts)
  //         ? project.nonLaborAccounts.map((code) => ({
  //             acctId: code,
  //             acctName: code,
  //           }))
  //         : [];
  //       if (active) setAccounts([...labor, ...nonLabor]);
  //     } catch (err) {
  //       setAccounts([]);
  //       // Don't toast for search errors!
  //     }
  //   };
  //   fetchAccounts();
  //   return () => {
  //     active = false;
  //   };
  // }, [isSearched, projectId]);

  // ✅ Fetch accounts for project based on searched projectId
  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      if (!(isSearched && isValidProjectId(projectId))) {
        setAccounts([]);
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
        );

        const project = Array.isArray(res.data) ? res.data[0] : {};

        // ✅ Collect accounts from Employee, Subcontractor, and Other Direct Cost NON-LABOR
        const employeeNonLabor = Array.isArray(
          project?.employeeNonLaborAccounts
        )
          ? project.employeeNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        const subcontractorNonLabor = Array.isArray(
          project?.subContractorNonLaborAccounts
        )
          ? project.subContractorNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        const otherDirectCostNonLabor = Array.isArray(
          project?.otherDirectCostNonLaborAccounts
        )
          ? project.otherDirectCostNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        // ✅ Merge all NON-LABOR account lists
        const mergedAccounts = [
          ...employeeNonLabor,
          ...subcontractorNonLabor,
          ...otherDirectCostNonLabor,
        ];

        if (active) setAccounts(mergedAccounts);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setAccounts([]);
      }
    };

    fetchAccounts();

    return () => {
      active = false;
    };
  }, [isSearched, projectId]);

  useEffect(() => {
    let active = true;
    const fetchDirectCostCeilings = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);
        try {
          const res = await axios.get(
            `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`
          );
          if (active) {
            setDirectCostCeilings(
              Array.isArray(res.data?.data) ? res.data.data : []
            );
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } catch {
          setDirectCostCeilings([]);
          setLastSearchedProjectId(projectId);
          setHasSearched(true);
        } finally {
          if (active) {
            setIsLoading(false);
            setShowNewRow(false);
          }
        }
      } else if (active) {
        setDirectCostCeilings([]);
        setShowNewRow(false);
        setLastSearchedProjectId("");
        setHasSearched(false);
        setIsLoading(false);
      }
    };
    fetchDirectCostCeilings();
    return () => {
      active = false;
    };
  }, [isSearched, projectId]);

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  // Account input change for new row (typed suggestion)
  const handleNewAccountInput = (value) => {
    const selected = accounts.find((a) => a.acctId === value);
    if (selected) {
      setNewRow((prev) => ({
        ...prev,
        accountId: selected.acctId,
        accountName: selected.acctName,
      }));
    } else {
      setNewRow((prev) => ({
        ...prev,
        accountId: value,
        accountName: "",
      }));
    }
  };

  const handleNewClick = () => {
    setShowNewRow(true);
    setNewRow({
      accountId: "",
      accountName: "",
      ceilingAmountFunc: "",
      applyToRbaCode: "",
    });
  };

  const handleSave = async () => {
    if (
      !newRow.accountId ||
      !newRow.ceilingAmountFunc ||
      !newRow.applyToRbaCode
    ) {
      toast.warning("Please fill all required fields.");
      return;
    }
    try {
      const requestBody = {
        projectId: lastSearchedProjectId,
        accountId: newRow.accountId,
        ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
        ceilingAmountBilling: 0,
        applyToRbaCode: newRow.applyToRbaCode,
      };
      await axios.post(
        `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
        requestBody
      );
      toast.success("Saved successfully");
      const res = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
      );
      setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
      setShowNewRow(false);
      setNewRow({
        accountId: "",
        accountName: "",
        ceilingAmountFunc: "",
        applyToRbaCode: "",
      });
    } catch {
      toast.error("Failed to save. Try again.");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const row = directCostCeilings[index];
    setEditRow({
      ceilingAmountFunc: row.ceilingAmountFunc,
      applyToRbaCode: row.applyToRbaCode || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (index) => {
    const row = directCostCeilings[index];
    try {
      const requestBody = {
        projectId: row.projectId,
        accountId: row.accountId,
        ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
        ceilingAmountBilling: 0,
        applyToRbaCode: editRow.applyToRbaCode,
      };
      await axios.put(
        `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
        requestBody
      );
      toast.success("Updated successfully");
      const res = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`
      );
      setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
      setEditIndex(null);
      setEditRow({});
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRow({});
    toast.info("Edit canceled");
  };

  // const handleDeleteUI = (index) => {
  //   setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));
  //   toast.info("Row removed (UI only)");
  // };

  const handleDelete = async (index) => {
    const ceiling = directCostCeilings[index];
    if (!ceiling) return;

    try {
      const response = await fetch(
        `${backendUrl}/Project/DeleteCeilingAmtForDirectCost/${ceiling.projectId}/${ceiling.accountId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete direct cost ceiling");
      }

      // ✅ Update UI after successful API call
      setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));

      // ✅ Toast success
      toast.success("Direct cost ceiling deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Could not delete direct cost ceiling. Please try again.");
    }
  };

  const handleCancelNewRow = () => {
    setShowNewRow(false);
    setNewRow({
      accountId: "",
      accountName: "",
      ceilingAmountFunc: "",
      applyToRbaCode: "",
    });
    toast.info("Canceled");
  };

  // Messages for unsearched/invalid
  if (!isSearched) {
    return (
      <div className="text-gray-600">
        Please search for a project to view details.
      </div>
    );
  }

  if (isSearched && !isValidProjectId(projectId)) {
    return <div className="text-red-600 font-medium">Invalid project ID.</div>;
  }

  if (!shouldShowTable) {
    return (
      <div className="text-gray-600">
        Please search for a project to view details.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ToastContainer position="top-right" autoClose={1600} />
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Direct Cost Ceilings
          </h2>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Project:
            </label>
            <span className="text-sm text-gray-900">
              {lastSearchedProjectId}
            </span>
            <span className="ml-4 text-sm text-gray-900">Org ID: 1.02</span>
          </div>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
            onClick={handleNewClick}
          >
            New
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : directCostCeilings.length === 0 && !showNewRow ? (
          <p className="text-gray-600">No data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Account
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs">
                    Account Name
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
                    Functional Currency Ceiling Amount
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
                    Apply to R/B/A
                  </th>
                  <th className="px-2 py-1 text-gray-700 font-semibold text-xs text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {showNewRow && (
                  <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-2 py-1">
                      {/* <input
                        list="dc-account-suggestions"
                        value={newRow.accountId}
                        onChange={(e) => handleNewAccountInput(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                        placeholder="Search account"
                      />
                      <datalist id="dc-account-suggestions">
                        {accounts.map((a) => (
                          <option key={a.acctId} value={a.acctId}>
                            {a.acctId}
                          </option>
                        ))}
                      </datalist> */}
                      <input
                        list="dc-account-suggestions"
                        value={newRow.accountId}
                        onChange={(e) => handleNewAccountInput(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                        placeholder="Search account"
                      />
                      <datalist id="dc-account-suggestions">
                        {accounts.map((a) => (
                          <option key={a.acctId} value={a.acctId}>
                            {a.acctId} - {a.acctName}{" "}
                            {/* 👈 Show both ID + Name in dropdown */}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900">
                      {newRow.accountName}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={newRow.ceilingAmountFunc}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            ceilingAmountFunc: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <select
                        value={newRow.applyToRbaCode}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            applyToRbaCode: e.target.value,
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
                    <td className="px-2 py-1 flex gap-2 justify-center">
                      <button
                        onClick={handleSave}
                        className="text-green-700 hover:text-green-800"
                        title="Save"
                        style={{ background: "none", border: "none" }}
                      >
                        <FaSave size={16} />
                      </button>
                      <button
                        onClick={handleCancelNewRow}
                        className="text-gray-500 hover:text-gray-700"
                        title="Cancel"
                        style={{ background: "none", border: "none" }}
                      >
                        <FaTimes size={16} />
                      </button>
                    </td>
                  </tr>
                )}

                {directCostCeilings.map((ceiling, index) => (
                  <tr
                    key={`${ceiling.accountId}-${
                      ceiling.projectId || "proj"
                    }-${index}`}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-2 py-1 text-xs text-gray-900">
                      {ceiling.accountId}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900">
                      {accounts.find((a) => a.acctId === ceiling.accountId)
                        ?.acctName || "N/A"}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 text-center">
                      {editIndex === index ? (
                        <input
                          type="number"
                          step="0.01"
                          name="ceilingAmountFunc"
                          value={editRow.ceilingAmountFunc}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs text-center"
                        />
                      ) : (
                        ceiling.ceilingAmountFunc
                      )}
                    </td>
                    <td className="px-2 py-1 text-xs text-gray-900 text-center">
                      {editIndex === index ? (
                        <select
                          name="applyToRbaCode"
                          value={editRow.applyToRbaCode}
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
                        ceiling.applyToRbaCode || ""
                      )}
                    </td>
                    <td className="px-2 py-1 flex gap-2 justify-center">
                      {editIndex === index ? (
                        <>
                          <button
                            onClick={() => handleUpdate(index)}
                            className="text-green-700 hover:text-green-800"
                            title="Save"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaSave size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                            title="Cancel"
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
                            title="Edit"
                            style={{ background: "none", border: "none" }}
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-gray-800"
                            title="Delete"
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

export default DirectCostCeilings;
