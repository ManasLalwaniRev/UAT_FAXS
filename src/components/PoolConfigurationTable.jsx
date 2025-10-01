// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PoolConfigurationTable = () => {
//   const [tableData, setTableData] = useState([]);
//   const [originalTableData, setOriginalTableData] = useState([]);
//   const [groupCodes, setGroupCodes] = useState([]);
//   const [groupNames, setGroupNames] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());

  
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

//   useEffect(() => {
  
//   const fetchData = async () => {
//   setLoading(true);
//   try {
//     // Call GetAllPools without fiscalYear parameter
//     const groupResponse = await axios.get(
//       "${backendUrl}/Orgnization/GetAllPools"
//     );
//     console.log("Group codes API response:", groupResponse.data);

//     const codes = groupResponse.data.map((item) => item.code);
//     const names = groupResponse.data.reduce((acc, item) => {
//       acc[item.code] = item.name;
//       return acc;
//     }, {});
//     setGroupCodes(codes);
//     setGroupNames(names);

//     // Call GetAccountPools with fiscalYear parameter
//     const tableResponse = await axios.get(
//       `${backendUrl}/Orgnization/GetAccountPools?Year=${fiscalYear}`
//     );
//     console.log("Table data API response:", tableResponse.data);
//     const tableDataRaw = tableResponse.data;

//     const mappedData = tableDataRaw.map((row) => {
//       const mappedRow = { orgId: row.orgId || "", acctId: row.acctId || "" };
//       codes.forEach((code) => {
//         mappedRow[code] = row[code.toUpperCase()] === true;
//       });
//       return mappedRow;
//     });

//     setTableData(mappedData);
//     setOriginalTableData(mappedData);
//     setError(null);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     setError(err.response?.data?.message || err.message || "Unknown error");
//     setTableData([]);
//     setOriginalTableData([]);
//     setGroupCodes([]);
//     setGroupNames({});
//   } finally {
//     setLoading(false);
//   }
// };

//     fetchData();
//   }, [fiscalYear]);

//   const handleCheckboxChange = (orgId, acctId, groupCode) => {
//     setTableData((prev) =>
//       prev.map((row) => {
//         if (row.orgId === orgId && row.acctId === acctId) {
//           return {
//             ...row,
//             [groupCode]: !row[groupCode],
//           };
//         }
//         return row;
//       })
//     );
//   };

//   const handleSave = async () => {
//     const changedRows = tableData
//       .filter((row) => {
//         const origRow = originalTableData.find(
//           (o) => o.orgId === row.orgId && o.acctId === row.acctId
//         );
//         if (!origRow) return false;
//         return groupCodes.some((code) => row[code] !== origRow[code]);
//       })
//       .map((row) => ({
//         orgId: row.orgId,
//         acctId: row.acctId,
//         Year: fiscalYear,
//         ...groupCodes.reduce((acc, code) => {
//           acc[code] = row[code] || false;
//           return acc;
//         }, {}),
//       }));

//     if (changedRows.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     console.log("Sending POST request with body:", JSON.stringify(changedRows, null, 2));

//     setIsSaving(true);
//     try {
//       const response = await axios.post(
//         "${backendUrl}/Orgnization/BulkUpSertOrgAccountPoolMapping",
//         changedRows,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("API Response:", response.data);
//       setOriginalTableData([...tableData]);
//       setError(null);
//       toast.success("Data saved successfully");
//     } catch (err) {
//       console.error("API Error:", err);
//       const errorMessage =
//         err.response?.data?.message || err.message || "Failed to update pool mapping";
//       setError(errorMessage);
//       setTableData([...originalTableData]);
//       setTimeout(() => setError(null), 5000);
//       toast.error(errorMessage);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 font-roboto">
//         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600 text-sm font-medium">Loading...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 p-3 bg-red-50 rounded-lg font-roboto text-sm font-medium shadow-sm">
//         Error: {error}
//       </div>
//     );
//   }

//   const filteredData = tableData.filter((row) =>
//     row.acctId.toString().toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 sm:p-5 max-w-6xl mx-auto font-roboto bg-gray-50 rounded-xl shadow-md">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />

