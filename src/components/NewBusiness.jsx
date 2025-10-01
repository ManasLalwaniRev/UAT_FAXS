// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// // Reusable FormField component for consistent layout
// const FormField = ({ label, children }) => (
//   <div className="flex items-center gap-2">
//     <label className="w-28 text-[11px] sm:text-xs font-normal whitespace-nowrap">{label}:</label>
//     <div className="flex-1">{children}</div>
//   </div>
// );

// // Component to display all existing business data in a table
// const SavedBusinessTableDisplay = ({ allBusinessBudgets, onNewBusiness, onEditClick, onDeleteClick, onBackToSearch }) => {
//   if (!allBusinessBudgets || allBusinessBudgets.length === 0) {
//     return (
//       <div className="bg-white rounded shadow p-4 text-center">
//         <p className="text-gray-600 mb-4">No business budget data available to display.</p>
//         <button
//           onClick={onNewBusiness}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-[11px] sm:text-xs"
//         >
//           Create New Business Budget
//         </button>
//         <button
//             onClick={onBackToSearch}
//             className="ml-2 bg-gray-500 text-white px-4 py-2 rounded text-[11px] sm:text-xs hover:bg-gray-600 transition"
//         >
//             Back to Search
//         </button>
//       </div>
//     );
//   }

//   // Define table headers and their corresponding keys in the data object
//   const headers = [
//     { label: "Budget ID", key: "businessBudgetId" },
//     { label: "Description", key: "description" },
//     { label: "Level", key: "level" },
//     { label: "Active", key: "isActive" },
//     { label: "Version", key: "version" },
//     { label: "Version Code", key: "versionCode" },
//     { label: "Winning Probability %", key: "winningProbability" },
//     { label: "Start Date", key: "startDate" },
//     { label: "End Date", key: "endDate" },
//     { label: "Escalation Rate", key: "escalationRate" },
//     { label: "Org ID", key: "orgId" },
//     { label: "Account Group", key: "accountGroup" },
//     { label: "Burden Template ID", key: "burdenTemplateId" },
//     { label: "Actions", key: "actions" }, // For Edit/Delete buttons
//   ];

//   // Helper function to format display values
//   const formatValue = (key, value) => {
//     if (key === "isActive") {
//       return value ? "Yes" : "No";
//     }
//     if (key === "startDate" || key === "endDate") {
//       // FIX: Explicitly check for the "0001-01-01T00:00:00" string or falsy values
//       if (!value || value === "0001-01-01T00:00:00") {
//         return "N/A";
//       }
//       const date = new Date(value);
//       // Fallback for any other invalid date that might slip through
//       if (isNaN(date.getTime())) {
//         return "N/A";
//       }
//       return date.toLocaleDateString();
//     }
//     // Specific check for Winning Probability %: ensure 0 is displayed as "0"
//     if (key === "winningProbability" && (value === 0 || value === "0")) {
//       return "0";
//     }
//     // For any other value, display it as string, otherwise "N/A"
//     return value !== null && value !== undefined && value !== "" ? String(value) : "N/A";
//   };

//   // FIX: Custom sort function for businessBudgetId (e.g., Test.1, Test.10, Test.2)
//   const sortBudgets = (a, b) => {
//     const idA = a.businessBudgetId;
//     const idB = b.businessBudgetId;

//     // Handle cases like "Test.1" vs "Test.10" correctly
//     const partsA = idA.split('.');
//     const partsB = idB.split('.');

//     const prefixA = partsA[0];
//     const prefixB = partsB[0];

//     const numA = parseInt(partsA[1], 10);
//     const numB = parseInt(partsB[1], 10);

//     // First, sort by the text prefix
//     if (prefixA < prefixB) return -1;
//     if (prefixA > prefixB) return 1;

//     // If prefixes are the same, sort by the numeric part
//     return numA - numB;
//   };

//   const sortedBudgets = [...allBusinessBudgets].sort(sortBudgets);


//   return (
//     <div className="p-2 sm:p-4 space-y-6 text-[11px] sm:text-xs text-gray-800 font-sans max-w-4xl mx-auto">
//       <div className="bg-white rounded shadow p-2 sm:p-4 mb-4 relative">
//         <h2 className="text-xs sm:text-sm font-normal mb-3 font-sans">
//           Business Budget Details
//         </h2>
//         <div className="absolute top-2 right-2 flex gap-2">
//             <button
//                 onClick={onNewBusiness}
//                 className="bg-blue-600 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-blue-700 transition whitespace-nowrap"
//             >
//                 New
//             </button>
//             <button
//                 onClick={onBackToSearch} // This button goes back to the main search view
//                 className="bg-gray-500 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-gray-600 transition"
//             >
//                 Back to Search
//             </button>
//         </div>

//         <div className="overflow-x-auto mt-8"> {/* Adjusted margin-top due to new buttons */}
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {headers.map((header) => (
//                   <th
//                     key={header.key}
//                     scope="col"
//                     // Changed to match data row style: font-normal, no uppercase/tracking
//                     className="px-2 py-2 text-left text-[11px] sm:text-xs font-normal text-gray-700 font-sans"
//                   >
//                     {header.label}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {sortedBudgets.map((budget) => ( // Use sortedBudgets here
//                 <tr key={budget.businessBudgetId}>
//                   {headers.map((header) => (
//                     <td
//                       key={header.key}
//                       className="px-2 py-2 whitespace-nowrap text-[11px] sm:text-xs font-normal text-gray-900 font-sans" // Professional font and size for data
//                     >
//                       {header.key === "actions" ? (
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => {
//                                 console.log("Edit button clicked for budget:", budget);
//                                 onEditClick(budget);
//                             }}
//                             className="bg-green-600 text-white px-2 py-1 rounded text-[10px] hover:bg-green-700 transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => onDeleteClick(budget.businessBudgetId)}
//                             className="bg-red-600 text-white px-2 py-1 rounded text-[10px] hover:bg-red-700 transition"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       ) : (
//                         <div>
//                           {formatValue(header.key, budget[header.key])}
//                         </div>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Assuming these components exist for the tabs
// // Make sure to provide these files in the same directory or adjust paths
// import ProfessionalHoursTableWithDuration from "./HoursTable";
// import ProjectRevenueAnalysisTable from "././ProjectRevenueAnalysisTable";


// const NewBusiness = () => {
//   const [form, setForm] = useState({
//     businessBudgetId: "",
//     description: "",
//     level: "",
//     active: false, // Matches isActive from API
//     version: "",
//     versionCode: "",
//     winningProbability: "",
//     startDate: "",
//     endDate: "",
//     period: "Q1 2024", // Read-only
//     weeks: "12", // Read-only
//     escalationRate: "",
//     orgId: "",
//     accountGrp: "", // Matches accountGroup from API
//     burdenTemplateId: "",
//   });

//   const [activeTab, setActiveTab] = useState(null);
//   const [viewMode, setViewMode] = useState('search'); // 'search', 'form', 'table'
//   const [allBusinessBudgets, setAllBusinessBudgets] = useState([]); // To store all budgets for the table
//   const [burdenTemplates, setBurdenTemplates] = useState([]);
//   const [isUpdateMode, setIsUpdateMode] = useState(false); // New state to manage update mode
//   const [budgetSearchId, setBudgetSearchId] = useState("");


//   // useEffect to log form state whenever it changes (for debugging purposes)
//   useEffect(() => {
//     console.log("NewBusiness.jsx -> useEffect: Current form state (after render):", form);
//   }, [form]);


//   // This function is still useful if you ever want to get all data for other purposes
//   const fetchAllBusinessBudgets = async () => {
//     try {
//       const response = await axios.get(
//         "${backendUrl}/GetAllNewBusiness"
//       );
//       if (response.data && Array.isArray(response.data)) {
//         // This function no longer populates the search dropdown.
//         // It's kept in case other parts of your application might need to fetch all IDs.
//       } else {
//         console.error("Unexpected API response for all business budget IDs:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching existing business budget IDs:", error);
//     }
//   };

//   // Fetch burden templates on component mount
//   useEffect(() => {
//     const fetchBurdenTemplates = async () => {
//       try {
//         const response = await axios.get(
//           "${backendUrl}/Orgnization/GetAllTemplates"
//         );
//         if (response.data && Array.isArray(response.data)) {
//           setBurdenTemplates(response.data);
//         } else {
//           toast.error("Failed to fetch burden templates: Unexpected data format.");
//           console.error("Unexpected API response for burden templates:", response.data);
//         }
//       } catch (error) {
//         toast.error(`Error fetching burden templates: ${error.message}`);
//         console.error("Error fetching burden templates:", error);
//       }
//     };
//     fetchBurdenTemplates();
//   }, []); // Empty dependency array means this runs once on mount

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === "startDate" || name === "endDate") {
//         console.log(`handleChange: Input ${name} changed to value: ${value}`);
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSave = async () => {
//     if (!form.businessBudgetId || !form.description || !form.startDate || !form.endDate) {
//       toast.error(
//         "Please fill in all required fields: Business Budget ID, Description, Start Date, and End Date."
//       );
//       return;
//     }

//     const payload = {
//       businessBudgetId: form.businessBudgetId,
//       description: form.description,
//       level: parseInt(form.level) || 0,
//       isActive: form.active, // Map form.active to API's isActive
//       version: parseInt(form.version) || 0,
//       versionCode: form.versionCode,
//       winningProbability: parseFloat(form.winningProbability) || 0,
//       startDate: form.startDate ? `${form.startDate}T00:00:00` : "0001-01-01T00:00:00", // Ensure valid default if empty
//       endDate: form.endDate ? `${form.endDate}T00:00:00` : "0001-01-01T00:00:00",     // Ensure valid default if empty
//       escalationRate: parseFloat(form.escalationRate) || 0,
//       orgId: parseInt(form.orgId) || 0,
//       accountGroup: form.accountGrp, // Map form.accountGrp to API's accountGroup
//       burdenTemplateId: parseInt(form.burdenTemplateId) || 0,
//       modifiedBy: "admin", // Hardcoded
//     };

//     console.log("Sending payload:", payload);

//     try {
//       let response;
//       if (isUpdateMode) {
//         response = await axios.put(
//           "${backendUrl}/UpdateNewBusiness",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast.success("Budget details updated successfully!");
//       } else {
//         response = await axios.post(
//           "${backendUrl}/AddNewBusiness",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         toast.success("Budget details saved successfully!");
//       }

//       console.log("API response:", response.data);
//       // After save/update, show the updated single item in table view
//       setAllBusinessBudgets([response.data]); // Show the newly saved/updated item in table
//       setViewMode('table'); // Go to table view after save/update
//       // Reset form and mode for next operation
//       setIsUpdateMode(false);
//       setForm({
//         businessBudgetId: "", description: "", level: "", active: false,
//         version: "", versionCode: "", winningProbability: "", startDate: "",
//         endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
//         orgId: "", accountGrp: "", burdenTemplateId: "",
//       });
//       setActiveTab(null); // Keep tabs hidden after save/update
//     } catch (error) {
//       console.error("Error saving/updating form data:", error);
//       const errorMessage = error.response?.data?.message || error.message || "Failed to save/update budget details.";
//       toast.error(`Error: ${errorMessage}`);
//     }
//   };

//   const handleDelete = async (budgetId) => {
//     if (window.confirm(`Are you sure you want to delete Business Budget ID: ${budgetId}? This action cannot be undone.`)) {
//       try {
//         const response = await axios.delete(
//           `${backendUrl}/DeleteNewBusiness/${budgetId}`
//         );
//         toast.success(`Business Budget ID ${budgetId} deleted successfully!`);
//         // After deletion, return to search view
//         setAllBusinessBudgets([]); // Clear table data
//         setBudgetSearchId(""); // Clear search input
//         setViewMode('search'); // Go back to search view
//       } catch (error) {
//         console.error("Error deleting business budget:", error);
//         const errorMessage = error.response?.data?.message || error.message || "Failed to delete budget.";
//         toast.error(`Error deleting budget: ${errorMessage}`);
//       }
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab((prevActiveTab) => (prevActiveTab === tab ? null : tab));
//   };

//   const handleCloseRevenueAnalysisTab = () => {
//     toast.info("Closing Revenue Analysis tab. Switching to Hours.");
//     setActiveTab("Hours");
//   };

//   const onEditClick = (budget) => {
//     console.log("NewBusiness.jsx -> onEditClick: Received budget for pre-filling:", budget);
//     setForm({
//       businessBudgetId: budget.businessBudgetId || "",
//       description: budget.description || "",
//       level: String(budget.level || ""), // Convert to string
//       active: budget.isActive, // Boolean as is
//       version: String(budget.version || ""), // Convert to string
//       versionCode: budget.versionCode || "",
//       winningProbability: String(budget.winningProbability || ""), // Convert to string
//       // FIX: Handle "0001-01-01T00:00:00" explicitly for date inputs
//       startDate: (budget.startDate === "0001-01-01T00:00:00" || !budget.startDate)
//                  ? "" // Set to empty string for date input if it's the default invalid date
//                  : new Date(budget.startDate).toISOString().split('T')[0],
//       endDate: (budget.endDate === "0001-01-01T00:00:00" || !budget.endDate)
//                ? "" // Set to empty string for date input if it's the default invalid date
//                : new Date(budget.endDate).toISOString().split('T')[0],
//       period: "Q1 2024", // Read-only
//       weeks: "12", // Read-only
//       escalationRate: String(budget.escalationRate || ""), // Convert to string
//       orgId: String(budget.orgId || ""), // Convert to string
//       accountGrp: budget.accountGroup || "", // String as is
//       burdenTemplateId: String(budget.burdenTemplateId || ""), // Convert to string
//     });
//     setIsUpdateMode(true);
//     setViewMode('form'); // Go to form view
//   };

//   const handleNewBusinessClick = () => {
//     setViewMode('form'); // Show the form for a new entry
//     setIsUpdateMode(false); // Ensure it's in add mode
//     setForm({ // Reset form to blank
//       businessBudgetId: "", description: "", level: "", active: false,
//       version: "", versionCode: "", winningProbability: "", startDate: "",
//       endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
//       orgId: "", accountGrp: "", burdenTemplateId: "",
//     });
//     setActiveTab(null); // Keep tabs hidden for new entry
//   };

//   const handleSearchById = async () => {
//     if (!budgetSearchId) {
//       toast.warn("Please enter a Business Budget ID to search.");
//       setAllBusinessBudgets([]); // Clear any previously displayed search results
//       setViewMode('search'); // Stay on search view
//       return;
//     }

//     try {
//       console.log(`handleSearchById: Attempting to fetch data for Budget ID: ${budgetSearchId}`);
//       const response = await axios.get(
//         `${backendUrl}/GetAllNewBusinessByID/${budgetSearchId}`
//       );

//       if (response.data && Array.isArray(response.data) && response.data.length > 0) {
//         // FIX: Set all retrieved budgets to be displayed
//         setAllBusinessBudgets(response.data); // Directly use the array of results
//         setViewMode('table'); // Change to table view
//         toast.success(`Data for Budget ID '${budgetSearchId}' loaded successfully.`);
//       } else {
//         toast.error(`No data found for Budget ID: '${budgetSearchId}'`);
//         setAllBusinessBudgets([]); // Clear table data if not found
//         setViewMode('search'); // Stay on search view
//       }
//     } catch (error) {
//       console.error("Error searching by ID:", error);
//       const errorMessage = error.response?.data?.message || error.message || "Failed to search for budget.";
//       toast.error(`Error searching: ${errorMessage}`);
//       setAllBusinessBudgets([]); // Clear table data on error
//       setViewMode('search'); // Stay on search view
//     }
//   };

//   // Handler for "Back to Search" button in table view
//   const handleBackToSearch = () => {
//     setAllBusinessBudgets([]); // Clear displayed table data
//     setBudgetSearchId(""); // Reset search input field
//     setViewMode('search'); // Go back to the search screen
//     // Also reset the form in case it was pre-filled before going to table
//     setForm({
//         businessBudgetId: "", description: "", level: "", active: false,
//         version: "", versionCode: "", winningProbability: "", startDate: "",
//         endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
//         orgId: "", accountGrp: "", burdenTemplateId: "",
//     });
//     setIsUpdateMode(false);
//   };


//   return (
//     <div className="p-2 sm:p-4 space-y-6 text-[11px] sm:text-xs text-gray-800 font-sans max-w-4xl mx-auto">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         closeButton
//       />

//       {viewMode === 'search' && (
//         <div className="bg-white rounded shadow p-2 sm:p-4 mb-4 relative">
//           <h2 className="text-xs sm:text-sm font-normal mb-3 font-sans">
//             Search Business Budget
//           </h2>
//           <button
//             type="button"
//             onClick={handleNewBusinessClick}
//             className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-blue-700 transition"
//           >
//             New
//           </button>
//           <div className="flex items-center gap-2 mb-4">
//             <label className="w-28 text-[11px] sm:text-xs font-normal whitespace-nowrap">Budget ID:</label>
//             <input
//               type="text"
//               value={budgetSearchId}
//               onChange={(e) => setBudgetSearchId(e.target.value)}
//               onKeyDown={(e) => { // Trigger search on Enter key press
//                 if (e.key === 'Enter') {
//                   e.preventDefault(); // Prevent default form submission if any
//                   handleSearchById();
//                 }
//               }}
//               className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//               placeholder="Enter Budget ID"
//             />
//             <button
//               type="button"
//               onClick={handleSearchById}
//               className="bg-blue-600 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-blue-700 transition whitespace-nowrap"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       )}

//       {viewMode === 'form' && (
//         // New Business Budget Form
//         <form className="bg-white rounded shadow p-2 sm:p-4 mb-4">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-xs sm:text-sm font-normal">
//               {isUpdateMode ? "Update Business Budget" : "New Business Budget"}
//             </h2>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={handleSave}
//                 className="bg-blue-600 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-blue-700 transition"
//               >
//                 {isUpdateMode ? "Update" : "Save"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                     setViewMode('search'); // Go back to search view
//                     setForm({ // Reset form to blank when canceling
//                         businessBudgetId: "", description: "", level: "", active: false,
//                         version: "", versionCode: "", winningProbability: "", startDate: "",
//                         endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
//                         orgId: "", accountGrp: "", burdenTemplateId: "",
//                     });
//                     setIsUpdateMode(false);
//                 }}
//                 className="bg-gray-500 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-gray-600 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//           <div className="flex items-center gap-1 mb-2">
//             <label className=" text-[11px] sm:text-xs font-normal whitespace-nowrap">
//               Business Budget ID:
//             </label>
//             <input
//               name="businessBudgetId"
//               value={form.businessBudgetId}
//               onChange={handleChange}
//               className="border border-gray-300 rounded px-1 py-0.5 w-40 text-[11px] sm:text-xs"
//               type="text"
//               readOnly={isUpdateMode} // Make ID read-only in update mode
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
//             <div className="space-y-2">
//               <FormField label="Description">
//                 <input
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                   type="text"
//                 />
//               </FormField>
//               <FormField label="Level">
//                 <input
//                   name="level"
//                   value={form.level}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   type="number"
//                 />
//               </FormField>
//               <FormField label="Active">
//                 <input
//                   name="active"
//                   checked={form.active}
//                   onChange={handleChange}
//                   className="accent-blue-600"
//                   type="checkbox"
//                   style={{ width: 14, height: 14 }}
//                 />
//               </FormField>
//               <FormField label="Version">
//                 <input
//                   name="version"
//                   value={form.version}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   type="number"
//                 />
//               </FormField>
//               <FormField label="Version Code">
//                 <input
//                   name="versionCode"
//                   value={form.versionCode}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                   type="text"
//                 />
//               </FormField>
//               <FormField label="Winning Probability %">
//                 <input
//                   name="winningProbability"
//                   value={form.winningProbability}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   type="number"
//                   min="0"
//                   max="100"
//                 />
//               </FormField>
//             </div>
//             <div className="space-y-2">
//               <FormField label="Start Date">
//                 <input
//                   name="startDate"
//                   value={form.startDate}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                   type="date"
//                 />
//               </FormField>
//               <FormField label="End Date">
//                 <input
//                   name="endDate"
//                   value={form.endDate}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                   type="date"
//                 />
//               </FormField>
//               <FormField label="Period">
//                 <input
//                   name="period"
//                   value={form.period}
//                   readOnly
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs bg-gray-100"
//                   type="text"
//                 />
//               </FormField>
//               <FormField label="Weeks">
//                 <input
//                   name="weeks"
//                   value={form.weeks}
//                   readOnly
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs bg-gray-100"
//                   type="text"
//                 />
//               </FormField>
//               <FormField label="Escalation Rate">
//                 <input
//                   name="escalationRate"
//                   value={form.escalationRate}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   type="number"
//                   step="0.01"
//                 />
//               </FormField>
//               <FormField label="Org ID">
//                 <input
//                   name="orgId"
//                   value={form.orgId}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                   type="number"
//                 />
//               </FormField>
//               <FormField label="Account Group">
//                 <input
//                   name="accountGrp"
//                   value={form.accountGrp}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                   type="text"
//                 />
//               </FormField>
//               <FormField label="Burden Template ID">
//                 <select
//                   name="burdenTemplateId"
//                   value={form.burdenTemplateId}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
//                 >
//                   <option value="">Select a Template ID</option>
//                   {burdenTemplates.map((template) => (
//                     <option key={template.id} value={template.id}>
//                       {template.id}
//                     </option>
//                   ))}
//                 </select>
//               </FormField>
//             </div>
//           </div>
//         </form>
//       )}

//       {viewMode === 'table' && (
//         <SavedBusinessTableDisplay
//           allBusinessBudgets={allBusinessBudgets}
//           onNewBusiness={handleNewBusinessClick}
//           onEditClick={onEditClick}
//           onDeleteClick={handleDelete}
//           onBackToSearch={handleBackToSearch}
//         />
//       )}

//       {/* Tabs Section */}
//       <div className="bg-white rounded shadow p-2 sm:p-4">
//         <div className="flex flex-wrap gap-2 sm:gap-4 text-blue-600 underline text-[11px] sm:text-xs cursor-pointer mb-2">
//           {[
//             "Hours",
//             "Amounts",
//             "PLC",
//             "Revenue Analysis",
//             "Analysis By Period",
//           ].map((tabName) => (
//             <span
//               key={tabName}
//               className={
//                 activeTab === tabName ? "text-blue-800 font-semibold" : ""
//               }
//               onClick={() => handleTabClick(tabName)}
//               style={{ userSelect: "none" }}
//             >
//               {tabName}
//             </span>
//           ))}
//         </div>
//         <div>
//           {activeTab === "Hours" && <ProfessionalHoursTableWithDuration />}
//           {activeTab === "Amounts" && (
//             <div className="text-gray-500 text-xs">Amounts content here</div>
//           )}
//           {activeTab === "PLC" && (
//             <div className="text-gray-500 text-xs">PLC content here</div>
//           )}
//           {activeTab === "Revenue Analysis" && (
//             <ProjectRevenueAnalysisTable
//               planId={form.businessBudgetId}
//               onClose={handleCloseRevenueAnalysisTab}
//             />
//           )}
//           {activeTab === "Analysis By Period" && (
//             <div className="text-gray-500 text-xs">
//               Analysis By Period content here
//             </div>
//           )}
//           {activeTab === null && (
//             <div className="text-gray-500 text-xs text-center p-4">
//               Click a tab above to see its content.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewBusiness;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { backendUrl } from "./config";

// Reusable FormField component for consistent layout
const FormField = ({ label, children }) => (
  <div className="flex items-center gap-2">
    <label className="w-28 text-[11px] sm:text-xs font-normal whitespace-nowrap">{label}:</label>
    <div className="flex-1">{children}</div>
  </div>
);

// Component to display all existing business data in a table
const SavedBusinessTableDisplay = ({ allBusinessBudgets, onNewBusiness, onEditClick, onDeleteClick, onBackToSearch }) => {
  if (!allBusinessBudgets || allBusinessBudgets.length === 0) {
    return (
      <div className="bg-white rounded shadow p-4 text-center">
        <p className="text-gray-600 mb-4">No business budget data available to display.</p>
      </div>
    );
  }

  // Define table headers and their corresponding keys in the data object
  const headers = [
    { label: "Budget ID", key: "businessBudgetId" },
    { label: "Description", key: "description" },
    { label: "Level", key: "level" },
    { label: "Active", key: "isActive" },
    { label: "Version", key: "version" },
    { label: "Version Code", key: "versionCode" },
    { label: "Winning Probability %", key: "winningProbability" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
    { label: "Escalation Rate", key: "escalationRate" },
    { label: "Org ID", key: "orgId" },
    { label: "Account Group", key: "accountGroup" },
    { label: "Burden Template ID", key: "burdenTemplateId" },
    { label: "Actions", key: "actions" }, // For Edit/Delete buttons
  ];

  // Helper function to format display values
  const formatValue = (key, value) => {
    if (key === "isActive") {
      return value ? "Yes" : "No";
    }
    if (key === "startDate" || key === "endDate") {
      // FIX: Explicitly check for the "0001-01-01T00:00:00" string or falsy values
      if (!value || value === "0001-01-01T00:00:00") {
        return "N/A";
      }
      const date = new Date(value);
      // Fallback for any other invalid date that might slip through
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.toLocaleDateString();
    }
    // Specific check for Winning Probability %: ensure 0 is displayed as "0"
    if (key === "winningProbability" && (value === 0 || value === "0")) {
      return "0";
    }
    // For any other value, display it as string, otherwise "N/A"
    return value !== null && value !== undefined && value !== "" ? String(value) : "N/A";
  };

  // FIX: Custom sort function for businessBudgetId (e.g., Test.1, Test.10, Test.2)
  const sortBudgets = (a, b) => {
    const idA = a.businessBudgetId;
    const idB = b.businessBudgetId;

    // Handle cases like "Test.1" vs "Test.10" correctly
    const partsA = idA.split('.');
    const partsB = idB.split('.');

    const prefixA = partsA[0];
    const prefixB = partsB[0];

    const numA = parseInt(partsA[1], 10);
    const numB = parseInt(partsB[1], 10);

    // First, sort by the text prefix
    if (prefixA < prefixB) return -1;
    if (prefixA > prefixB) return 1;

    // If prefixes are the same, sort by the numeric part
    return numA - numB;
  };

  const sortedBudgets = [...allBusinessBudgets].sort(sortBudgets);

  return (
    <div className="p-2 sm:p-4 space-y-6 text-[11px] sm:text-xs text-gray-800 font-sans max-w-4xl mx-auto">
      <div className="bg-white rounded shadow p-2 sm:p-4 mb-4 relative">
        <h2 className="text-xs sm:text-sm font-normal mb-3 font-sans">
          Business Budget Details
        </h2>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className="px-2 py-2 text-left text-[11px] sm:text-xs font-normal text-gray-700 font-sans"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBudgets.map((budget) => (
                <tr key={budget.businessBudgetId}>
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      className="px-2 py-2 whitespace-nowrap text-[11px] sm:text-xs font-normal text-gray-900 font-sans"
                    >
                      {header.key === "actions" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                                console.log("Edit button clicked for budget:", budget);
                                onEditClick(budget);
                            }}
                            className="bg-green-600 text-white px-2 py-1 rounded text-[10px] hover:bg-green-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteClick(budget.businessBudgetId)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-[10px] hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          {formatValue(header.key, budget[header.key])}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewBusiness = ({ onClose }) => {
  const [form, setForm] = useState({
    businessBudgetId: "",
    description: "",
    level: "",
    active: false, // Matches isActive from API
    version: "",
    versionCode: "",
    winningProbability: "",
    startDate: "",
    endDate: "",
    period: "Q1 2024", // Read-only
    weeks: "12", // Read-only
    escalationRate: "",
    orgId: "",
    accountGrp: "", // Matches accountGroup from API
    burdenTemplateId: "",
  });

  const [viewMode, setViewMode] = useState('form'); // Always start with form view
  const [allBusinessBudgets, setAllBusinessBudgets] = useState([]); // To store all budgets for the table
  const [burdenTemplates, setBurdenTemplates] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // New state to manage update mode

  // useEffect to log form state whenever it changes (for debugging purposes)
  useEffect(() => {
    console.log("NewBusiness.jsx -> useEffect: Current form state (after render):", form);
  }, [form]);

  // Fetch burden templates on component mount
  useEffect(() => {
    const fetchBurdenTemplates = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllTemplates`
        );
        if (response.data && Array.isArray(response.data)) {
          setBurdenTemplates(response.data);
        } else {
          toast.error("Failed to fetch burden templates: Unexpected data format.");
          console.error("Unexpected API response for burden templates:", response.data);
        }
      } catch (error) {
        toast.error(`Error fetching burden templates: ${error.message}`);
        console.error("Error fetching burden templates:", error);
      }
    };
    fetchBurdenTemplates();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "startDate" || name === "endDate") {
        console.log(`handleChange: Input ${name} changed to value: ${value}`);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.businessBudgetId || !form.description || !form.startDate || !form.endDate) {
      toast.error(
        "Please fill in all required fields: Business Budget ID, Description, Start Date, and End Date."
      );
      return;
    }

    if (form.startDate && form.endDate) {
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    
    if (endDate < startDate) {
      toast.error("End Date cannot be earlier than Start Date. Please select a valid date range.");
      return;
    }
  }

    // const payload = {
    //   businessBudgetId: form.businessBudgetId,
    //   description: form.description,
    //   level: parseInt(form.level) || 0,
    //   isActive: form.active, // Map form.active to API's isActive
    //   version: parseInt(form.version) || 0,
    //   versionCode: form.versionCode,
    //   winningProbability: parseFloat(form.winningProbability) || 0,
    //   startDate: form.startDate ? `${form.startDate}T00:00:00` : "0001-01-01T00:00:00", // Ensure valid default if empty
    //   endDate: form.endDate ? `${form.endDate}T00:00:00` : "0001-01-01T00:00:00",     // Ensure valid default if empty
    //   escalationRate: parseFloat(form.escalationRate) || 0,
    //   orgId: parseInt(form.orgId) || 0,
    //   accountGroup: form.accountGrp, // Map form.accountGrp to API's accountGroup
    //   burdenTemplateId: parseInt(form.burdenTemplateId) || 0,
    //   modifiedBy: "admin", // Hardcoded
    // };
    
    const payload = {
  projId: form.businessBudgetId, // Map businessBudgetId to projId
  plId: 0,
  plType: "NBBUD",
  source: "",
  type: "", // Empty string as requested
  version: parseInt(form.version) || 0,
  versionCode: form.versionCode || "",
  finalVersion: false,
  isCompleted: false,
  isApproved: false,
  status: "In Progress",
  createdBy: "User",
  modifiedBy: "User",
  approvedBy: "",
  templateId: parseInt(form.burdenTemplateId) || 1 // Map burdenTemplateId to templateId with default 1
};

    console.log("Sending payload:", payload);

    try {
      let response;
      if (isUpdateMode) {
        response = await axios.put(
          `${backendUrl}/UpdateNewBusiness`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Budget details updated successfully!");
      } else {
        response = await axios.post(
          `${backendUrl}/Project/AddProjectPlan`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Budget details saved successfully!");
      }

      console.log("API response:", response.data);
      // After save/update, show the updated single item in table view
      // setAllBusinessBudgets([response.data]); // Show the newly saved/updated item in table
      // setViewMode('table'); // Go to table view after save/update
      // Reset form and mode for next operation
      setIsUpdateMode(false);
      setForm({
        businessBudgetId: "", description: "", level: "", active: false,
        version: "", versionCode: "", winningProbability: "", startDate: "",
        endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
        orgId: "", accountGrp: "", burdenTemplateId: "",
      });
    } catch (error) {
      console.error("Error saving/updating form data:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save/update budget details.";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm(`Are you sure you want to delete Business Budget ID: ${budgetId}? This action cannot be undone.`)) {
      try {
        const response = await axios.delete(
          `${backendUrl}/DeleteNewBusiness/${budgetId}`
        );
        toast.success(`Business Budget ID ${budgetId} deleted successfully!`);
        // After deletion, return to form view
        setAllBusinessBudgets([]); // Clear table data
        setViewMode('form'); // Go back to form view
      } catch (error) {
        console.error("Error deleting business budget:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete budget.";
        toast.error(`Error deleting budget: ${errorMessage}`);
      }
    }
  };

  const onEditClick = (budget) => {
    console.log("NewBusiness.jsx -> onEditClick: Received budget for pre-filling:", budget);
    setForm({
      businessBudgetId: budget.businessBudgetId || "",
      description: budget.description || "",
      level: String(budget.level || ""), // Convert to string
      active: budget.isActive, // Boolean as is
      version: String(budget.version || ""), // Convert to string
      versionCode: budget.versionCode || "",
      winningProbability: String(budget.winningProbability || ""), // Convert to string
      // FIX: Handle "0001-01-01T00:00:00" explicitly for date inputs
      startDate: (budget.startDate === "0001-01-01T00:00:00" || !budget.startDate)
                 ? "" // Set to empty string for date input if it's the default invalid date
                 : new Date(budget.startDate).toISOString().split('T')[0],
      endDate: (budget.endDate === "0001-01-01T00:00:00" || !budget.endDate)
               ? "" // Set to empty string for date input if it's the default invalid date
               : new Date(budget.endDate).toISOString().split('T')[0],
      period: "Q1 2024", // Read-only
      weeks: "12", // Read-only
      escalationRate: String(budget.escalationRate || ""), // Convert to string
      orgId: String(budget.orgId || ""), // Convert to string
      accountGrp: budget.accountGroup || "", // String as is
      burdenTemplateId: String(budget.burdenTemplateId || ""), // Convert to string
    });
    setIsUpdateMode(true);
    setViewMode('form'); // Go to form view
  };

  const handleNewBusinessClick = () => {
    setViewMode('form'); // Show the form for a new entry
    setIsUpdateMode(false); // Ensure it's in add mode
    setForm({ // Reset form to blank
      businessBudgetId: "", description: "", level: "", active: false,
      version: "", versionCode: "", winningProbability: "", startDate: "",
      endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
      orgId: "", accountGrp: "", burdenTemplateId: "",
    });
  };

  const handleBackToForm = () => {
    setAllBusinessBudgets([]); // Clear displayed table data
    setViewMode('form'); // Go back to the form screen
    // Also reset the form in case it was pre-filled before going to table
    setForm({
        businessBudgetId: "", description: "", level: "", active: false,
        version: "", versionCode: "", winningProbability: "", startDate: "",
        endDate: "", period: "Q1 2024", weeks: "12", escalationRate: "",
        orgId: "", accountGrp: "", burdenTemplateId: "",
    });
    setIsUpdateMode(false);
  };

  return (
    <div className="p-2 sm:p-4 space-y-6 text-[11px] sm:text-xs text-gray-800 font-sans max-w-4xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        closeButton
      />

      {viewMode === 'form' && (
        // New Business Budget Form
        <form className="bg-white rounded shadow p-2 sm:p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs sm:text-sm font-normal">
              {isUpdateMode ? "Update Business Budget" : "New Business Budget"}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 text-white px-3 py-1 rounded text-[11px] sm:text-xs hover:bg-blue-700 transition cursor-pointer"
              >
                {isUpdateMode ? "Update" : "Save"}
              </button>
               <button
      type="button"
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 text-lg font-bold leading-none hover:bg-gray-200 rounded px-2 py-1 ml-2 cursor-pointer"
      title="Close"
    >
      ×
    </button>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <label className=" text-[11px] sm:text-xs font-normal whitespace-nowrap">
              Business Budget ID:
            </label>
            <input
              name="businessBudgetId"
              value={form.businessBudgetId}
              onChange={handleChange}
              className="border border-gray-300 rounded px-1 py-0.5 w-40 text-[11px] sm:text-xs"
              type="text"
              readOnly={isUpdateMode} // Make ID read-only in update mode
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            <div className="space-y-2">
              <FormField label="Description">
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                  type="text"
                />
              </FormField>
              <FormField label="Level">
                <input
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                />
              </FormField>
              <FormField label="Active">
                <input
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="accent-blue-600"
                  type="checkbox"
                  style={{ width: 14, height: 14 }}
                />
              </FormField>
              <FormField label="Version">
                <input
                  name="version"
                  value={form.version}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                />
              </FormField>
              <FormField label="Version Code">
                <input
                  name="versionCode"
                  value={form.versionCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                  type="text"
                />
              </FormField>
              <FormField label="Winning Probability %">
                <input
                  name="winningProbability"
                  value={form.winningProbability}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  min="0"
                  max="100"
                />
              </FormField>
            </div>
            <div className="space-y-2">
              <FormField label="Start Date">
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                  type="date"
                />
              </FormField>
              {/* <FormField label="Start Date">
  <input
    name="startDate"
    value={form.startDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
    type="date"
    placeholder=""
  />
</FormField> */}
{/* <FormField label="Start Date">
  <input
    name="startDate"
    value={form.startDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs date-input-clean"
    type="date"
    placeholder=""
  />
</FormField> */}
{/* <FormField label="Start Date">
  <input
    name="startDate"
    value={form.startDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs text-transparent focus:text-black cursor-pointer"
    type="date"
    onFocus={(e) => {
      if (e.target.showPicker && typeof e.target.showPicker === 'function') {
        e.target.showPicker();
      }
    }}
    onClick={(e) => {
      if (e.target.showPicker && typeof e.target.showPicker === 'function') {
        e.target.showPicker();
      }
    }}
    onMouseDown={(e) => {
      if (e.target.showPicker && typeof e.target.showPicker === 'function') {
        setTimeout(() => e.target.showPicker(), 0);
      }
    }}
  />
</FormField> */}

<FormField label="End Date">
  <input
    name="endDate"
    value={form.endDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
    type="date"
    min={form.startDate} // NEW: This prevents selecting dates before start date
  />
</FormField>


              {/* <FormField label="End Date">
                <input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                  type="date"
                />
              </FormField> */}
              {/* <FormField label="End Date">
  <input
    name="endDate"
    value={form.endDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
    type="date"
    placeholder=""
  />
</FormField> */}
{/* <FormField label="End Date">
  <input
    name="endDate"
    value={form.endDate}
    onChange={handleChange}
    className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs date-input-clean"
    type="date"
    placeholder=""
  />
</FormField> */}



              <FormField label="Period">
                <input
                  name="period"
                  value={form.period}
                  readOnly
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs bg-gray-100"
                  type="text"
                />
              </FormField>
              <FormField label="Weeks">
                <input
                  name="weeks"
                  value={form.weeks}
                  readOnly
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs bg-gray-100"
                  type="text"
                />
              </FormField>
              <FormField label="Escalation Rate">
                <input
                  name="escalationRate"
                  value={form.escalationRate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  step="0.01"
                />
              </FormField>
              <FormField label="Org ID">
                <input
                  name="orgId"
                  value={form.orgId}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="text"
                />
              </FormField>
              <FormField label="Account Group">
                <input
                  name="accountGrp"
                  value={form.accountGrp}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                  type="text"
                />
              </FormField>
              <FormField label="Burden Template ID">
                <select
                  name="burdenTemplateId"
                  value={form.burdenTemplateId}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-1 py-0.5 w-full text-[11px] sm:text-xs"
                >
                  <option value="">Select a Template ID</option>
                  {burdenTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.id}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </form>
      )}

      {viewMode === 'table' && (
        <SavedBusinessTableDisplay
          allBusinessBudgets={allBusinessBudgets}
          onNewBusiness={handleNewBusinessClick}
          onEditClick={onEditClick}
          onDeleteClick={handleDelete}
          onBackToSearch={handleBackToForm}
        />
      )}
    </div>
  );
};

export default NewBusiness;