//       <h2 className="w-full bg-green-50 border-l-4 border-green-400 p-3 rounded-lg shadow-sm mb-4">
//         Pool Configuration
//       </h2>

//       {/* Fiscal Year Dropdown */}
//       <div className="flex items-center gap-4 mb-3">
//         <label htmlFor="fiscalYear" className="font-medium text-gray-700 text-sm">
//           Fiscal Year:
//         </label>
//         <select
//           id="fiscalYear"
//           value={fiscalYear}
//           onChange={(e) => setFiscalYear(parseInt(e.target.value))}
//           className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//         >
//           {years.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>

//         {/* Spacer */}
//         <div className="flex-grow"></div>

//         {/* Search Box */}
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search by Account ID"
//           className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
//         />

//         {/* Save Button */}
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="ml-3 bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSaving ? (
//             <>
//               <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>Saving...
//             </>
//           ) : (
//             "Save"
//           )}
//         </button>
//       </div>

//       <div
//         style={{
//           maxHeight: "500px",
//           overflowY: "auto",
//           position: "relative",
//           border: "1px solid #e5e7eb",
//           borderRadius: "0.5rem",
//         }}
//       >
//         <table className="min-w-full bg-white">
//           <thead
//             className="bg-blue-50"
//             style={{
//               position: "sticky",
//               top: 0,
//               zIndex: 10,
//               boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//             }}
//           >
//             <tr className="border-b border-gray-200">
//               <th className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200">
//                 Org ID
//               </th>
//               <th className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200">
//                 Account ID
//               </th>
//               {groupCodes.map((code, index) => (
//                 <th
//                   key={index}
//                   className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200"
//                 >
//                   {groupNames[code] || code}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((row) => (
//               <tr
//                 key={`${row.orgId}-${row.acctId}`}
//                 className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//               >
//                 <td className="py-2 px-3 text-gray-600 text-xs font-xs whitespace-nowrap border-r border-gray-200">
//                   {row.orgId}
//                 </td>
//                 <td className="py-2 px-3 text-gray-600 text-xs font-xs whitespace-nowrap border-r border-gray-200">
//                   {row.acctId}
//                 </td>
//                 {groupCodes.map((code, idx) => (
//                   // <td key={idx} className="py-2 px-3 border-r border-gray-200">
//                   //   <input
//                   //     type="checkbox"
//                   //     checked={row[code] === true}
//                   //     onChange={() => handleCheckboxChange(row.orgId, row.acctId, code)}
//                   //     className="h-4 w-4 text-blue-600 border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
//                   //   />
//                   // </td>
//                   <td key={idx} className="py-2 px-3 border-r border-gray-200 text-center align-middle">
//   <input
//     type="checkbox"
//     checked={row[code] === true}
//     onChange={() => handleCheckboxChange(row.orgId, row.acctId, code)}
//     className="h-3 w-3 text-blue-600 border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
//   />
// </td>

//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PoolConfigurationTable;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const PoolConfigurationTable = () => {
  const [tableData, setTableData] = useState([]);
  const [originalTableData, setOriginalTableData] = useState([]);
  const [groupCodes, setGroupCodes] = useState([]);
  const [groupNames, setGroupNames] = useState({});
  const [groupTypes, setGroupTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const groupResponse = await axios.get(
          `${backendUrl}/Orgnization/GetAllPools`
        );
        const codes = groupResponse.data.map((item) => item.code);
        const names = groupResponse.data.reduce((acc, item) => {
          acc[item.code] = item.name;
          return acc;
        }, {});
        const types = groupResponse.data.reduce((acc, item) => {
          acc[item.code] = item.type;
          return acc;
        }, {});
        setGroupCodes(codes);
        setGroupNames(names);
        setGroupTypes(types);

        const tableResponse = await axios.get(
          `${backendUrl}/Orgnization/GetAccountPools?Year=${fiscalYear}`
        );
        const tableDataRaw = tableResponse.data;

        const mappedData = tableDataRaw.map((row) => {
          const mappedRow = { orgId: row.orgId || "", acctId: row.acctId || "" };
          codes.forEach((code) => {
            mappedRow[code] = row[code.toUpperCase()] === true;
          });
          return mappedRow;
        });

        setTableData(mappedData);
        setOriginalTableData(mappedData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unknown error");
        setTableData([]);
        setOriginalTableData([]);
        setGroupCodes([]);
        setGroupNames({});
        setGroupTypes({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fiscalYear]);

  // Only fire one warning toast per click
  const handleCheckboxChange = (orgId, acctId, groupCode) => {
    let showWarning = false;

    setTableData((prev) =>
      prev.map((row) => {
        if (row.orgId === orgId && row.acctId === acctId) {
          const targetType = groupTypes[groupCode];
          const isCurrentlyChecked = row[groupCode] === true;
          if (!isCurrentlyChecked) {
            // Check if any other pool of same type is already checked
            const otherChecked = groupCodes.some(
              (code) =>
                code !== groupCode &&
                groupTypes[code] === targetType &&
                row[code] === true
            );
            if (otherChecked) {
              showWarning = true; // Mark to show toast after state update
              return row; // Prevent checking
            }
          }
          // Toggle as normal (set this one ON/OFF)
          return {
            ...row,
            [groupCode]: !row[groupCode]
          };
        }
        return row;
      })
    );

    // Show toast outside of state setter to avoid duplicate toasts
    setTimeout(() => {
      if (showWarning) {
        toast.warn("Duplicate pool type mapping detected for this Org Account");
      }
    }, 0);
  };

  const handleSave = async () => {
    const changedRows = tableData
      .filter((row) => {
        const origRow = originalTableData.find(
          (o) => o.orgId === row.orgId && o.acctId === row.acctId
        );
        if (!origRow) return false;
        return groupCodes.some((code) => row[code] !== origRow[code]);
      })
      .map((row) => ({
        orgId: row.orgId,
        acctId: row.acctId,
        Year: fiscalYear,
        ...groupCodes.reduce((acc, code) => {
          acc[code] = row[code] || false;
          return acc;
        }, {}),
      }));

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setIsSaving(true);
    try {
      await axios.post(
        `${backendUrl}/Orgnization/BulkUpSertOrgAccountPoolMapping`,
        changedRows,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setOriginalTableData([...tableData]);
      setError(null);
      toast.success("Data saved successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update pool mapping";
      setError(errorMessage);
      setTableData([...originalTableData]);
      setTimeout(() => setError(null), 5000);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-roboto">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-3 bg-red-50 rounded-lg font-roboto text-sm font-medium shadow-sm">
        Error: {error}
      </div>
    );
  }

  const filteredData = tableData.filter((row) =>
    row.acctId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-5 max-w-6xl mx-auto font-roboto bg-gray-50 rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      <h2 className="w-full bg-green-50 border-l-4 border-green-400 p-3 rounded-lg shadow-sm mb-4">
        Pool Configuration
      </h2>
      <div className="flex items-center gap-4 mb-3">
        <label htmlFor="fiscalYear" className="font-medium text-gray-700 text-sm">
          Fiscal Year:
        </label>
        <select
          id="fiscalYear"
          value={fiscalYear}
          onChange={(e) => setFiscalYear(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="flex-grow"></div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Account ID"
          className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-3 bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          position: "relative",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
        }}
      >
        <table className="min-w-full bg-white">
          <thead
            className="bg-blue-50"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200">
                Org ID
              </th>
              <th className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200">
                Account ID
              </th>
              {groupCodes.map((code, index) => (
                <th
                  key={index}
                  className="py-2 px-3 text-left text-gray-800 font-normal text-xs whitespace-nowrap border-r border-gray-200"
                >
                  {groupNames[code] || code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={`${row.orgId}-${row.acctId}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-3 text-gray-600 text-xs font-xs whitespace-nowrap border-r border-gray-200">
                  {row.orgId}
                </td>
                <td className="py-2 px-3 text-gray-600 text-xs font-xs whitespace-nowrap border-r border-gray-200">
                  {row.acctId}
                </td>
                {groupCodes.map((code, idx) => (
                  <td key={idx} className="py-2 px-3 border-r border-gray-200 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={row[code] === true}
                      onChange={() => handleCheckboxChange(row.orgId, row.acctId, code)}
                      className="h-3 w-3 text-blue-600 border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoolConfigurationTable;
