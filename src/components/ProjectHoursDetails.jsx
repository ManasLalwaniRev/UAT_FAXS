// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import Warning from "./Warning";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";

// const EMPLOYEE_COLUMNS = [
//   { key: "idType", label: "ID Type" },
//   { key: "emplId", label: "ID" },
//   { key: "warning", label: "Warning" },
//   { key: "name", label: "Name" },
//   { key: "acctId", label: "Account" },
//   { key: "orgId", label: "Organization" },
//   { key: "glcPlc", label: "Plc" },
//   { key: "isRev", label: "Rev" },
//   { key: "isBrd", label: "Brd" },
//   { key: "status", label: "Status" },
//   { key: "perHourRate", label: "Hour Rate" },
//   { key: "total", label: "Total" },
// ];

// const ID_TYPE_OPTIONS = [
//   { value: "", label: "Select ID Type" },
//   { value: "Employee", label: "Employee" },
//   { value: "Vendor", label: "Vendor Employee" },
//   { value: "PLC", label: "PLC" },
//   { value: "Other", label: "Other" },
// ];

// const ROW_HEIGHT_DEFAULT = 48;

// function isMonthEditable(duration, closedPeriod, planType) {
//   if (planType !== "EAC") return true;
//   if (!closedPeriod) return true;
//   const closedDate = new Date(closedPeriod);
//   if (isNaN(closedDate)) return true;
//   const durationDate = new Date(duration.year, duration.monthNo - 1, 1);
//   const closedMonth = closedDate.getMonth();
//   const closedYear = closedDate.getFullYear();
//   const durationMonth = durationDate.getMonth();
//   const durationYear = durationDate.getFullYear();
//   return (
//     durationYear > closedYear ||
//     (durationYear === closedYear && durationMonth >= closedMonth)
//   );
// }

// const ProjectHoursDetails = ({
//   planId,
//   projectId,
//   status,
//   planType,
//   closedPeriod,
//   startDate,
//   endDate,
//   fiscalYear,
//   onSaveSuccess,
// }) => {
//   const [durations, setDurations] = useState([]);
//   const [isDurationLoading, setIsDurationLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [hiddenRows, setHiddenRows] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [showFindReplace, setShowFindReplace] = useState(false);
//   const [findValue, setFindValue] = useState("");
//   const [replaceValue, setReplaceValue] = useState("");
//   const [replaceScope, setReplaceScope] = useState("all");
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   const [selectedColumnKey, setSelectedColumnKey] = useState(null);
//   const [showNewForm, setShowNewForm] = useState(false);
//   const [newEntry, setNewEntry] = useState({
//     id: "",
//     firstName: "",
//     lastName: "",
//     isRev: false,
//     isBrd: false,
//     idType: "",
//     acctId: "",
//     orgId: "",
//     plcGlcCode: "",
//     perHourRate: "",
//     status: "Act",
//   });
//   const [newEntryPeriodHours, setNewEntryPeriodHours] = useState({});
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [successMessageText, setSuccessMessageText] = useState("");
//   const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
//   const [laborAccounts, setLaborAccounts] = useState([]);
//   const [plcOptions, setPlcOptions] = useState([]);
//   const [plcSearch, setPlcSearch] = useState("");
//   const [showFillValues, setShowFillValues] = useState(false);
//   const [fillMethod, setFillMethod] = useState("None");
//   const [fillHours, setFillHours] = useState(0.0);
//   const [sourceRowIndex, setSourceRowIndex] = useState(null);
//   const [editedEmployeeData, setEditedEmployeeData] = useState({});
//   const [localEmployees, setLocalEmployees] = useState([]);
//   const [fillStartDate, setFillStartDate] = useState(startDate);
//   const [fillEndDate, setFillEndDate] = useState(endDate);
//   const [isLoading, setIsLoading] = useState(false);
//   const [autoPopulatedPLC, setAutoPopulatedPLC] = useState(false); // Track if PLC is auto-populated
//   const [organizationOptions, setOrganizationOptions] = useState([]);
//   const [orgSearch, setOrgSearch] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [filteredPlcOptions, setFilteredPlcOptions] = useState([]);
//   // Add these state variables after your existing useState declarations
//   const [updateAccountOptions, setUpdateAccountOptions] = useState([]);
//   const [updateOrganizationOptions, setUpdateOrganizationOptions] = useState(
//     []
//   );
//   const [updatePlcOptions, setUpdatePlcOptions] = useState([]);
//   const [showWarningPopup, setShowWarningPopup] = useState(false);
//   const [selectedEmployeeIdForWarning, setSelectedEmployeeIdForWarning] =
//     useState(null);
//   const [localWarnings, setLocalWarnings] = useState({});

//   const debounceTimeout = useRef(null);
//   // const horizontalScrollRef = useRef(null);
//   // const verticalScrollRef = useRef(null);
//   const firstTableRef = useRef(null);
//   const secondTableRef = useRef(null);
//   // const vfirstTableRef = useRef(null);
//   // const vlastTableRef = useRef(null);
//   const scrollingLock = useRef(false);
 
//   const syncScroll = (sourceRef, targetRef) => {
//     if (!sourceRef.current || !targetRef.current) return;
//     // Only sync if not already in an update
//     if (!scrollingLock.current) {
//       scrollingLock.current = true;
//       targetRef.current.scrollTop = sourceRef.current.scrollTop;
//       // Allow event on next tick
//       setTimeout(() => {
//         scrollingLock.current = false;
//       }, 0);
//     }
//   };
 
//   const handleFirstScroll = () => {
//     syncScroll(firstTableRef, secondTableRef);
//   };
 
//   const handleSecondScroll = () => {
//     syncScroll(secondTableRef, firstTableRef);
//   };

//   const isEditable = status === "In Progress";
//   // const isBudPlan = planType === "BUD";
//   const isBudPlan = planType === "BUD" || planType === "NBBUD";

//   // const isFieldEditable = planType === "BUD" || planType === "EAC"; // Add this line
//   const isFieldEditable =
//     planType === "BUD" || planType === "EAC" || planType === "NBBUD";

//   // Clear all fields when ID type changes
//   useEffect(() => {
//     if (newEntry.idType === "PLC") {
//       setNewEntry({
//         ...newEntry,
//         id: "PLC",
//         firstName: "",
//         lastName: "",
//         perHourRate: "",
//         orgId: "",
//         plcGlcCode: "",
//         acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//       });
//       setPlcSearch("");
//       setAutoPopulatedPLC(false);
//     } else if (newEntry.idType !== "") {
//       // Clear all fields when switching to any other type
//       setNewEntry((prev) => ({
//         ...prev,
//         id: "",
//         firstName: "",
//         lastName: "",
//         perHourRate: "",
//         orgId: "",
//         plcGlcCode: "",
//         acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//       }));
//       setPlcSearch("");
//       setAutoPopulatedPLC(false);
//     }
//     // eslint-disable-next-line
//   }, [newEntry.idType]);

//   const isValidEmployeeId = (id) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!id) return false;
//     if (newEntry.idType === "Employee" || newEntry.idType === "Vendor") {
//       return !!employeeSuggestions.find((emp) => emp.emplId === id);
//     }
//     if (newEntry.idType === "Other") {
//       return !!employeeSuggestions.find((emp) => emp.emplId === id);
//     }
//     return true;
//   };

//   const isValidAccount = (val) => {
//     if (planType === "NBBUD") return true; // Add this line
//     return !val || laborAccounts.some((acc) => acc.id === val);
//   };

//   const isValidOrg = (val) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!val) return false;
//     const trimmed = val.toString().trim();
//     if (!/^[\d.]+$/.test(trimmed)) return false;
//     return organizationOptions.some((opt) => opt.value.toString() === trimmed);
//   };

//   const isValidOrgForUpdate = (val, updateOptions) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!val) return false;
//     const trimmed = val.toString().trim();
//     if (!/^[\d.]+$/.test(trimmed)) return false;
//     return updateOptions.some((opt) => opt.value.toString() === trimmed);
//   };

//   const isValidAccountForUpdate = (val, updateOptions) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!val) return false;
//     const trimmed = val.toString().trim();
//     return updateOptions.some((opt) => opt.id === trimmed);
//   };

//   const isValidPlc = (val) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!val) return true;
//     if (plcOptions.length === 0) return true;
//     const isValid = plcOptions.some((option) => option.value === val.trim());
//     return isValid;
//   };

//   const isValidPlcForUpdate = (val, updateOptions) => {
//     if (planType === "NBBUD") return true; // Add this line
//     if (!val) return true;
//     if (updateOptions.length === 0) return true;
//     const trimmed = val.toString().trim();
//     return updateOptions.some((option) => option.value === trimmed);
//   };

//   // Track unsaved changes
//   const hasUnsavedChanges = () => {
//     const isNewEntryModified =
//       newEntry.id !== "" ||
//       newEntry.firstName !== "" ||
//       newEntry.lastName !== "" ||
//       newEntry.isRev ||
//       newEntry.isBrd ||
//       newEntry.idType !== "" ||
//       newEntry.acctId !== "" ||
//       newEntry.orgId !== "" ||
//       newEntry.plcGlcCode !== "" ||
//       newEntry.perHourRate !== "" ||
//       newEntry.status !== "Act";

//     const isPeriodHoursModified = Object.keys(newEntryPeriodHours).length > 0;
//     const isInputValuesModified = Object.keys(inputValues).length > 0;
//     const isEditedEmployeeDataModified =
//       Object.keys(editedEmployeeData).length > 0;

//     return (
//       isNewEntryModified ||
//       isPeriodHoursModified ||
//       isInputValuesModified ||
//       isEditedEmployeeDataModified
//     );
//   };

//   // Handle beforeunload event for unsaved changes
//   useEffect(() => {
//     if (!hasUnsavedChanges()) return;

//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       event.returnValue =
//         "You have unsaved changes. Are you sure you want to leave without saving?";
//       return event.returnValue;
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [newEntry, newEntryPeriodHours, inputValues, editedEmployeeData]);

//   // Vertical sync only
//   // useEffect(() => {
//   //   const container = verticalScrollRef.current;
//   //   const firstScroll = vfirstTableRef.current;
//   //   const lastScroll = vlastTableRef.current;

//   //   if (!container || !firstScroll || !lastScroll) return;

//   //   const onScroll = () => {
//   //     const scrollTop = container.scrollTop;
//   //     firstScroll.scrollTop = scrollTop;
//   //     lastScroll.scrollTop = scrollTop;
//   //   };

//   //   container.addEventListener("scroll", onScroll);
//   //   return () => container.removeEventListener("scroll", onScroll);
//   // }, []);

//   // useEffect(() => {
//   //   const container = horizontalScrollRef.current;
//   //   const firstScroll = firstTableRef.current;
//   //   const lastScroll = lastTableRef.current;

//   //   if (!container || !firstScroll || !lastScroll) return;

//   //   const onScroll = () => {
//   //     const scrollLeft = container.scrollLeft;
//   //     firstScroll.scrollLeft = scrollLeft;
//   //     lastScroll.scrollLeft = scrollLeft;
//   //   };

//   //   container.addEventListener("scroll", onScroll);
//   //   return () => container.removeEventListener("scroll", onScroll);
//   // }, []);

//   const fetchEmployees = async () => {
//     if (!planId) return;
//     setIsLoading(true);
//     try {
//       const employeeApi =
//         planType === "EAC"
//           ? `${backendUrl}/Project/GetEmployeeForecastByPlanID/${planId}`
//           : `${backendUrl}/Project/GetEmployeeForecastByPlanID/${planId}`;
//       const response = await axios.get(employeeApi);
//       setLocalEmployees(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       setLocalEmployees([]);
//       if (err.response && err.response.status === 500) {
//         toast.info("No forecast data available for this plan.", {
//           toastId: "no-forecast-data",
//           autoClose: 3000,
//         });
//       } else {
//         toast.error(
//           "Failed to load forecast data: " +
//             (err.response?.data?.message || err.message),
//           {
//             toastId: "forecast-error",
//             autoClose: 3000,
//           }
//         );
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, [planId, planType]);

//   useEffect(() => {
//     const fetchDurations = async () => {
//       if (!startDate || !endDate) {
//         setDurations([]);
//         setIsDurationLoading(false);
//         return;
//       }
//       setIsDurationLoading(true);
//       setError(null);
//       try {
//         const durationResponse = await axios.get(
//           `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startDate}/${endDate}`
//         );
//         if (!Array.isArray(durationResponse.data)) {
//           throw new Error("Invalid duration response format");
//         }
//         setDurations(durationResponse.data);
//       } catch (err) {
//         setError("Failed to load duration data. Please try again.");
//         toast.error(
//           "Failed to load duration data: " +
//             (err.response?.data?.message || err.message),
//           {
//             toastId: "duration-error",
//             autoClose: 3000,
//           }
//         );
//       } finally {
//         setIsDurationLoading(false);
//       }
//     };
//     fetchDurations();
//   }, [startDate, endDate]);

//   // ADD THIS useEffect after your existing useEffects
//   useEffect(() => {
//     const loadOrganizationOptions = async () => {
//       if (!showNewForm) return;

//       try {
//         const response = await axios.get(
//           `${backendUrl}/Orgnization/GetAllOrgs`
//         );
//         const orgOptions = Array.isArray(response.data)
//           ? response.data.map((org) => ({
//               value: org.orgId,
//               label: org.orgId,
//             }))
//           : [];
//         setOrganizationOptions(orgOptions);
//       } catch (err) {
//         console.error("Failed to fetch organizations:", err);
//       }
//     };

//     loadOrganizationOptions();
//   }, [showNewForm]);

//   useEffect(() => {
//     const initializeUpdateOptions = async () => {
//       if (localEmployees.length === 0) return;

//       try {
//         // Load organizations for updates
//         const orgResponse = await axios.get(
//           `${backendUrl}/Orgnization/GetAllOrgs`
//         );
//         const orgOptions = Array.isArray(orgResponse.data)
//           ? orgResponse.data.map((org) => ({
//               value: org.orgId,
//               label: org.orgId,
//             }))
//           : [];

//         // Load project data for accounts and PLC options
//         if (projectId) {
//           try {
//             const response = await axios.get(
//               `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//             );
//             const data = Array.isArray(response.data)
//               ? response.data[0]
//               : response.data;

//             // Load ALL account types for updates (including PLC and Other types)
//             let allAccounts = [];

//             // Employee accounts
//             if (
//               data.employeeLaborAccounts &&
//               Array.isArray(data.employeeLaborAccounts)
//             ) {
//               const employeeAccounts = data.employeeLaborAccounts.map(
//                 (account) => ({
//                   id: account.accountId,
//                   type: "employee",
//                 })
//               );
//               allAccounts.push(...employeeAccounts);
//             }

//             // Vendor accounts
//             if (
//               data.sunContractorLaborAccounts &&
//               Array.isArray(data.sunContractorLaborAccounts)
//             ) {
//               const vendorAccounts = data.sunContractorLaborAccounts.map(
//                 (account) => ({
//                   id: account.accountId,
//                   type: "vendor",
//                 })
//               );
//               allAccounts.push(...vendorAccounts);
//             }

//             // Other Direct Cost accounts (for "Other" ID type)
//             if (
//               data.otherDirectCostLaborAccounts &&
//               Array.isArray(data.otherDirectCostLaborAccounts)
//             ) {
//               const otherAccounts = data.otherDirectCostLaborAccounts.map(
//                 (account) => ({
//                   id: account.accountId,
//                   type: "other",
//                 })
//               );
//               allAccounts.push(...otherAccounts);
//             }

//             // Remove duplicates
//             const uniqueAccountsMap = new Map();
//             allAccounts.forEach((acc) => {
//               if (acc.id && !uniqueAccountsMap.has(acc.id)) {
//                 uniqueAccountsMap.set(acc.id, { id: acc.id });
//               }
//             });
//             const uniqueAccounts = Array.from(uniqueAccountsMap.values());

//             // Load PLC options
//             let plcOptionsForUpdate = [];
//             if (data.plc && Array.isArray(data.plc)) {
//               plcOptionsForUpdate = data.plc.map((plc) => ({
//                 value: plc.laborCategoryCode,
//                 label: `${plc.laborCategoryCode} - ${plc.description}`,
//               }));
//             }

//             // Initialize all update options with ALL available accounts
//             setUpdateAccountOptions(uniqueAccounts);
//             setUpdateOrganizationOptions(orgOptions);
//             setUpdatePlcOptions(plcOptionsForUpdate);

//             // Also update main options if they're empty
//             if (plcOptions.length === 0) {
//               setPlcOptions(plcOptionsForUpdate);
//               setFilteredPlcOptions(plcOptionsForUpdate);
//             }
//           } catch (err) {
//             console.error("Failed to load project data for updates:", err);
//             setUpdateAccountOptions(laborAccounts);
//             setUpdateOrganizationOptions(orgOptions);
//             setUpdatePlcOptions(plcOptions.length > 0 ? plcOptions : []);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to initialize update options:", err);
//       }
//     };

//     initializeUpdateOptions();
//   }, [localEmployees.length, projectId]);

//   useEffect(() => {
//     const fetchEmployeesSuggestions = async () => {
//       // Skip fetching suggestions for NBBUD
//       if (planType === "NBBUD") {
//         setEmployeeSuggestions([]);
//         return;
//       }

//       if (
//         !projectId ||
//         !showNewForm ||
//         !newEntry.idType ||
//         newEntry.idType === ""
//       ) {
//         setEmployeeSuggestions([]);
//         return;
//       }

//       try {
//         const endpoint =
//           newEntry.idType === "Vendor"
//             ? `${backendUrl}/Project/GetVenderEmployeesByProject/${projectId}`
//             : `${backendUrl}/Project/GetEmployeesByProject/${projectId}`;
//         const response = await axios.get(endpoint);
//         const suggestions = Array.isArray(response.data)
//           ? response.data.map((emp) => {
//               if (newEntry.idType === "Vendor") {
//                 return {
//                   emplId: emp.vendId,
//                   firstName: "",
//                   lastName: emp.employeeName || "",
//                   perHourRate: emp.perHourRate || emp.hrRate || "",
//                   plc: emp.plc || "",
//                   orgId: emp.orgId || "",
//                 };
//               } else {
//                 const [lastName, firstName] = (emp.employeeName || "")
//                   .split(", ")
//                   .map((str) => str.trim());
//                 return {
//                   emplId: emp.empId,
//                   firstName: firstName || "",
//                   lastName: lastName || "",
//                   perHourRate: emp.perHourRate || emp.hrRate || "",
//                   plc: emp.plc || "",
//                   orgId: emp.orgId || "",
//                 };
//               }
//             })
//           : [];
//         setEmployeeSuggestions(suggestions);
//       } catch (err) {
//         setEmployeeSuggestions([]);
//         toast.error(`Failed to fetch employee suggestions`, {
//           toastId: "employee-fetch-error",
//           autoClose: 3000,
//         });
//       }
//     };

//     const fetchLaborAccounts = async () => {
//       if (planType === "NBBUD") return;

//       if (!projectId || !showNewForm) return;
//       try {
//         const response = await axios.get(
//           `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//         );
//         const data = Array.isArray(response.data)
//           ? response.data[0]
//           : response.data;

//         let accounts = [];

//         if (newEntry.idType === "PLC") {
//           // Combine both employee and vendor accounts for PLC
//           const employeeAccounts = Array.isArray(data.employeeLaborAccounts)
//             ? data.employeeLaborAccounts.map((account) => ({
//                 id: account.accountId,
//               }))
//             : [];

//           const vendorAccounts = Array.isArray(data.sunContractorLaborAccounts)
//             ? data.sunContractorLaborAccounts.map((account) => ({
//                 id: account.accountId,
//               }))
//             : [];

//           accounts = [...employeeAccounts, ...vendorAccounts];
//         } else if (newEntry.idType === "Employee") {
//           accounts = Array.isArray(data.employeeLaborAccounts)
//             ? data.employeeLaborAccounts.map((account) => ({
//                 id: account.accountId,
//               }))
//             : [];
//         } else if (newEntry.idType === "Vendor") {
//           accounts = Array.isArray(data.sunContractorLaborAccounts)
//             ? data.sunContractorLaborAccounts.map((account) => ({
//                 id: account.accountId,
//               }))
//             : [];
//         } else if (newEntry.idType === "Other") {
//           // ADD THIS: For "Other" type, show all available accounts (both employee and vendor)
//           // const employeeAccounts = Array.isArray(data.employeeLaborAccounts)
//           //   ? data.employeeLaborAccounts.map(account => ({ id: account.accountId }))
//           //   : [];

//           // const vendorAccounts = Array.isArray(data.sunContractorLaborAccounts)
//           //   ? data.sunContractorLaborAccounts.map(account => ({ id: account.accountId }))
//           //   : [];

//           // accounts = [...employeeAccounts, ...vendorAccounts];
//           // For "Other" type, show only otherDirectCostLaborAccounts
//           accounts = Array.isArray(data.otherDirectCostLaborAccounts)
//             ? data.otherDirectCostLaborAccounts.map((account) => ({
//                 id: account.accountId,
//               }))
//             : [];
//         } else {
//           accounts = [];
//         }

//         // Remove duplicates
//         const uniqueAccountsMap = new Map();
//         accounts.forEach((acc) => {
//           if (acc.id && !uniqueAccountsMap.has(acc.id)) {
//             uniqueAccountsMap.set(acc.id, acc);
//           }
//         });
//         const uniqueAccounts = Array.from(uniqueAccountsMap.values());
//         setLaborAccounts(uniqueAccounts);

//         // Rest of your existing code for PLC options and organization...
//         if (data.plc && Array.isArray(data.plc)) {
//           const plcOptionsFromApi = data.plc.map((plc) => ({
//             value: plc.laborCategoryCode,
//             label: `${plc.laborCategoryCode} - ${plc.description}`,
//           }));
//           // console.log('PLC Options loaded:', plcOptionsFromApi);
//           setPlcOptions(plcOptionsFromApi);
//           setFilteredPlcOptions(plcOptionsFromApi);
//         } else {
//           // console.log('No PLC data found in API response:', data);
//           setPlcOptions([]);
//           setFilteredPlcOptions([]);
//         }

//         // Auto-populate organization for Vendor Employees if present
//         if (newEntry.idType === "Vendor" && data.orgId) {
//           setNewEntry((prev) => ({
//             ...prev,
//             orgId: data.orgId,
//           }));
//         }
//       } catch (err) {
//         console.error("Error fetching labor accounts:", err);
//         setLaborAccounts([]);
//         setPlcOptions([]);
//         setFilteredPlcOptions([]);
//         toast.error("Failed to fetch labor accounts", {
//           toastId: "labor-accounts-error",
//           autoClose: 3000,
//         });
//       }
//     };

//     if (showNewForm) {
//       fetchEmployeesSuggestions();
//       fetchLaborAccounts();
//     } else {
//       setEmployeeSuggestions([]);
//       setLaborAccounts([]);
//       setPlcOptions([]);
//       setFilteredPlcOptions([]); // ADD THIS LINE
//       setPlcSearch("");
//       setOrgSearch("");
//       setAutoPopulatedPLC(false);
//       // setEmployeeSuggestions([]);
//       // setLaborAccounts([]);
//       // setPlcSearch("");
//       // setOrgSearch("");
//       // setAutoPopulatedPLC(false);
//     }

//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
//     };
//   }, [projectId, showNewForm, newEntry.idType, planType]);

//   // Initialize filtered PLC options when PLC options change
//   useEffect(() => {
//     if (plcOptions.length > 0) {
//       setFilteredPlcOptions(plcOptions);
//       // console.log('PLC options initialized:', plcOptions.length); // DEBUG LOG
//     }
//   }, [plcOptions]);

//   // const handleEmployeeDataChange = (empIdx, field, value) => {
//   //   if (!isEditable || !isFieldEditable) return;

//   //   setEditedEmployeeData((prev) => ({
//   //     ...prev,
//   //     [empIdx]: {
//   //       ...prev[empIdx],
//   //       [field]: value,
//   //     },
//   //   }));

//   //   // ADD WARNING CHECKS FOR ACCOUNT AND ORGANIZATION
//   //   const emp = localEmployees[empIdx];
//   //   if (emp && emp.emple) {
//   //     const emplId = emp.emple.emplId;

//   //     if (field === "acctId") {
//   //       const warningKey = generateFieldWarningKey(emplId, "account", value);
//   //       const hasWarning = checkAccountInvalid(value, updateAccountOptions);

//   //       setLocalWarnings(prev => {
//   //         const updated = { ...prev };
//   //         if (hasWarning) {
//   //           updated[warningKey] = true;
//   //         } else {
//   //           // Remove warning when value becomes valid
//   //           delete updated[warningKey];
//   //         }
//   //         return updated;
//   //       });
//   //     }

//   //     if (field === "orgId") {
//   //       const warningKey = generateFieldWarningKey(emplId, "organization", value);
//   //       const hasWarning = checkOrgInvalid(value, updateOrganizationOptions);

//   //       setLocalWarnings(prev => {
//   //         const updated = { ...prev };
//   //         if (hasWarning) {
//   //           updated[warningKey] = true;
//   //         } else {
//   //           // Remove warning when value becomes valid
//   //           delete updated[warningKey];
//   //         }
//   //         return updated;
//   //       });
//   //     }
//   //   }
//   // };

//   const handleEmployeeDataChange = (empIdx, field, value) => {
//     if (!isEditable || !isFieldEditable) return;

//     setEditedEmployeeData((prev) => ({
//       ...prev,
//       [empIdx]: {
//         ...prev[empIdx],
//         [field]: value,
//       },
//     }));

//     // ADD WARNING CHECKS FOR ACCOUNT AND ORGANIZATION
//     const emp = localEmployees[empIdx];
//     if (emp && emp.emple) {
//       const emplId = emp.emple.emplId;

//       if (field === "acctId") {
//         const warningKey = generateFieldWarningKey(emplId, "account", value);
//         const hasWarning = checkAccountInvalid(value, updateAccountOptions);

//         setLocalWarnings((prev) => {
//           const updated = { ...prev };
//           if (hasWarning) {
//             updated[warningKey] = true;
//           } else {
//             delete updated[warningKey]; // ✅ ENSURE THIS IS PRESENT
//           }
//           return updated;
//         });
//       }

//       if (field === "orgId") {
//         const warningKey = generateFieldWarningKey(
//           emplId,
//           "organization",
//           value
//         );
//         const hasWarning = checkOrgInvalid(value, updateOrganizationOptions);

//         setLocalWarnings((prev) => {
//           const updated = { ...prev };
//           if (hasWarning) {
//             updated[warningKey] = true;
//           } else {
//             delete updated[warningKey]; // ✅ ENSURE THIS IS PRESENT
//           }
//           return updated;
//         });
//       }
//     }
//   };

//   const handleOrgInputChangeForUpdate = (value, actualEmpIdx) => {
//     const numericValue = value.replace(/[^0-9.]/g, "");

//     // Remove real-time validation - only validate on blur
//     handleEmployeeDataChange(actualEmpIdx, "orgId", numericValue);
//     setOrgSearch(numericValue);

//     // Clear previous timeout
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     // Always fetch filtered organizations when user types
//     if (numericValue.length >= 1) {
//       debounceTimeout.current = setTimeout(async () => {
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Orgnization/GetAllOrgs`
//           );
//           const filteredOptions = Array.isArray(response.data)
//             ? response.data
//                 .filter((org) => org.orgId.toString().startsWith(numericValue))
//                 .map((org) => ({
//                   value: org.orgId,
//                   label: org.orgId,
//                 }))
//             : [];
//           setUpdateOrganizationOptions(filteredOptions); // Use correct state variable
//         } catch (err) {
//           console.error("Failed to fetch organizations:", err);
//           setUpdateOrganizationOptions([]);
//         }
//       }, 300);
//     } else {
//       // Load all organizations when input is empty
//       debounceTimeout.current = setTimeout(async () => {
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Orgnization/GetAllOrgs`
//           );
//           const orgOptions = Array.isArray(response.data)
//             ? response.data.map((org) => ({
//                 value: org.orgId,
//                 label: org.orgId,
//               }))
//             : [];
//           setUpdateOrganizationOptions(orgOptions);
//         } catch (err) {
//           console.error("Failed to fetch organizations:", err);
//           setUpdateOrganizationOptions([]);
//         }
//       }, 300);
//     }
//   };

//   const handlePlcInputChangeForUpdate = (value, actualEmpIdx) => {
//     handleEmployeeDataChange(actualEmpIdx, "glcPlc", value);
//     setPlcSearch(value);

//     // Always filter from the original plcOptions, not updatePlcOptions
//     if (value.length >= 1) {
//       const filtered = plcOptions.filter(
//         (option) =>
//           option.value.toLowerCase().includes(value.toLowerCase()) ||
//           option.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setUpdatePlcOptions(filtered);
//     } else {
//       // Reset to all available PLC options when input is empty
//       setUpdatePlcOptions(plcOptions);
//     }
//   };

//   const handleOrgInputChange = (value) => {
//     const numericValue = value.replace(/[^0-9.]/g, "");

//     // Remove real-time validation - only validate on blur
//     setNewEntry((prev) => ({ ...prev, orgId: numericValue }));
//     setOrgSearch(numericValue);

//     // Clear previous timeout
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     // Always fetch filtered organizations when user types
//     if (numericValue.length >= 1) {
//       debounceTimeout.current = setTimeout(async () => {
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Orgnization/GetAllOrgs`
//           );
//           const filteredOptions = Array.isArray(response.data)
//             ? response.data
//                 .filter((org) => org.orgId.toString().startsWith(numericValue))
//                 .map((org) => ({
//                   value: org.orgId,
//                   label: org.orgId,
//                 }))
//             : [];
//           setOrganizationOptions(filteredOptions);
//         } catch (err) {
//           console.error("Failed to fetch organizations:", err);
//           setOrganizationOptions([]);
//         }
//       }, 300);
//     } else {
//       // Load all organizations when input is empty
//       debounceTimeout.current = setTimeout(async () => {
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Orgnization/GetAllOrgs`
//           );
//           const orgOptions = Array.isArray(response.data)
//             ? response.data.map((org) => ({
//                 value: org.orgId,
//                 label: org.orgId,
//               }))
//             : [];
//           setOrganizationOptions(orgOptions);
//         } catch (err) {
//           console.error("Failed to fetch organizations:", err);
//           setOrganizationOptions([]);
//         }
//       }, 300);
//     }
//   };

//   const handleIdTypeChange = (value) => {
//     setNewEntry((prev) => ({
//       id: "",
//       firstName: "",
//       lastName: "",
//       isRev: false,
//       isBrd: false,
//       idType: value,
//       acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//       orgId: "",
//       plcGlcCode: "",
//       perHourRate: "",
//       status: "Act",
//     }));
//     setPlcSearch("");
//     setAutoPopulatedPLC(false);
//   };

//   const handlePlcInputChange = (value) => {
//     // Remove real-time validation - only validate on blur
//     setPlcSearch(value);
//     setNewEntry((prev) => ({ ...prev, plcGlcCode: value }));

//     // Filter PLC options
//     if (value.length >= 1) {
//       const filtered = plcOptions.filter((option) =>
//         option.value.toLowerCase().startsWith(value.toLowerCase())
//       );
//       setFilteredPlcOptions(filtered);
//     } else {
//       setFilteredPlcOptions(plcOptions);
//     }

//     // Reset auto-populated flag when user manually types
//     if (autoPopulatedPLC && value !== newEntry.plcGlcCode) {
//       setAutoPopulatedPLC(false);
//     }
//   };

//   const handleAccountBlur = (val) => {
//     if (planType === "NBBUD") return; // Add this line
//     if (val && !isValidAccount(val)) {
//       toast.error("Please enter a valid Account from the available list.", {
//         autoClose: 3000,
//       });
//       setNewEntry((prev) => ({ ...prev, acctId: "" }));
//     }
//   };

//   const handleOrgBlur = (val) => {
//     if (planType === "NBBUD") return; // Add this line
//     if (!isValidOrg(val)) {
//       toast.error(
//         "Please enter a valid numeric Organization ID from the available list.",
//         { autoClose: 3000 }
//       );
//       setNewEntry((prev) => ({ ...prev, orgId: "" }));
//       setOrgSearch("");
//     }
//   };

//   const handlePlcBlur = (val) => {
//     if (planType === "NBBUD") return; // Add this line
//     if (val && !isValidPlc(val)) {
//       toast.error("Please enter a valid PLC from the available list.", {
//         autoClose: 3000,
//       });
//       if (!autoPopulatedPLC) {
//         setNewEntry((prev) => ({ ...prev, plcGlcCode: "" }));
//         setPlcSearch("");
//       }
//     }
//   };

//   const handleAccountChange = (value) => {
//     setNewEntry((prev) => ({ ...prev, acctId: value }));
//   };

//   const handleOrgChange = (value) => {
//     setNewEntry((prev) => ({ ...prev, orgId: value }));
//     setOrgSearch(value); // Add this line to track search
//   };

//   //   const handleOrgBlur = (val) => {
//   //   if (val && val.length >= 3 && !isValidOrg(val)) {
//   //     toast.error("Please enter a valid numeric Organization ID from the available list.", {
//   //       autoClose: 3000,
//   //     });
//   //     setNewEntry(prev => ({...prev, orgId: ""}));
//   //     setOrgSearch("");
//   //   }
//   // };

//   const handleIdChange = (value) => {
//     const trimmedValue = value.trim();

//     // Skip all validation and suggestions for NBBUD
//     if (planType === "NBBUD") {
//       setNewEntry((prev) => ({ ...prev, id: trimmedValue }));
//       return;
//     }

//     // 1. PLC type is always “PLC”
//     if (newEntry.idType === "PLC") {
//       setNewEntry((prev) => ({ ...prev, id: "PLC" }));
//       return;
//     }

//     // 2. Persist whatever the user typed
//     setNewEntry((prev) => ({ ...prev, id: trimmedValue }));

//     // 3. If the field is cleared, reset most fields and exit
//     if (!trimmedValue) {
//       setNewEntry((prev) => ({
//         ...prev,
//         id: "",
//         firstName: "",
//         lastName: "",
//         perHourRate: "",
//         orgId: newEntry.idType === "Vendor" ? prev.orgId : "",
//         plcGlcCode: "",
//         acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//       }));
//       setPlcSearch("");
//       setAutoPopulatedPLC(false);
//       return;
//     }

//     // 5. “Other” type needs no further validation
//     if (newEntry.idType === "Other") return;

//     // 6. For Employee / Vendor types, try to auto-populate from suggestions
//     if (
//       (newEntry.idType === "Employee" || newEntry.idType === "Vendor") &&
//       employeeSuggestions.length > 0
//     ) {
//       const selectedEmployee = employeeSuggestions.find(
//         (emp) => emp.emplId === trimmedValue
//       );

//       if (selectedEmployee) {
//         // Found a match – copy its details, *including PLC*
//         setNewEntry((prev) => ({
//           ...prev,
//           id: trimmedValue,
//           firstName: selectedEmployee.firstName || "",
//           lastName: selectedEmployee.lastName || "",
//           perHourRate: selectedEmployee.perHourRate || "",
//           orgId: selectedEmployee.orgId || prev.orgId,
//           plcGlcCode: selectedEmployee.plc || "",
//           acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//         }));
//         setPlcSearch(selectedEmployee.plc || "");
//         // setAutoPopulatedPLC(!!selectedEmployee.plc);
//       } else {
//         // No exact match – warn only if the entry is clearly invalid
//         if (trimmedValue.length >= 3) {
//           const partialMatch = employeeSuggestions.some((emp) =>
//             emp.emplId.startsWith(trimmedValue)
//           );
//           if (!partialMatch) {
//             toast.error("Invalid ID, please select a valid one!", {
//               toastId: "invalid-id",
//               autoClose: 3000,
//             });
//           }
//         }

//         // Leave any previously auto-populated PLC untouched;
//         // only clear PLC when it wasn’t auto-filled.
//         setNewEntry((prev) => ({
//           ...prev,
//           firstName: "",
//           lastName: "",
//           perHourRate: "",
//           orgId: newEntry.idType === "Vendor" ? prev.orgId : "",
//           plcGlcCode:
//             newEntry.idType === "Vendor" && autoPopulatedPLC
//               ? prev.plcGlcCode
//               : "",
//           acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
//         }));

//         if (!(newEntry.idType === "Vendor" && autoPopulatedPLC)) {
//           setPlcSearch("");
//           setAutoPopulatedPLC(false);
//         }
//       }
//     }
//   };

//   //   const getEmployeeRow = (emp, idx) => {
//   //     if (!emp || !emp.emple) {
//   //       return {
//   //         idType: "-",
//   //         emplId: "-",
//   //         name: "-",
//   //         acctId: "-",
//   //         orgId: "-",
//   //         glcPlc: "-",
//   //         isRev: "-",
//   //         isBrd: "-",
//   //         status: "-",
//   //         perHourRate: "0",
//   //         total: "0",
//   //         warning: false
//   //       };
//   //     }
//   //     const monthHours = getMonthHours(emp);
//   //     const totalHours = sortedDurations.reduce((sum, duration) => {
//   //       const uniqueKey = `${duration.monthNo}_${duration.year}`;
//   //       const inputValue = inputValues[`${idx}_${uniqueKey}`];
//   //       const forecastValue = monthHours[uniqueKey]?.value;
//   //       const value =
//   //         inputValue !== undefined && inputValue !== ""
//   //           ? inputValue
//   //           : forecastValue;
//   //       return sum + (value && !isNaN(value) ? Number(value) : 0);
//   //     }, 0);

//   //     // const warningValue = emp.isWarning || emp.emple?.isWarning || false;
//   //     // CHECK FOR ANY LOCAL WARNINGS FOR THIS EMPLOYEE
//   //   const hasLocalWarning = sortedDurations.some(duration => {
//   //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
//   //     const warningKey = `${emp.emple.emplId}_${uniqueKey}`;
//   //     return localWarnings[warningKey];
//   //   });

//   //   const warningValue = emp.isWarning || emp.emple?.isWarning || hasLocalWarning || false;

//   //     return {
//   //       idType:
//   //         ID_TYPE_OPTIONS.find(
//   //           (opt) => opt.value === (emp.emple.type || "Employee")
//   //         )?.label ||
//   //         emp.emple.type ||
//   //         "Employee",
//   //       emplId: emp.emple.emplId,
//   //       warning: Boolean(warningValue),

//   //       name:
//   //         emp.emple.idType === "Vendor"
//   //           ? emp.emple.lastName || emp.emple.firstName || "-"
//   //           : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
//   //             "-",
//   //       acctId:
//   //         emp.emple.accId ||
//   //         (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
//   //       orgId: emp.emple.orgId || "-",
//   //     //   glcPlc: emp.emple.plcGlcCode || "-",
//   //     glcPlc: (() => {
//   //   const plcCode = emp.emple.plcGlcCode || "";
//   //   if (!plcCode) return "-";

//   //   // Try to find the full description from available PLC options
//   //   const plcOption = plcOptions.find(option => option.value === plcCode) ||
//   //                    updatePlcOptions.find(option => option.value === plcCode);

//   //   return plcOption ? plcOption.label : plcCode; // Show full description if found, otherwise just code
//   // })(),

//   //       isRev: emp.emple.isRev ? (
//   //         <span className="text-green-600 font-sm text-lg">✓</span>
//   //       ) : (
//   //         "-"
//   //       ),
//   //       isBrd: emp.emple.isBrd ? (
//   //         <span className="text-green-600 font-sm text-lg">✓</span>
//   //       ) : (
//   //         "-"
//   //       ),
//   //       status: emp.emple.status || "Act",
//   //       perHourRate:
//   //         emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
//   //           ? Number(emp.emple.perHourRate).toFixed(2)
//   //           : "0",
//   //       total: totalHours.toFixed(2) || "-",
//   //     };
//   //   };

//   // const getEmployeeRow = (emp, idx) => {
//   //   if (!emp || !emp.emple) {
//   //     return {
//   //       idType: "-",
//   //       emplId: "-",
//   //       name: "-",
//   //       acctId: "-",
//   //       orgId: "-",
//   //       glcPlc: "-",
//   //       isRev: "-",
//   //       isBrd: "-",
//   //       status: "-",
//   //       perHourRate: "0",
//   //       total: "0",
//   //       warning: false,
//   //     };
//   //   }

//   //   const monthHours = getMonthHours(emp);
//   //   const totalHours = sortedDurations.reduce((sum, duration) => {
//   //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
//   //     const inputValue = inputValues[`${idx}_${uniqueKey}`];
//   //     const forecastValue = monthHours[uniqueKey]?.value;
//   //     const value =
//   //       inputValue !== undefined && inputValue !== ""
//   //         ? inputValue
//   //         : forecastValue;
//   //     return sum + (value && !isNaN(value) ? Number(value) : 0);
//   //   }, 0);

//   //   // CHECK FOR ANY LOCAL WARNINGS FOR THIS SPECIFIC EMPLOYEE + PLC COMBINATION
//   //   const plcCode = emp.emple.plcGlcCode || '';
//   //   const hasLocalWarning = sortedDurations.some(duration => {
//   //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
//   //     const warningKey = generateWarningKey(emp.emple.emplId, plcCode, uniqueKey);
//   //     return localWarnings[warningKey];
//   //   });

//   //   const warningValue = emp.isWarning || emp.emple?.isWarning || hasLocalWarning || false;

//   //   return {
//   //     idType:
//   //       ID_TYPE_OPTIONS.find(
//   //         (opt) => opt.value === (emp.emple.type || "Employee")
//   //       )?.label ||
//   //       emp.emple.type ||
//   //       "Employee",
//   //     emplId: emp.emple.emplId,
//   //     warning: Boolean(warningValue), // This will now be PLC-specific

//   //     name:
//   //       emp.emple.idType === "Vendor"
//   //         ? emp.emple.lastName || emp.emple.firstName || "-"
//   //         : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
//   //           "-",
//   //     acctId:
//   //       emp.emple.accId ||
//   //       (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
//   //     orgId: emp.emple.orgId || "-",
//   //     glcPlc: (() => {
//   //       const plcCode = emp.emple.plcGlcCode || "";
//   //       if (!plcCode) return "-";

//   //       const plcOption = plcOptions.find(option => option.value === plcCode) ||
//   //                        updatePlcOptions.find(option => option.value === plcCode);

//   //       return plcOption ? plcOption.label : plcCode;
//   //     })(),

//   //     isRev: emp.emple.isRev ? (
//   //       <span className="text-green-600 font-sm text-lg">✓</span>
//   //     ) : (
//   //       "-"
//   //     ),
//   //     isBrd: emp.emple.isBrd ? (
//   //       <span className="text-green-600 font-sm text-lg">✓</span>
//   //     ) : (
//   //       "-"
//   //     ),
//   //     status: emp.emple.status || "Act",
//   //     perHourRate:
//   //       emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
//   //         ? Number(emp.emple.perHourRate).toFixed(2)
//   //         : "0",
//   //     total: totalHours.toFixed(2) || "-",
//   //   };
//   // };

//   const getEmployeeRow = (emp, idx) => {
//     if (!emp || !emp.emple) {
//       return {
//         idType: "-",
//         emplId: "-",
//         name: "-",
//         acctId: "-",
//         orgId: "-",
//         glcPlc: "-",
//         isRev: "-",
//         isBrd: "-",
//         status: "-",
//         perHourRate: "0",
//         total: "0",
//         warning: false,
//       };
//     }

//     const monthHours = getMonthHours(emp);
//     const totalHours = sortedDurations.reduce((sum, duration) => {
//       const uniqueKey = `${duration.monthNo}_${duration.year}`;
//       const inputValue = inputValues[`${idx}_${uniqueKey}`];
//       const forecastValue = monthHours[uniqueKey]?.value;
//       const value =
//         inputValue !== undefined && inputValue !== ""
//           ? inputValue
//           : forecastValue;
//       return sum + (value && !isNaN(value) ? Number(value) : 0);
//     }, 0);

//     // CHECK FOR ANY LOCAL WARNINGS FOR THIS SPECIFIC EMPLOYEE
//     const emplId = emp.emple.emplId;
//     const plcCode = emp.emple.plcGlcCode || "";

//     // Check hours warnings (existing logic)
//     const hasHoursWarning = sortedDurations.some((duration) => {
//       const uniqueKey = `${duration.monthNo}_${duration.year}`;
//       const warningKey = generateWarningKey(emplId, plcCode, uniqueKey);
//       return localWarnings[warningKey];
//     });

//     // CHECK FOR ACCOUNT/ORG FIELD WARNINGS
//     const accountWarningKey = generateFieldWarningKey(
//       emplId,
//       "account",
//       emp.emple.accId
//     );
//     const orgWarningKey = generateFieldWarningKey(
//       emplId,
//       "organization",
//       emp.emple.orgId
//     );
//     const hasAccountWarning = localWarnings[accountWarningKey];
//     const hasOrgWarning = localWarnings[orgWarningKey];

//     // Combine all warning types
//     const warningValue =
//       emp.isWarning ||
//       emp.emple?.isWarning ||
//       hasHoursWarning ||
//       hasAccountWarning ||
//       hasOrgWarning ||
//       false;

//     return {
//       idType:
//         ID_TYPE_OPTIONS.find(
//           (opt) => opt.value === (emp.emple.type || "Employee")
//         )?.label ||
//         emp.emple.type ||
//         "Employee",
//       emplId: emp.emple.emplId,
//       warning: Boolean(warningValue), // This will now include all warning types

//       name:
//         emp.emple.idType === "Vendor"
//           ? emp.emple.lastName || emp.emple.firstName || "-"
//           : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
//             "-",
//       acctId:
//         emp.emple.accId ||
//         (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
//       orgId: emp.emple.orgId || "-",
//       glcPlc: (() => {
//         const plcCode = emp.emple.plcGlcCode || "";
//         if (!plcCode) return "-";

//         const plcOption =
//           plcOptions.find((option) => option.value === plcCode) ||
//           updatePlcOptions.find((option) => option.value === plcCode);

//         return plcOption ? plcOption.label : plcCode;
//       })(),

//       isRev: emp.emple.isRev ? (
//         <span className="text-green-600 font-sm text-lg">✓</span>
//       ) : (
//         "-"
//       ),
//       isBrd: emp.emple.isBrd ? (
//         <span className="text-green-600 font-sm text-lg">✓</span>
//       ) : (
//         "-"
//       ),
//       status: emp.emple.status || "Act",
//       perHourRate:
//         emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
//           ? Number(emp.emple.perHourRate).toFixed(2)
//           : "0",
//       total: totalHours.toFixed(2) || "-",
//     };
//   };

//   const getMonthHours = (emp) => {
//     const monthHours = {};
//     if (emp.emple && Array.isArray(emp.emple.plForecasts)) {
//       emp.emple.plForecasts.forEach((forecast) => {
//         const uniqueKey = `${forecast.month}_${forecast.year}`;
//         const value =
//           planType === "EAC" && forecast.actualhours !== undefined
//             ? forecast.actualhours
//             : forecast.forecastedhours ?? 0;
//         monthHours[uniqueKey] = { value, ...forecast };
//       });
//     }
//     return monthHours;
//   };

//   //   const handleInputChange = (empIdx, uniqueKey, newValue) => {
//   //   if (!isEditable) return;
//   //   if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
//   //     setInputValues((prev) => ({
//   //       ...prev,
//   //       [`${empIdx}_${uniqueKey}`]: newValue,
//   //     }));

//   //     // CHECK FOR WARNINGS IMMEDIATELY
//   //     const emp = localEmployees[empIdx];
//   //     if (emp && emp.emple) {
//   //       const warningKey = `${emp.emple.emplId}_${uniqueKey}`;
//   //       const hasWarning = checkHoursExceedLimit(empIdx, uniqueKey, newValue);

//   //       setLocalWarnings(prev => ({
//   //         ...prev,
//   //         [warningKey]: hasWarning
//   //       }));
//   //     }
//   //   }
//   // };

//   const handleInputChange = (empIdx, uniqueKey, newValue) => {
//     if (!isEditable) return;
//     if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
//       setInputValues((prev) => ({
//         ...prev,
//         [`${empIdx}_${uniqueKey}`]: newValue,
//       }));

//       // CHECK FOR WARNINGS IMMEDIATELY WITH PLC-SPECIFIC KEY
//       const emp = localEmployees[empIdx];
//       if (emp && emp.emple) {
//         const plcCode = emp.emple.plcGlcCode || "";
//         const warningKey = generateWarningKey(
//           emp.emple.emplId,
//           plcCode,
//           uniqueKey
//         );
//         const hasWarning = checkHoursExceedLimit(empIdx, uniqueKey, newValue);

//         setLocalWarnings((prev) => {
//           const updated = { ...prev };
//           if (hasWarning) {
//             updated[warningKey] = true;
//           } else {
//             delete updated[warningKey]; // ✅ ADD THIS LINE
//           }
//           return updated;
//         });
//       }
//     }
//   };

//   const handleEmployeeDataBlur = async (empIdx, emp) => {
//     if (!isEditable || !isBudPlan) return;
//     const editedData = editedEmployeeData[empIdx] || {};
//     const originalData = getEmployeeRow(emp, empIdx);
//     if (
//       !editedData ||
//       ((editedData.acctId === undefined ||
//         editedData.acctId === originalData.acctId) &&
//         (editedData.orgId === undefined ||
//           editedData.orgId === originalData.orgId) &&
//         (editedData.glcPlc === undefined ||
//           editedData.glcPlc === originalData.glcPlc) &&
//         (editedData.perHourRate === undefined ||
//           editedData.perHourRate === originalData.perHourRate) &&
//         (editedData.isRev === undefined ||
//           editedData.isRev === emp.emple.isRev) &&
//         (editedData.isBrd === undefined ||
//           editedData.isBrd === emp.emple.isBrd))
//     ) {
//       return;
//     }
//     const payload = {
//       id: emp.emple.id || 0,
//       emplId: emp.emple.emplId,
//       firstName: emp.emple.firstName || "",
//       lastName: emp.emple.lastName || "",
//       type: emp.emple.type || "Employee",
//       isRev:
//         editedData.isRev !== undefined ? editedData.isRev : emp.emple.isRev,
//       isBrd:
//         editedData.isBrd !== undefined ? editedData.isBrd : emp.emple.isBrd,
//       plcGlcCode: (editedData.glcPlc || emp.emple.plcGlcCode || "")
//         .split("-")[0]
//         .substring(0, 20),
//       perHourRate: Number(editedData.perHourRate || emp.emple.perHourRate || 0),
//       status: emp.emple.status || "Act",
//       accId:
//         editedData.acctId ||
//         emp.emple.accId ||
//         (laborAccounts.length > 0 ? laborAccounts[0].id : ""),
//       orgId: editedData.orgId || emp.emple.orgId || "",
//       plId: planId,
//       plForecasts: emp.emple.plForecasts || [],
//     };

//     try {
//       await axios.put(`${backendUrl}/Employee/UpdateEmployee`, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
//       setEditedEmployeeData((prev) => {
//         const newData = { ...prev };
//         delete newData[empIdx];
//         return newData;
//       });
//       setLocalEmployees((prev) => {
//         const updated = [...prev];
//         updated[empIdx] = {
//           ...updated[empIdx],
//           emple: {
//             ...updated[empIdx].emple,
//             ...payload,
//           },
//         };
//         return updated;
//       });

//       toast.success("Employee updated successfully!", {
//         toastId: `employee-update-${empIdx}`,
//         autoClose: 2000,
//       });
//     } catch (err) {
//       console.error("Failed to update employee:", err);
//     }
//   };

//   const handleForecastHoursBlur = async (empIdx, uniqueKey, value) => {
//     if (!isEditable) return;
//     const newValue = value === "" ? 0 : Number(value);
//     const emp = localEmployees[empIdx];
//     const monthHours = getMonthHours(emp);
//     const forecast = monthHours[uniqueKey];

//     // Check if forecast exists and has required data
//     if (!forecast || !forecast.forecastid) {
//       console.warn(
//         "No forecast data found for this employee/month combination"
//       );
//       return;
//     }

//     const originalForecastedHours = forecast?.forecastedhours ?? 0;

//     if (newValue === originalForecastedHours) {
//       return;
//     }

//     const currentDuration = sortedDurations.find(
//       (d) => `${d.monthNo}_${d.year}` === uniqueKey
//     );

//     if (!isMonthEditable(currentDuration, closedPeriod, planType)) {
//       setInputValues((prev) => ({
//         ...prev,
//         [`${empIdx}_${uniqueKey}`]: String(originalForecastedHours),
//       }));
//       toast.warn("Cannot edit hours for a closed period.", {
//         toastId: "closed-period-warning",
//         autoClose: 3000,
//       });
//       return;
//     }

//     // Create payload with safe fallbacks
//     const payload = {
//       forecastedamt: forecast?.forecastedamt ?? 0,
//       forecastid: Number(forecast?.forecastid ?? 0),
//       projId: forecast?.projId ?? projectId ?? "",
//       plId: forecast?.plId ?? planId ?? 0,
//       emplId: forecast?.emplId ?? emp?.emple?.emplId ?? "",
//       dctId: forecast?.dctId ?? 0,
//       month: forecast?.month ?? currentDuration?.monthNo ?? 0,
//       year: forecast?.year ?? currentDuration?.year ?? 0,
//       totalBurdenCost: forecast?.totalBurdenCost ?? 0,
//       burden: forecast?.burden ?? 0,
//       ccffRevenue: forecast?.ccffRevenue ?? 0,
//       tnmRevenue: forecast?.tnmRevenue ?? 0,
//       cost: forecast?.cost ?? 0,
//       fringe: forecast?.fringe ?? 0,
//       overhead: forecast?.overhead ?? 0,
//       gna: forecast?.gna ?? 0,
//       ...(planType === "EAC"
//         ? { actualhours: Number(newValue) || 0 }
//         : { forecastedhours: Number(newValue) || 0 }),
//       createdat: forecast?.createdat ?? new Date().toISOString(),
//       updatedat: new Date().toISOString().split("T")[0],
//       displayText: forecast?.displayText ?? "",
//     };

//     try {
//       // **KEY CHANGE**: Handle NBBUD by sending "BUD" as the plan type parameter
//       const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

//       // console.log('Forecast update payload:', payload); // DEBUG LOG
//       // console.log('API Plan Type being sent:', apiPlanType); // DEBUG LOG
//       // console.log('Original Plan Type:', planType); // DEBUG LOG

//       await axios.put(
//         `${backendUrl}/Forecast/UpdateForecastHours/${apiPlanType}`,
//         payload,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // Update local state to reflect the change
//       setLocalEmployees((prev) => {
//         const updated = [...prev];
//         if (
//           updated[empIdx] &&
//           updated[empIdx].emple &&
//           updated[empIdx].emple.plForecasts
//         ) {
//           const forecastIndex = updated[empIdx].emple.plForecasts.findIndex(
//             (f) => f.month === payload.month && f.year === payload.year
//           );
//           if (forecastIndex !== -1) {
//             if (planType === "EAC") {
//               updated[empIdx].emple.plForecasts[forecastIndex].actualhours =
//                 newValue;
//             } else {
//               updated[empIdx].emple.plForecasts[forecastIndex].forecastedhours =
//                 newValue;
//             }
//           }
//         }
//         return updated;
//       });

//       toast.success("Employee updated successfully!", {
//         toastId: `employee-update-${empIdx}`,
//         autoClose: 2000,
//       });
//     } catch (err) {
//       // Reset the input value on error
//       setInputValues((prev) => ({
//         ...prev,
//         [`${empIdx}_${uniqueKey}`]: String(originalForecastedHours),
//       }));

//       console.error("Update forecast error:", err);
//       console.error(
//         "Failed API Plan Type:",
//         planType === "NBBUD" ? "BUD" : planType
//       ); // DEBUG LOG

//       toast.error(
//         "Failed to update forecast: " +
//           (err.response?.data?.message || err.message),
//         {
//           toastId: "forecast-update-error",
//           autoClose: 3000,
//         }
//       );
//     }
//   };

//   const handleAccountInputChangeForUpdate = (value, actualEmpIdx) => {
//     handleEmployeeDataChange(actualEmpIdx, "acctId", value);

//     // Filter accounts based on input - ensure we're using all available accounts
//     if (value.length >= 1) {
//       const baseAccounts =
//         updateAccountOptions.length > 0 ? updateAccountOptions : laborAccounts;
//       const filtered = baseAccounts.filter((acc) =>
//         acc.id.toLowerCase().includes(value.toLowerCase())
//       );
//       // Don't update the state here, just use the filtered results for display
//       // The datalist will automatically show filtered options
//     } else {
//       // When input is empty, ensure all accounts are available
//       if (updateAccountOptions.length === 0 && laborAccounts.length > 0) {
//         setUpdateAccountOptions(laborAccounts);
//       }
//     }
//   };

//   const handleFillValues = async () => {
//     if (!showNewForm || !isEditable) return;

//     if (new Date(fillEndDate) < new Date(fillStartDate)) {
//       toast.error("End Period cannot be before Start Period.");
//       return;
//     }

//     const startDateObj = new Date(fillStartDate);
//     const endDateObj = new Date(fillEndDate);

//     const newHours = {};

//     const isDurationInRange = (duration) => {
//       const durationValue = duration.year * 100 + duration.monthNo;
//       const startYear = startDateObj.getFullYear();
//       const startMonth = startDateObj.getMonth() + 1;
//       const startValue = startYear * 100 + startMonth;
//       const endYear = endDateObj.getFullYear();
//       const endMonth = endDateObj.getMonth() + 1;
//       const endValue = endYear * 100 + endMonth;
//       return durationValue >= startValue && durationValue <= endValue;
//     };

//     if (fillMethod === "Copy From Source Record" && sourceRowIndex !== null) {
//       const sourceEmp = localEmployees[sourceRowIndex];
//       const sourceMonthHours = getMonthHours(sourceEmp);
//       sortedDurations.forEach((duration) => {
//         if (!isDurationInRange(duration)) return;
//         const uniqueKey = `${duration.monthNo}_${duration.year}`;
//         if (
//           planType === "EAC" &&
//           !isMonthEditable(duration, closedPeriod, planType)
//         ) {
//           newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
//         } else {
//           newHours[uniqueKey] = sourceMonthHours[uniqueKey]?.value || "0";
//         }
//       });
//     } else if (fillMethod === "Specify Hours") {
//       sortedDurations.forEach((duration) => {
//         if (!isDurationInRange(duration)) return;
//         const uniqueKey = `${duration.monthNo}_${duration.year}`;
//         if (
//           planType === "EAC" &&
//           !isMonthEditable(duration, closedPeriod, planType)
//         ) {
//           newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
//         } else if (isMonthEditable(duration, closedPeriod, planType)) {
//           newHours[uniqueKey] = fillHours.toString();
//         }
//       });
//     } else if (fillMethod === "Use Available Hours") {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startDate}/${endDate}`
//         );
//         const availableHours = response.data.reduce((acc, d) => {
//           const uniqueKey = `${d.monthNo}_${d.year}`;
//           acc[uniqueKey] = d.workingHours || 0;
//           return acc;
//         }, {});
//         sortedDurations.forEach((duration) => {
//           if (!isDurationInRange(duration)) return;
//           const uniqueKey = `${duration.monthNo}_${duration.year}`;
//           if (
//             planType === "EAC" &&
//             !isMonthEditable(duration, closedPeriod, planType)
//           ) {
//             newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
//           } else if (isMonthEditable(duration, closedPeriod, planType)) {
//             newHours[uniqueKey] = availableHours[uniqueKey] || "0";
//           }
//         });
//       } catch (err) {
//         toast.error("Failed to fetch available hours.", {
//           toastId: "available-hours-error",
//           autoClose: 3000,
//         });
//         return;
//       }
//     } else if (
//       fillMethod === "Use Start Period Hours" &&
//       sortedDurations.length > 0
//     ) {
//       const firstDuration = sortedDurations[0];
//       if (!isDurationInRange(firstDuration)) {
//         toast.error(
//           "Start Period hours are outside the selected duration range."
//         );
//         return;
//       }
//       const firstUniqueKey = `${firstDuration.monthNo}_${firstDuration.year}`;
//       const firstValue = newEntryPeriodHours[firstUniqueKey] || "0";
//       sortedDurations.forEach((duration) => {
//         if (!isDurationInRange(duration)) return;
//         const uniqueKey = `${duration.monthNo}_${duration.year}`;
//         if (
//           planType === "EAC" &&
//           !isMonthEditable(duration, closedPeriod, planType)
//         ) {
//           newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
//         } else if (isMonthEditable(duration, closedPeriod, planType)) {
//           newHours[uniqueKey] = firstValue;
//         }
//       });
//     }

//     setNewEntryPeriodHours((prev) => ({ ...prev, ...newHours }));
//     setShowFillValues(false);
//     setFillMethod("None");
//     setFillHours(0.0);
//     setSourceRowIndex(null);
//   };

//   //   const handleSaveNewEntry = async () => {
//   //     if (!planId) {
//   //       toast.error("Plan ID is required to save a new entry.", {
//   //         autoClose: 3000,
//   //       });
//   //       return;
//   //     }

//   //     // Check for duplicate employee ID before validating anything else
//   //     // const isDuplicate = localEmployees.some(
//   //     //   (emp) => emp.emple && emp.emple.emplId === newEntry.id.trim()
//   //     // );
//   //     // if (isDuplicate) {
//   //     //   toast.error(
//   //     //     "Can't save entry with existing ID. Please use a different ID.",
//   //     //     {
//   //     //       toastId: "duplicate-save-error",
//   //     //       autoClose: 3000,
//   //     //     }
//   //     //   );
//   //     //   return;
//   //     // }

//   //     const isDuplicate = localEmployees.some(
//   //   (emp) => emp.emple &&
//   //     emp.emple.emplId === newEntry.id.trim() &&
//   //     emp.emple.plcGlcCode === newEntry.plcGlcCode.trim()
//   // );
//   // if (isDuplicate) {
//   //   toast.error(
//   //     "Can't save entry with existing ID and PLC combination. Please use a different ID or PLC.",
//   //     {
//   //       toastId: "duplicate-save-error",
//   //       autoClose: 3000,
//   //     }
//   //   );
//   //   return;
//   // }

//   //     if (newEntry.idType === "PLC") {
//   //       if (!newEntry.id || newEntry.id !== "PLC") {
//   //         toast.error("ID must be automatically set to 'PLC' for PLC type.", {
//   //           autoClose: 3000,
//   //         });
//   //         return;
//   //       }
//   //     } else if (newEntry.idType === "Other") {
//   //       // For Other type, just check that it's not empty (no further validation)
//   //       if (!newEntry.id.trim()) {
//   //         toast.error("ID is required.", { autoClose: 3000 });
//   //         return;
//   //       }
//   //     } else if (newEntry.idType === "Employee" || newEntry.idType === "Vendor") {
//   //       if (!newEntry.id.trim()) {
//   //         toast.error("ID is required.", { autoClose: 3000 });
//   //         return;
//   //       }
//   //       // Only validate against suggestions if we have them
//   //       if (employeeSuggestions.length > 0) {
//   //         const validEmployee = employeeSuggestions.find(
//   //           (emp) => emp.emplId === newEntry.id.trim()
//   //         );
//   //         if (!validEmployee) {
//   //           toast.error("Please enter a valid ID from the available list.", {
//   //             autoClose: 3000,
//   //           });
//   //           return;
//   //         }
//   //       }
//   //     }

//   //     if (!isValidAccount(newEntry.acctId)) {
//   //       toast.error("Please enter a valid Account from the available list.", {
//   //         autoClose: 3000,
//   //       });
//   //       return;
//   //     }
//   //     if (!isValidOrg(newEntry.orgId)) {
//   //       toast.error("Organization is required.", { autoClose: 3000 });
//   //       return;
//   //     }
//   //     if (!isValidPlc(newEntry.plcGlcCode)) {
//   //       toast.error("Please enter a valid Plc from the available list.", {
//   //         autoClose: 3000,
//   //       });
//   //       return;
//   //     }

//   //     setIsDurationLoading(true);
//   //     const payloadForecasts = durations.map((duration) => ({
//   //       forecastedhours:
//   //         Number(newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]) ||
//   //         0,
//   //       projId: projectId,
//   //       plId: planId,
//   //       emplId: newEntry.id,
//   //       month: duration.monthNo,
//   //       year: duration.year,
//   //       acctId: newEntry.acctId,
//   //       orgId: newEntry.orgId,
//   //       plc: newEntry.plcGlcCode || "",
//   //       hrlyRate: Number(newEntry.perHourRate) || 0,
//   //       effectDt: null,
//   //       plEmployee: null,
//   //     }));
//   //     const payload = {
//   //       id: 0,
//   //       emplId: newEntry.id,
//   //       firstName: newEntry.firstName,
//   //       lastName: newEntry.lastName,
//   //       type: newEntry.idType,
//   //       isRev: newEntry.isRev,
//   //       isBrd: newEntry.isBrd,
//   //       plcGlcCode: (newEntry.plcGlcCode || "").substring(0, 20),
//   //       perHourRate: Number(newEntry.perHourRate) || 0,
//   //       status: newEntry.status || "Act",
//   //       accId: newEntry.acctId,
//   //       orgId: newEntry.orgId || "",
//   //       plId: planId,
//   //       plForecasts: payloadForecasts,
//   //     };
//   //     try {
//   //       await axios.post(
//   //         "${backendUrl}/Employee/AddNewEmployee",
//   //         payload
//   //       );
//   //       setSuccessMessageText("Entry saved successfully!");
//   //       setShowSuccessMessage(true);
//   //       setShowNewForm(false);
//   //       setNewEntry({
//   //         id: "",
//   //         firstName: "",
//   //         lastName: "",
//   //         isRev: false,
//   //         isBrd: false,
//   //         idType: "",
//   //         acctId: "",
//   //         orgId: "",
//   //         plcGlcCode: "",
//   //         perHourRate: "",
//   //         status: "Act",
//   //       });
//   //       setNewEntryPeriodHours({});
//   //       setEmployeeSuggestions([]);
//   //       setLaborAccounts([]);
//   //       setPlcOptions([]);
//   //       setPlcSearch("");
//   //       setAutoPopulatedPLC(false);
//   //       if (onSaveSuccess) {
//   //         onSaveSuccess();
//   //       }
//   //       fetchEmployees();
//   //     } catch (err) {
//   //   setSuccessMessageText("Failed to save entry.");
//   //   setShowSuccessMessage(true);

//   //   // Simple error extraction
//   //   let errorMessage = "Failed to save new entry: ";

//   //   if (err?.response?.data?.error) {
//   //     errorMessage += err.response.data.error;
//   //   } else if (err?.response?.data?.message) {
//   //     errorMessage += err.response.data.message;
//   //   } else if (err?.message) {
//   //     errorMessage += err.message;
//   //   } else {
//   //     errorMessage += "Unknown error occurred";
//   //   }

//   //   toast.error(errorMessage, {
//   //     toastId: "save-entry-error",
//   //     autoClose: 5000,
//   //   });

//   //   // Optional: Log for debugging
//   //   console.error("API Error:", err?.response?.data || err);
//   // } finally {
//   //   setIsDurationLoading(false);
//   //   setTimeout(() => setShowSuccessMessage(false), 2000);
//   // }
//   //   };

//   const handleSaveNewEntry = async () => {
//     if (!planId) {
//       toast.error("Plan ID is required to save a new entry.", {
//         autoClose: 3000,
//       });
//       return;
//     }

//     // Skip all validations if planType is NBBUD
//     if (planType !== "NBBUD") {
//       // Check for duplicate employee ID before validating anything else
//       const isDuplicate = localEmployees.some(
//         (emp) =>
//           emp.emple &&
//           emp.emple.emplId === newEntry.id.trim() &&
//           emp.emple.plcGlcCode === newEntry.plcGlcCode.trim()
//       );
//       if (isDuplicate) {
//         toast.error(
//           "Can't save entry with existing ID and PLC combination. Please use a different ID or PLC.",
//           {
//             toastId: "duplicate-save-error",
//             autoClose: 3000,
//           }
//         );
//         return;
//       }

//       if (newEntry.idType === "PLC") {
//         if (!newEntry.id || newEntry.id !== "PLC") {
//           toast.error("ID must be automatically set to 'PLC' for PLC type.", {
//             autoClose: 3000,
//           });
//           return;
//         }
//       } else if (newEntry.idType === "Other") {
//         // For Other type, just check that it's not empty (no further validation)
//         if (!newEntry.id.trim()) {
//           toast.error("ID is required.", { autoClose: 3000 });
//           return;
//         }
//       } else if (
//         newEntry.idType === "Employee" ||
//         newEntry.idType === "Vendor"
//       ) {
//         if (!newEntry.id.trim()) {
//           toast.error("ID is required.", { autoClose: 3000 });
//           return;
//         }
//         // Only validate against suggestions if we have them
//         if (employeeSuggestions.length > 0) {
//           const validEmployee = employeeSuggestions.find(
//             (emp) => emp.emplId === newEntry.id.trim()
//           );
//           if (!validEmployee) {
//             toast.error("Please enter a valid ID from the available list.", {
//               autoClose: 3000,
//             });
//             return;
//           }
//         }
//       }

//       if (!isValidAccount(newEntry.acctId)) {
//         toast.error("Please enter a valid Account from the available list.", {
//           autoClose: 3000,
//         });
//         return;
//       }
//       if (!isValidOrg(newEntry.orgId)) {
//         toast.error("Organization is required.", { autoClose: 3000 });
//         return;
//       }
//       if (!isValidPlc(newEntry.plcGlcCode)) {
//         toast.error("Please enter a valid Plc from the available list.", {
//           autoClose: 3000,
//         });
//         return;
//       }
//     }

//     setIsDurationLoading(true);
//     const payloadForecasts = durations.map((duration) => ({
//       // forecastedhours:
//       //   Number(newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]) ||
//       //   0,
//       ...(planType === "EAC"
//         ? {
//             actualhours:
//               Number(
//                 newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]
//               ) || 0,
//           }
//         : {
//             forecastedhours:
//               Number(
//                 newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]
//               ) || 0,
//           }),
//       projId: projectId,
//       plId: planId,
//       emplId: newEntry.id,
//       month: duration.monthNo,
//       year: duration.year,
//       acctId: newEntry.acctId,
//       orgId: newEntry.orgId,
//       plc: newEntry.plcGlcCode || "",
//       hrlyRate: Number(newEntry.perHourRate) || 0,
//       effectDt: null,
//       plEmployee: null,
//     }));

//     const payload = {
//       id: 0,
//       emplId: newEntry.id,
//       firstName: newEntry.firstName,
//       lastName: newEntry.lastName,
//       type: newEntry.idType,
//       isRev: newEntry.isRev,
//       isBrd: newEntry.isBrd,
//       plcGlcCode: (newEntry.plcGlcCode || "").substring(0, 20),
//       perHourRate: Number(newEntry.perHourRate) || 0,
//       status: newEntry.status || "Act",
//       accId: newEntry.acctId,
//       orgId: newEntry.orgId || "",
//       plId: planId,
//       plForecasts: payloadForecasts,
//     };

//     try {
//       await axios.post(`${backendUrl}/Employee/AddNewEmployee`, payload);
//       setSuccessMessageText("Entry saved successfully!");
//       setShowSuccessMessage(true);
//       setShowNewForm(false);
//       setNewEntry({
//         id: "",
//         firstName: "",
//         lastName: "",
//         isRev: false,
//         isBrd: false,
//         idType: "",
//         acctId: "",
//         orgId: "",
//         plcGlcCode: "",
//         perHourRate: "",
//         status: "Act",
//       });
//       setNewEntryPeriodHours({});
//       setEmployeeSuggestions([]);
//       setLaborAccounts([]);
//       setPlcOptions([]);
//       setPlcSearch("");
//       setAutoPopulatedPLC(false);
//       if (onSaveSuccess) {
//         onSaveSuccess();
//       }
//       fetchEmployees();
//     } catch (err) {
//       setSuccessMessageText("Failed to save entry.");
//       setShowSuccessMessage(true);

//       // Simple error extraction
//       let errorMessage = "Failed to save new entry: ";

//       if (err?.response?.data?.error) {
//         errorMessage += err.response.data.error;
//       } else if (err?.response?.data?.message) {
//         errorMessage += err.response.data.message;
//       } else if (err?.message) {
//         errorMessage += err.message;
//       } else {
//         errorMessage += "Unknown error occurred";
//       }

//       toast.error(errorMessage, {
//         toastId: "save-entry-error",
//         autoClose: 5000,
//       });

//       // Optional: Log for debugging
//       console.error("API Error:", err?.response?.data || err);
//     } finally {
//       setIsDurationLoading(false);
//       setTimeout(() => setShowSuccessMessage(false), 2000);
//     }
//   };

//   const handleFindReplace = async () => {
//     if (
//       !isEditable ||
//       findValue === "" ||
//       (replaceScope === "row" && selectedRowIndex === null) ||
//       (replaceScope === "column" && selectedColumnKey === null)
//     ) {
//       toast.warn("Please select a valid scope and enter a value to find.", {
//         toastId: "find-replace-warning",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setIsLoading(true);

//     const updates = [];
//     const updatedInputValues = { ...inputValues };
//     let replacementsCount = 0;
//     let skippedCount = 0;

//     for (const empIdx in localEmployees) {
//       const emp = localEmployees[empIdx];
//       const actualEmpIdx = parseInt(empIdx, 10);

//       if (replaceScope === "row" && actualEmpIdx !== selectedRowIndex) {
//         continue;
//       }

//       for (const duration of sortedDurations) {
//         const uniqueKey = `${duration.monthNo}_${duration.year}`;

//         if (replaceScope === "column" && uniqueKey !== selectedColumnKey) {
//           continue;
//         }

//         if (!isMonthEditable(duration, closedPeriod, planType)) {
//           continue;
//         }

//         const currentInputKey = `${actualEmpIdx}_${uniqueKey}`;
//         let displayedValue;
//         if (inputValues[currentInputKey] !== undefined) {
//           displayedValue = String(inputValues[currentInputKey]);
//         } else {
//           const monthHours = getMonthHours(emp);
//           const forecast = monthHours[uniqueKey];
//           if (forecast && forecast.value !== undefined) {
//             displayedValue = String(forecast.value);
//           } else {
//             displayedValue = "0";
//           }
//         }

//         const findValueTrimmed = findValue.trim();
//         const displayedValueTrimmed = displayedValue.trim();

//         function isZeroLike(val) {
//           if (val === undefined || val === null) return true;
//           if (typeof val === "number") return val === 0;
//           if (typeof val === "string") {
//             const trimmed = val.trim();
//             return (
//               trimmed === "" ||
//               trimmed === "0" ||
//               trimmed === "0.0" ||
//               trimmed === "0.00" ||
//               (!isNaN(Number(trimmed)) && Number(trimmed) === 0)
//             );
//           }
//           return false;
//         }

//         let isMatch = false;
//         if (
//           !isNaN(Number(findValueTrimmed)) &&
//           Number(findValueTrimmed) === 0
//         ) {
//           isMatch = isZeroLike(displayedValueTrimmed);
//         } else {
//           isMatch = displayedValueTrimmed === findValueTrimmed;
//           if (!isMatch) {
//             const findNum = parseFloat(findValueTrimmed);
//             const displayNum = parseFloat(displayedValueTrimmed);
//             if (!isNaN(findNum) && !isNaN(displayNum)) {
//               isMatch = findNum === displayNum;
//             }
//           }
//         }

//         if (isMatch) {
//           const newValue = replaceValue.trim();
//           const newNumericValue =
//             newValue === "" ? 0 : parseFloat(newValue) || 0;
//           const forecast = getMonthHours(emp)[uniqueKey];

//           if (forecast && forecast.forecastid) {
//             if (displayedValueTrimmed !== newValue) {
//               updatedInputValues[currentInputKey] = newValue;
//               replacementsCount++;
//               const payload = {
//                 forecastedamt: forecast.forecastedamt ?? 0,
//                 forecastid: Number(forecast.forecastid),
//                 projId: forecast.projId,
//                 plId: forecast.plId,
//                 emplId: forecast.emplId,
//                 dctId: forecast.dctId ?? 0,
//                 month: forecast.month,
//                 year: forecast.year,
//                 totalBurdenCost: forecast.totalBurdenCost ?? 0,
//                 burden: forecast.burden ?? 0,
//                 ccffRevenue: forecast.ccffRevenue ?? 0,
//                 tnmRevenue: forecast.tnmRevenue ?? 0,
//                 cost: forecast.cost ?? 0,
//                 fringe: forecast.fringe ?? 0,
//                 overhead: forecast.overhead ?? 0,
//                 gna: forecast.gna ?? 0,
//                 [planType === "EAC" ? "actualhours" : "forecastedhours"]:
//                   newNumericValue,
//                 updatedat: new Date().toISOString().split("T")[0],
//                 displayText: forecast.displayText ?? "",
//               };

//               const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

//               updates.push(
//                 axios
//                   .put(
//                     `${backendUrl}/Forecast/UpdateForecastHours/${apiPlanType}`,
//                     payload,
//                     { headers: { "Content-Type": "application/json" } }
//                   )
//                   .catch((err) => {
//                     console.error(
//                       "Failed update for payload:",
//                       payload,
//                       err?.response?.data || err.message
//                     );
//                   })
//               );
//             }
//           } else {
//             // console.log(
//             //   `Skipping cell without forecast: employee ${emp.emple?.emplId} for ${duration.monthNo}/${duration.year}`
//             // );
//             skippedCount++;
//           }
//         }
//       }
//     }

//     // console.log(
//     //   `Total replacements to make: ${replacementsCount}, Skipped: ${skippedCount}`
//     // );

//     setInputValues(updatedInputValues);
//     try {
//       if (updates.length > 0) {
//         await Promise.all(updates);
//       }
//       setLocalEmployees((prev) => {
//         const updated = [...prev];
//         for (const empIdx in updated) {
//           const emp = updated[empIdx];
//           for (const duration of sortedDurations) {
//             const uniqueKey = `${duration.monthNo}_${duration.year}`;
//             const currentInputKey = `${empIdx}_${uniqueKey}`;
//             if (updatedInputValues[currentInputKey] !== undefined) {
//               if (emp.emple && Array.isArray(emp.emple.plForecasts)) {
//                 const forecast = emp.emple.plForecasts.find(
//                   (f) =>
//                     f.month === duration.monthNo && f.year === duration.year
//                 );
//                 if (forecast) {
//                   const newValue =
//                     parseFloat(updatedInputValues[currentInputKey]) || 0;
//                   if (planType === "EAC") {
//                     forecast.actualhours = newValue;
//                   } else {
//                     forecast.forecastedhours = newValue;
//                   }
//                 }
//               }
//             }
//           }
//         }
//         return updated;
//       });

//       if (replacementsCount > 0) {
//         toast.success(`Successfully replaced ${replacementsCount} cells.`, {
//           autoClose: 2000,
//         });
//       }

//       if (replacementsCount === 0 && skippedCount === 0) {
//         toast.info("No cells replaced.", { autoClose: 2000 });
//       }
//     } catch (err) {
//       toast.error(
//         "Failed to replace values: " +
//           (err.response?.data?.message || err.message),
//         {
//           toastId: "replace-error",
//           autoClose: 3000,
//         }
//       );
//     } finally {
//       setIsLoading(false);
//       setShowFindReplace(false);
//       setFindValue("");
//       setReplaceValue("");
//       setSelectedRowIndex(null);
//       setSelectedColumnKey(null);
//       setReplaceScope("all");
//     }
//   };

//   const handleRowClick = (actualEmpIdx) => {
//     if (!isEditable) return;
//     setSelectedRowIndex(
//       actualEmpIdx === selectedRowIndex ? null : actualEmpIdx
//     );
//     setSelectedEmployeeId(localEmployees[actualEmpIdx]?.emple_Id);
//     setSelectedColumnKey(null);
//     setReplaceScope(actualEmpIdx === selectedRowIndex ? "all" : "row");
//     if (showNewForm) setSourceRowIndex(actualEmpIdx);
//   };

//   // handle delete employee here
//   const handleDeleteEmployee = async (emple_Id) => {
//     if (!emple_Id) return;

//     try {
//       await axios.delete(`${backendUrl}/Employee/DeleteEmployee/${emple_Id}`);

//       toast.success("Employee deleted successfully!");

//       // Remove deleted employee from local state
//       setLocalEmployees((prev) =>
//         prev.filter((emp) => emp.emple_Id !== emple_Id)
//       );
//     } catch (err) {
//       toast.error(
//         "Failed to delete employee: " +
//           (err.response?.data?.message || err.message)
//       );
//     }
//   };

//   const handleColumnHeaderClick = (uniqueKey) => {
//     if (!isEditable) return;
//     setSelectedColumnKey(uniqueKey === selectedColumnKey ? null : uniqueKey);
//     setSelectedRowIndex(null);
//     setReplaceScope(uniqueKey === selectedColumnKey ? "all" : "column");
//   };

//   const hasHiddenRows = Object.values(hiddenRows).some(Boolean);
//   const showHiddenRows = () => setHiddenRows({});

//   const sortedDurations = [...durations]
//     .filter((d) => fiscalYear === "All" || d.year === parseInt(fiscalYear))
//     .sort(
//       (a, b) =>
//         new Date(a.year, a.monthNo - 1, 1) - new Date(b.year, b.monthNo - 1, 1)
//     );

//   const handleWarningClick = (e, emplId) => {
//     e.stopPropagation(); // Prevent row click event
//     setSelectedEmployeeIdForWarning(emplId);
//     setShowWarningPopup(true);
//   };

//   const checkHoursExceedLimit = (empIdx, uniqueKey, hours) => {
//     const duration = sortedDurations.find(
//       (d) => `${d.monthNo}_${d.year}` === uniqueKey
//     );
//     if (!duration || !duration.workingHours) return false;

//     const numericHours = parseFloat(hours) || 0;
//     return numericHours > duration.workingHours;
//   };

//   const generateWarningKey = (emplId, plcCode, uniqueKey) => {
//     return `${emplId}_${plcCode || "NOPLC"}_${uniqueKey}`;
//   };

//   const generateFieldWarningKey = (emplId, field, value) => {
//     return `${emplId}_${field}_${value || "empty"}`;
//   };

//   const checkAccountInvalid = (value, updateOptions) => {
//     if (planType === "NBBUD") return false; // No warnings for NBBUD
//     if (!value || value.trim() === "") return true; // Empty is invalid
//     return !updateOptions.some((opt) => opt.id === value.trim());
//   };

//   const checkOrgInvalid = (value, updateOptions) => {
//     if (planType === "NBBUD") return false; // No warnings for NBBUD
//     if (!value || value.trim() === "") return true; // Empty is invalid
//     const trimmed = value.toString().trim();
//     if (!/^[\d.]+$/.test(trimmed)) return true; // Not numeric
//     return !updateOptions.some((opt) => opt.value.toString() === trimmed);
//   };

//   if (isLoading || isDurationLoading) {
//     return (
//       <div className="p-4 font-inter flex justify-center items-center">
//         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-xs text-gray-600">
//           Loading forecast data...
//         </span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 font-inter">
//         <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded">
//           <strong className="font-bold text-xs">Error: </strong>
//           <span className="block sm:inline text-xs">{error}</span>
//         </div>
//       </div>
//     );
//   }

//   const rowCount = Math.max(
//     localEmployees.filter((_, idx) => !hiddenRows[idx]).length +
//       (showNewForm ? 1 : 0),
//     2
//   );

//   return (
//     <div className="relative p-4 font-inter w-full synchronized-tables-outer">
//       {showSuccessMessage && (
//         <div
//           className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
//             successMessageText.includes("successfully") ||
//             successMessageText.includes("Replaced")
//               ? "bg-green-500"
//               : "bg-red-500"
//           } text-white text-xs`}
//         >
//           {successMessageText}
//         </div>
//       )}

//       <div className="w-full flex justify-between mb-4 gap-2">
//         <div className="flex-grow"></div>
//         <div className="flex gap-2 ">
//           {hasHiddenRows && (
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
//               onClick={showHiddenRows}
//             >
//               Show Hidden Rows
//             </button>
//           )}
//           {isEditable && (
//             <>
//               {/* <button
//                 onClick={() => setShowNewForm((prev) => !prev)}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
//               >
//                 {showNewForm ? "Cancel" : "New"}
//               </button> */}
//               <button
//                 onClick={() => {
//                   if (showNewForm) {
//                     // Reset all form fields when canceling
//                     setNewEntry({
//                       id: "",
//                       firstName: "",
//                       lastName: "",
//                       isRev: false,
//                       isBrd: false,
//                       idType: "",
//                       acctId: "",
//                       orgId: "",
//                       plcGlcCode: "",
//                       perHourRate: "",
//                       status: "Act",
//                     });
//                     setNewEntryPeriodHours({});
//                     setEmployeeSuggestions([]);
//                     setLaborAccounts([]);
//                     setPlcOptions([]);
//                     setFilteredPlcOptions([]);
//                     setPlcSearch("");
//                     setOrgSearch("");
//                     setAutoPopulatedPLC(false);
//                     setShowNewForm(false);
//                   } else {
//                     setShowNewForm(true);
//                   }
//                 }}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
//               >
//                 {showNewForm ? "Cancel" : "New"}
//               </button>

//               {!showNewForm && (
//                 <>
//                   <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
//                     onClick={() => isEditable && setShowFindReplace(true)}
//                   >
//                     Find / Replace
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium"
//                     onClick={() => {
//                       if (!selectedEmployeeId) {
//                         toast.error("Please select an employee to delete");
//                         return;
//                       }
//                       if (
//                         window.confirm(
//                           "Are you sure you want to delete this employee?"
//                         )
//                       ) {
//                         handleDeleteEmployee(selectedEmployeeId);
//                         setSelectedEmployeeId(null); // optional: clear selection
//                       }
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}
//               {showNewForm && (
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
//                   onClick={() => isEditable && setShowFillValues(true)}
//                 >
//                   Fill Values
//                 </button>
//               )}
//             </>
//           )}

//           {showNewForm && (
//             <button
//               onClick={handleSaveNewEntry}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
//             >
//               Save Entry
//             </button>
//           )}
//         </div>
//       </div>

//       {showFillValues && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-sm">
//             <h3 className="text-lg font-semibold mb-4">
//               Fill Values to selected record/s
//             </h3>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-xs font-medium mb-1">
//                 Select Fill Method
//               </label>
//               <select
//                 value={fillMethod}
//                 onChange={(e) => setFillMethod(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 text-xs"
//               >
//                 <option value="None">None</option>
//                 <option value="Copy From Source Record">
//                   Copy from source record
//                 </option>
//                 <option value="Specify Hours">Specify Hours</option>
//                 <option value="Use Available Hours">Use Available Hours</option>
//                 <option value="Use Start Period Hours">
//                   Use Start Period Hours
//                 </option>
//               </select>
//             </div>
//             {fillMethod === "Specify Hours" && (
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-xs font-medium mb-1">
//                   Hours
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={fillHours}
//                   onChange={(e) =>
//                     setFillHours(parseFloat(e.target.value) || 0)
//                   }
//                   onKeyDown={(e) => {
//                     if (
//                       e.key === "Backspace" &&
//                       (e.target.value === "0" || e.target.value === "")
//                     ) {
//                       e.preventDefault();
//                       setFillHours("");
//                     }
//                   }}
//                   className="w-full border border-gray-300 rounded-md p-2 text-xs"
//                   placeholder="0.00"
//                 />
//               </div>
//             )}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-xs font-medium mb-1">
//                 Start Period
//               </label>
//               <input
//                 type="date"
//                 value={fillStartDate}
//                 onChange={(e) => setFillStartDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 text-xs"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-xs font-medium mb-1">
//                 End Period
//               </label>
//               <input
//                 type="date"
//                 value={fillEndDate}
//                 onChange={(e) => setFillEndDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 text-xs"
//               />
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowFillValues(false);
//                   setFillMethod("None");
//                   setFillHours(0.0);
//                   setSourceRowIndex(null);
//                 }}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-xs"
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 onClick={handleFillValues}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
//               >
//                 Fill
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {localEmployees.length === 0 &&
//       !showNewForm &&
//       sortedDurations.length > 0 ? (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-xs">
//           No forecast data available for this plan.
//         </div>
//       ) : (
         
// //           <div className="synchronized-tables-container flex">
// //             <div className="synchronized-table-scroll first">
// //               <table className="table-fixed text-xs text-left min-w-max border border-gray-300 rounded-lg">
// //                 <thead className="sticky-thead">
// //                   <tr
// //                     style={{
// //                       height: `${ROW_HEIGHT_DEFAULT}px`,
// //                       lineHeight: "normal",
// //                     }}
// //                   >
// //                     {EMPLOYEE_COLUMNS.map((col) => (
// //                       <th
// //                         key={col.key}
// //                         className="p-1.5 border border-gray-200 whitespace-nowrap text-xs text-gray-900 font-normal min-w-[70px]"
// //                       >
// //                         {col.label}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {showNewForm && (
// //                     <tr
// //                       key="new-entry"
// //                       className="bg-gray-50"
// //                       style={{
// //                         height: `${ROW_HEIGHT_DEFAULT}px`,
// //                         lineHeight: "normal",
// //                       }}
// //                     >
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <select
// //                           name="idType"
// //                           value={newEntry.idType || ""}
// //                           onChange={(e) => handleIdTypeChange(e.target.value)}
// //                           className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                         >
// //                           {ID_TYPE_OPTIONS.map((opt) => (
// //                             <option key={opt.value} value={opt.value}>
// //                               {opt.label}
// //                             </option>
// //                           ))}
// //                         </select>
// //                       </td>
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="id"
// //                           value={newEntry.id}
// //                           onChange={(e) => handleIdChange(e.target.value)}
// //                           disabled={newEntry.idType === "PLC"}
// //                           className={`w-full rounded px-1 py-0.5 text-xs outline-none focus:ring-0 no-datalist-border ${
// //                             newEntry.idType === "PLC"
// //                               ? "bg-gray-100 cursor-not-allowed"
// //                               : ""
// //                           }`}
// //                           list={
// //                             planType === "NBBUD"
// //                               ? undefined
// //                               : "employee-id-list"
// //                           }
// //                           placeholder={
// //                             newEntry.idType === "PLC"
// //                               ? "Not required for PLC"
// //                               : "Enter ID"
// //                           }
// //                         />
// //                         {/* <datalist id="employee-id-list">
// //                           {employeeSuggestions
// //                             .filter(
// //                               (emp) =>
// //                                 emp.emplId && typeof emp.emplId === "string"
// //                             )
// //                             .map((emp, index) => (
// //                               <option
// //                                 key={`${emp.emplId}-${index}`}
// //                                 value={emp.emplId}
// //                               >
// //                                 {emp.lastName && emp.firstName
// //                                   ? `${emp.lastName}, ${emp.firstName}`
// //                                   : emp.lastName || emp.firstName || emp.emplId}
// //                               </option>
// //                             ))}
// //                         </datalist> */}
// //                         <datalist id="employee-id-list">
// //                           {newEntry.idType !== "Other" &&
// //                             employeeSuggestions
// //                               .filter(
// //                                 (emp) =>
// //                                   emp.emplId && typeof emp.emplId === "string"
// //                               )
// //                               .map((emp, index) => (
// //                                 <option
// //                                   key={`${emp.emplId}-${index}`}
// //                                   value={emp.emplId}
// //                                 >
// //                                   {emp.lastName && emp.firstName
// //                                     ? `${emp.lastName}, ${emp.firstName}`
// //                                     : emp.lastName ||
// //                                       emp.firstName ||
// //                                       emp.emplId}
// //                                 </option>
// //                               ))}
// //                         </datalist>
// //                       </td>

// //                       <td className="border border-gray-300 px-1.5 py-0.5 text-center">
// //                         <span className="text-gray-400 text-xs">-</span>
// //                       </td>
// //                       {/* <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="name"
// //                           value={
// //                             newEntry.idType === "Vendor"
// //                               ? newEntry.lastName || newEntry.firstName || ""
// //                               : newEntry.lastName && newEntry.firstName
// //                               ? `${newEntry.lastName}, ${newEntry.firstName}`
// //                               : newEntry.lastName || newEntry.firstName || ""
// //                           }
// //                           readOnly
// //                           className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs bg-gray-100 cursor-not-allowed"
// //                           placeholder="Name (auto-filled)"
// //                         />
// //                       </td> */}
// //                       {/* <td className="border border-gray-300 px-1.5 py-0.5">
// //   <input
// //     type="text"
// //     name="name"
// //     value={
// //       newEntry.idType === "Other" || planType === "NBBUD"
// //         ? `${newEntry.firstName || ""} ${newEntry.lastName || ""}`.trim()
// //         : newEntry.idType === "Vendor"
// //         ? newEntry.lastName || newEntry.firstName || ""
// //         : newEntry.lastName && newEntry.firstName
// //         ? `${newEntry.lastName}, ${newEntry.firstName}`
// //         : newEntry.lastName || newEntry.firstName || ""
// //     }
// //     readOnly={planType !== "NBBUD" && newEntry.idType !== "Other"}
// //     onChange={(e) => {
// //       if (newEntry.idType === "Other" || planType === "NBBUD") {
// //         const fullName = e.target.value.trim();
// //         // Split name into first and last (assuming format: "First Last")
// //         const nameParts = fullName.split(" ");
// //         const firstName = nameParts[0] || "";
// //         const lastName = nameParts.slice(1).join(" ") || "";
        
// //         setNewEntry(prev => ({
// //           ...prev,
// //           firstName: firstName,
// //           lastName: lastName
// //         }));
// //       }
// //     }}
// //     className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //       newEntry.idType === "Other"  || planType === "NBBUD"
// //         ? "bg-white" 
// //         : "bg-gray-100 cursor-not-allowed"
// //     }`}
// //     placeholder={
// //       newEntry.idType === "Other" || planType === "NBBUD" 
// //         ? "Enter name" 
// //         : "Name (auto-filled)"
// //     }
// //   />
// // </td> */}
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         {newEntry.idType === "PLC" ? (
// //                           // PLC Name field - automatically show selected PLC description
// //                           <input
// //                             type="text"
// //                             name="name"
// //                             value={newEntry.firstName || ""} // This will contain the PLC description
// //                             readOnly
// //                             className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs bg-gray-100 cursor-not-allowed"
// //                             // placeholder="PLC description will appear here"
// //                           />
// //                         ) : (
// //                           // Existing logic for other ID types
// //                           <input
// //                             type="text"
// //                             name="name"
// //                             value={
// //                               newEntry.idType === "Other" ||
// //                               planType === "NBBUD"
// //                                 ? `${newEntry.firstName || ""} ${
// //                                     newEntry.lastName || ""
// //                                   }`.trim()
// //                                 : newEntry.idType === "Vendor"
// //                                 ? newEntry.lastName || newEntry.firstName || ""
// //                                 : newEntry.lastName && newEntry.firstName
// //                                 ? `${newEntry.lastName}, ${newEntry.firstName}`
// //                                 : newEntry.lastName || newEntry.firstName || ""
// //                             }
// //                             readOnly={
// //                               planType !== "NBBUD" &&
// //                               newEntry.idType !== "Other"
// //                             }
// //                             onChange={(e) => {
// //                               if (
// //                                 newEntry.idType === "Other" ||
// //                                 planType === "NBBUD"
// //                               ) {
// //                                 const fullName = e.target.value.trim();
// //                                 const nameParts = fullName.split(" ");
// //                                 const firstName = nameParts[0] || "";
// //                                 const lastName =
// //                                   nameParts.slice(1).join(" ") || "";

// //                                 setNewEntry((prev) => ({
// //                                   ...prev,
// //                                   firstName: firstName,
// //                                   lastName: lastName,
// //                                 }));
// //                               }
// //                             }}
// //                             className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                               newEntry.idType === "Other" ||
// //                               planType === "NBBUD"
// //                                 ? "bg-white"
// //                                 : "bg-gray-100 cursor-not-allowed"
// //                             }`}
// //                             placeholder={
// //                               newEntry.idType === "Other" ||
// //                               planType === "NBBUD"
// //                                 ? "Enter name"
// //                                 : "Name (auto-filled)"
// //                             }
// //                           />
// //                         )}
// //                       </td>

// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="acctId"
// //                           value={newEntry.acctId}
// //                           onChange={(e) => handleAccountChange(e.target.value)}
// //                           onBlur={(e) => handleAccountBlur(e.target.value)}
// //                           className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                             !isFieldEditable
// //                               ? "bg-gray-100 cursor-not-allowed"
// //                               : ""
// //                           }`}
// //                           list="account-list"
// //                           placeholder="Enter Account"
// //                           //   disabled={!isBudPlan}
// //                           disabled={!isFieldEditable}
// //                         />
// //                         <datalist id="account-list">
// //                           {laborAccounts.map((account, index) => (
// //                             <option
// //                               key={`${account.id}-${index}`}
// //                               value={account.id}
// //                             >
// //                               {account.id}
// //                             </option>
// //                           ))}
// //                         </datalist>
// //                       </td>
// //                       {/* <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="orgId"
// //                           value={newEntry.orgId}
// //                           onChange={(e) => handleOrgChange(e.target.value)}
// //                           onBlur={(e) => handleOrgBlur(e.target.value)}
// //                           className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                             !isBudPlan ? "bg-gray-100 cursor-not-allowed" : ""
// //                           }`}
// //                           placeholder="Enter Organization"
// //                           disabled={!isBudPlan}
// //                         />
// //                       </td> */}
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="orgId"
// //                           value={newEntry.orgId}
// //                           onChange={(e) => handleOrgInputChange(e.target.value)}
// //                           onBlur={(e) => handleOrgBlur(e.target.value)}
// //                           className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                             !isFieldEditable
// //                               ? "bg-gray-100 cursor-not-allowed"
// //                               : ""
// //                           }`}
// //                           list="organization-list"
// //                           placeholder="Enter Organization ID (numeric)"
// //                           // disabled={!isBudPlan}
// //                           disabled={!isFieldEditable}
// //                         />
// //                         <datalist id="organization-list">
// //                           {organizationOptions.map((org, index) => (
// //                             <option
// //                               key={`${org.value}-${index}`}
// //                               value={org.value}
// //                             >
// //                               {org.label}
// //                             </option>
// //                           ))}
// //                         </datalist>
// //                       </td>

// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="plcGlcCode"
// //                           value={newEntry.plcGlcCode}
// //                           onChange={(e) => {
// //                             if (newEntry.idType === "PLC") {
// //                               // For PLC type, auto-populate the name field with PLC description
// //                               const selectedPlc = plcOptions.find(
// //                                 (plc) => plc.value === e.target.value
// //                               );
// //                               handlePlcInputChange(e.target.value);

// //                               // Automatically set the firstName to the full PLC description
// //                               if (selectedPlc) {
// //                                 const description =
// //                                   selectedPlc.label.split(" - ")[1] ||
// //                                   selectedPlc.label;

// //                                 setNewEntry((prev) => ({
// //                                   ...prev,
// //                                   firstName: description, // Store full description in firstName
// //                                   lastName: "", // Clear lastName for PLC
// //                                 }));
// //                               }
// //                             } else {
// //                               handlePlcInputChange(e.target.value);
// //                             }
// //                           }}
// //                           onBlur={(e) => handlePlcBlur(e.target.value)}
// //                           className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                             autoPopulatedPLC
// //                               ? "bg-gray-100 cursor-not-allowed"
// //                               : ""
// //                           }`}
// //                           list="plc-list"
// //                           placeholder="Enter Plc"
// //                         />
// //                         <datalist id="plc-list">
// //                           {filteredPlcOptions.map((plc, index) => (
// //                             <option
// //                               key={`${plc.value}-${index}`}
// //                               value={plc.value}
// //                             >
// //                               {plc.label}
// //                             </option>
// //                           ))}
// //                         </datalist>
// //                       </td>

// //                       <td className="border border-gray-300 px-1.5 py-0.5 text-center">
// //                         <input
// //                           type="checkbox"
// //                           name="isRev"
// //                           checked={newEntry.isRev}
// //                           //   onChange={(e) =>
// //                           //     isBudPlan &&
// //                           //     setNewEntry({
// //                           //       ...newEntry,
// //                           //       isRev: e.target.checked,
// //                           //     })
// //                           //   }
// //                           // CHANGE TO:
// //                           onChange={(e) =>
// //                             isFieldEditable &&
// //                             setNewEntry({
// //                               ...newEntry,
// //                               isRev: e.target.checked,
// //                             })
// //                           }
// //                           disabled={!isFieldEditable}
// //                         />
// //                       </td>
// //                       <td className="border border-gray-300 px-1.5 py-0.5 text-center">
// //                         <input
// //                           type="checkbox"
// //                           name="isBrd"
// //                           checked={newEntry.isBrd}
// //                           //   onChange={(e) =>
// //                           //     isBudPlan &&
// //                           //     setNewEntry({
// //                           //       ...newEntry,
// //                           //       isBrd: e.target.checked,
// //                           //     })
// //                           //   }
// //                           //   className="w-4 h-4"
// //                           //   disabled={!isBudPlan}
// //                           // CHANGE TO:
// //                           onChange={(e) =>
// //                             isFieldEditable &&
// //                             setNewEntry({
// //                               ...newEntry,
// //                               isBrd: e.target.checked,
// //                             })
// //                           }
// //                           disabled={!isFieldEditable}
// //                         />
// //                       </td>
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="status"
// //                           value={newEntry.status}
// //                           onChange={(e) =>
// //                             setNewEntry({ ...newEntry, status: e.target.value })
// //                           }
// //                           className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                           placeholder="Enter Status"
// //                         />
// //                       </td>
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         <input
// //                           type="text"
// //                           name="perHourRate"
// //                           value={newEntry.perHourRate}
// //                           //   onChange={(e) =>
// //                           //     isBudPlan &&
// //                           //     setNewEntry({
// //                           //       ...newEntry,
// //                           //       perHourRate: e.target.value.replace(
// //                           //         /[^0-9.]/g,
// //                           //         ""
// //                           //       ),
// //                           //     })
// //                           //   }
// //                           //   className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                           //     !isBudPlan ? "bg-gray-100 cursor-not-allowed" : ""
// //                           //   }`}
// //                           //   placeholder="Enter Hour Rate"
// //                           //   disabled={!isBudPlan}
// //                           // CHANGE TO:
// //                           onChange={(e) =>
// //                             isFieldEditable &&
// //                             setNewEntry({
// //                               ...newEntry,
// //                               perHourRate: e.target.value.replace(
// //                                 /[^0-9.]/g,
// //                                 ""
// //                               ),
// //                             })
// //                           }
// //                           className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
// //                             !isFieldEditable
// //                               ? "bg-gray-100 cursor-not-allowed"
// //                               : ""
// //                           }`}
// //                           disabled={!isFieldEditable}
// //                         />
// //                       </td>
// //                       <td className="border border-gray-300 px-1.5 py-0.5">
// //                         {Object.values(newEntryPeriodHours)
// //                           .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
// //                           .toFixed(2)}
// //                       </td>
// //                     </tr>
// //                   )}
// //                   {localEmployees
// //                     .filter((_, idx) => !hiddenRows[idx])
// //                     .map((emp, idx) => {
// //                       const actualEmpIdx = localEmployees.findIndex(
// //                         (e) => e === emp
// //                       );
// //                       const row = getEmployeeRow(emp, actualEmpIdx);
// //                       const editedData = editedEmployeeData[actualEmpIdx] || {};
// //                       return (
// //                         <tr
// //                           key={`employee-${actualEmpIdx}`}
// //                           className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
// //                             selectedRowIndex === actualEmpIdx
// //                               ? "bg-yellow-100"
// //                               : "even:bg-gray-50"
// //                           }`}
// //                           style={{
// //                             height: `${ROW_HEIGHT_DEFAULT}px`,
// //                             lineHeight: "normal",
// //                             cursor: isEditable ? "pointer" : "default",
// //                           }}
// //                           onClick={() => handleRowClick(actualEmpIdx)}
// //                         >
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {row.idType}
// //                           </td>
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {row.emplId}
// //                           </td>
// //                           {/* ADD THIS WARNING CELL */}
// //                           {/* <td className="p-1.5 border-r border-gray-200 text-xs text-center min-w-[70px]">
// //   {row.warning ? (
// //     <span className="text-yellow-500 text-lg" title="Warning">
// //       ⚠️
// //     </span>
// //   ) : (
// //     <span className="text-gray-300 text-xs">-</span>
// //   )}
// // </td> */}
// //                           {/* UPDATE THIS WARNING CELL */}
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-center min-w-[70px]">
// //                             {row.warning ? (
// //                               <span
// //                                 className="text-yellow-500 text-lg cursor-pointer hover:text-yellow-600"
// //                                 title="Click to view warnings"
// //                                 onClick={(e) =>
// //                                   handleWarningClick(e, row.emplId)
// //                                 }
// //                               >
// //                                 ⚠️
// //                               </span>
// //                             ) : (
// //                               <span className="text-gray-300 text-xs">-</span>
// //                             )}
// //                           </td>

// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {row.name}
// //                           </td>

// //                           {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //   {isBudPlan && isEditable ? (
// //     <input
// //       type="text"
// //       value={
// //         editedData.acctId !== undefined
// //           ? editedData.acctId
// //           : row.acctId
// //       }
// //       onChange={(e) => handleAccountInputChangeForUpdate(e.target.value, actualEmpIdx)}
// //       onBlur={() => handleEmployeeDataBlur(actualEmpIdx, emp)}
// //       className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //       list={`account-list-${actualEmpIdx}`}
// //       placeholder="Enter Account"
// //     />
// //   ) : (
// //     row.acctId
// //   )}
// //   <datalist id={`account-list-${actualEmpIdx}`}>
// //     {updateAccountOptions.map((account, index) => (
// //       <option
// //         key={`${account.id}-${index}`}
// //         value={account.id}
// //       >
// //         {account.id}
// //       </option>
// //     ))}
// //   </datalist>
// // </td> */}

// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isFieldEditable && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.acctId !== undefined
// //                                     ? editedData.acctId
// //                                     : row.acctId
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleAccountInputChangeForUpdate(
// //                                     e.target.value,
// //                                     actualEmpIdx
// //                                   )
// //                                 }
// //                                 onBlur={(e) => {
// //                                   if (planType === "NBBUD") return; // Add this line
// //                                   const val = e.target.value;
// //                                   const originalValue = row.acctId;

// //                                   if (
// //                                     val !== originalValue &&
// //                                     !isValidAccountForUpdate(
// //                                       val,
// //                                       updateAccountOptions
// //                                     )
// //                                   ) {
// //                                     toast.error(
// //                                       "Please enter a valid Account from the available list.",
// //                                       {
// //                                         autoClose: 3000,
// //                                       }
// //                                     );
// //                                   } else {
// //                                     handleEmployeeDataBlur(actualEmpIdx, emp);
// //                                   }
// //                                 }}
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                                 list={`account-list-${actualEmpIdx}`}
// //                                 placeholder="Enter Account"
// //                               />
// //                             ) : (
// //                               row.acctId
// //                             )}
// //                             <datalist id={`account-list-${actualEmpIdx}`}>
// //                               {updateAccountOptions.map((account, index) => (
// //                                 <option
// //                                   key={`${account.id}-${index}`}
// //                                   value={account.id}
// //                                 >
// //                                   {account.id}
// //                                 </option>
// //                               ))}
// //                             </datalist>
// //                           </td>

// //                           {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isBudPlan && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.acctId !== undefined
// //                                     ? editedData.acctId
// //                                     : row.acctId
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleEmployeeDataChange(
// //                                     actualEmpIdx,
// //                                     "acctId",
// //                                     e.target.value
// //                                   )
// //                                 }
// //                                 onBlur={() =>
// //                                   handleEmployeeDataBlur(actualEmpIdx, emp)
// //                                 }
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                                 list="account-list"
// //                               />
// //                             ) : (
// //                               row.acctId
// //                             )}
// //                           </td> */}

// //                           {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isBudPlan && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.orgId !== undefined
// //                                     ? editedData.orgId
// //                                     : row.orgId
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleEmployeeDataChange(
// //                                     actualEmpIdx,
// //                                     "orgId",
// //                                     e.target.value
// //                                   )
// //                                 }
// //                                 onBlur={() =>
// //                                   handleEmployeeDataBlur(actualEmpIdx, emp)
// //                                 }
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                               />
// //                             ) : (
// //                               row.orgId
// //                             )}
// //                           </td> */}
// //                           {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //   {isBudPlan && isEditable ? (
// //     <input
// //       type="text"
// //       value={
// //         editedData.orgId !== undefined
// //           ? editedData.orgId
// //           : row.orgId
// //       }
// //       onChange={(e) => handleOrgInputChangeForUpdate(e.target.value, actualEmpIdx)}
// //       onBlur={(e) => {
// //         const val = e.target.value;
// //         if (val && val.length >= 3 && !isValidOrg(val)) {
// //           toast.error("Please enter a valid numeric Organization ID from the available list.", {
// //             autoClose: 3000,
// //           });
// //           handleEmployeeDataChange(actualEmpIdx, "orgId", "");
// //         } else {
// //           handleEmployeeDataBlur(actualEmpIdx, emp);
// //         }
// //       }}
// //       className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //       list="organization-list"
// //       placeholder="Enter Organization ID"
// //     />
// //   ) : (
// //     row.orgId
// //   )}
// // </td> */}

// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isBudPlan && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.orgId !== undefined
// //                                     ? editedData.orgId
// //                                     : row.orgId
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleOrgInputChangeForUpdate(
// //                                     e.target.value,
// //                                     actualEmpIdx
// //                                   )
// //                                 }
// //                                 //   onBlur={(e) => {
// //                                 //     const val = e.target.value;
// //                                 //     if (val && !isValidOrg(val)) {
// //                                 //       toast.error("Please enter a valid numeric Organization ID from the available list.", {
// //                                 //         autoClose: 3000,
// //                                 //       });
// //                                 //       // Don't clear the value automatically - let user fix it
// //                                 //     } else {
// //                                 //       handleEmployeeDataBlur(actualEmpIdx, emp);
// //                                 //     }
// //                                 //   }}
// //                                 onBlur={(e) => {
// //                                   if (planType === "NBBUD") return; // Add this line
// //                                   const val = e.target.value;
// //                                   const originalValue = row.orgId;

// //                                   if (
// //                                     val !== originalValue &&
// //                                     val &&
// //                                     !isValidOrgForUpdate(
// //                                       val,
// //                                       updateOrganizationOptions
// //                                     )
// //                                   ) {
// //                                     toast.error(
// //                                       "Please enter a valid numeric Organization ID from the available list.",
// //                                       {
// //                                         autoClose: 3000,
// //                                       }
// //                                     );
// //                                   } else {
// //                                     handleEmployeeDataBlur(actualEmpIdx, emp);
// //                                   }
// //                                 }}
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                                 list={`organization-list-${actualEmpIdx}`}
// //                                 placeholder="Enter Organization ID"
// //                               />
// //                             ) : (
// //                               row.orgId
// //                             )}
// //                             <datalist id={`organization-list-${actualEmpIdx}`}>
// //                               {updateOrganizationOptions.map((org, index) => (
// //                                 <option
// //                                   key={`${org.value}-${index}`}
// //                                   value={org.value}
// //                                 >
// //                                   {org.label}
// //                                 </option>
// //                               ))}
// //                             </datalist>
// //                           </td>

// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isBudPlan && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.glcPlc !== undefined
// //                                     ? editedData.glcPlc
// //                                     : row.glcPlc
// //                                 }
// //                                 onChange={(e) =>
// //                                   handlePlcInputChangeForUpdate(
// //                                     e.target.value,
// //                                     actualEmpIdx
// //                                   )
// //                                 }
// //                                 onBlur={(e) => {
// //                                   if (planType === "NBBUD") return; // Add this line
// //                                   const val = e.target.value;
// //                                   const originalValue = row.glcPlc;

// //                                   if (
// //                                     val !== originalValue &&
// //                                     val &&
// //                                     !isValidPlcForUpdate(val, updatePlcOptions)
// //                                   ) {
// //                                     toast.error(
// //                                       "Please enter a valid PLC from the available list.",
// //                                       {
// //                                         autoClose: 3000,
// //                                       }
// //                                     );
// //                                   } else {
// //                                     handleEmployeeDataBlur(actualEmpIdx, emp);
// //                                   }
// //                                 }}
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                                 list={`plc-list-${actualEmpIdx}`}
// //                                 placeholder="Enter PLC"
// //                               />
// //                             ) : (
// //                               row.glcPlc
// //                             )}
// //                             <datalist id={`plc-list-${actualEmpIdx}`}>
// //                               {/* Use updatePlcOptions if available, otherwise fallback to plcOptions */}
// //                               {(updatePlcOptions.length > 0
// //                                 ? updatePlcOptions
// //                                 : plcOptions
// //                               ).map((plc, index) => (
// //                                 <option
// //                                   key={`${plc.value}-${index}`}
// //                                   value={plc.value}
// //                                 >
// //                                   {plc.label}
// //                                 </option>
// //                               ))}
// //                             </datalist>
// //                           </td>

// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
// //                             {isFieldEditable && isEditable ? (
// //                               <input
// //                                 type="checkbox"
// //                                 checked={
// //                                   editedData.isRev !== undefined
// //                                     ? editedData.isRev
// //                                     : emp.emple.isRev
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleEmployeeDataChange(
// //                                     actualEmpIdx,
// //                                     "isRev",
// //                                     e.target.checked
// //                                   )
// //                                 }
// //                                 onBlur={() =>
// //                                   handleEmployeeDataBlur(actualEmpIdx, emp)
// //                                 }
// //                                 className="w-4 h-4"
// //                               />
// //                             ) : (
// //                               row.isRev
// //                             )}
// //                           </td>
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
// //                             {isFieldEditable && isEditable ? (
// //                               <input
// //                                 type="checkbox"
// //                                 checked={
// //                                   editedData.isBrd !== undefined
// //                                     ? editedData.isBrd
// //                                     : emp.emple.isBrd
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleEmployeeDataChange(
// //                                     actualEmpIdx,
// //                                     "isBrd",
// //                                     e.target.checked
// //                                   )
// //                                 }
// //                                 onBlur={() =>
// //                                   handleEmployeeDataBlur(actualEmpIdx, emp)
// //                                 }
// //                                 className="w-4 h-4"
// //                               />
// //                             ) : (
// //                               row.isBrd
// //                             )}
// //                           </td>
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {row.status}
// //                           </td>
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {isFieldEditable && isEditable ? (
// //                               <input
// //                                 type="text"
// //                                 value={
// //                                   editedData.perHourRate !== undefined
// //                                     ? editedData.perHourRate
// //                                     : row.perHourRate
// //                                 }
// //                                 onChange={(e) =>
// //                                   handleEmployeeDataChange(
// //                                     actualEmpIdx,
// //                                     "perHourRate",
// //                                     e.target.value.replace(/[^0-9.]/g, "")
// //                                   )
// //                                 }
// //                                 onBlur={() =>
// //                                   handleEmployeeDataBlur(actualEmpIdx, emp)
// //                                 }
// //                                 className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
// //                               />
// //                             ) : (
// //                               row.perHourRate
// //                             )}
// //                           </td>
// //                           <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
// //                             {row.total}
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                 </tbody>
// //               </table>
// //             </div>
// //             <div className="synchronized-table-scroll last">
// //               <table className="min-w-full text-xs text-center border-collapse border border-gray-300 rounded-lg">
// //                 <thead className="sticky-thead">
// //                   <tr
// //                     style={{
// //                       height: `${ROW_HEIGHT_DEFAULT}px`,
// //                       lineHeight: "normal",
// //                     }}
// //                   >
// //                     {sortedDurations.map((duration) => {
// //                       const uniqueKey = `${duration.monthNo}_${duration.year}`;
// //                       return (
// //                         <th
// //                           key={uniqueKey}
// //                           className={`px-2 py-1.5 border border-gray-200 text-center min-w-[80px] text-xs text-gray-900 font-normal ${
// //                             selectedColumnKey === uniqueKey
// //                               ? "bg-yellow-100"
// //                               : ""
// //                           }`}
// //                           style={{ cursor: isEditable ? "pointer" : "default" }}
// //                           onClick={() => handleColumnHeaderClick(uniqueKey)}
// //                         >
// //                           <div className="flex flex-col items-center justify-center h-full">
// //                             <span className="whitespace-nowrap text-xs text-gray-900 font-normal">
// //                               {duration.month}
// //                             </span>
// //                             <span className="text-xs text-gray-600 font-normal">
// //                               {duration.workingHours || 0} hrs
// //                             </span>
// //                           </div>
// //                         </th>
// //                       );
// //                     })}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {showNewForm && (
// //                     <tr
// //                       key="new-entry"
// //                       className="bg-gray-50"
// //                       style={{
// //                         height: `${ROW_HEIGHT_DEFAULT}px`,
// //                         lineHeight: "normal",
// //                       }}
// //                     >
// //                       {sortedDurations.map((duration) => {
// //                         const uniqueKey = `${duration.monthNo}_${duration.year}`;
// //                         const isInputEditable =
// //                           isEditable &&
// //                           isMonthEditable(duration, closedPeriod, planType);
// //                         return (
// //                           <td
// //                             key={`new-${uniqueKey}`}
// //                             className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
// //                               planType === "EAC"
// //                                 ? isInputEditable
// //                                   ? "bg-green-50"
// //                                   : "bg-gray-200"
// //                                 : ""
// //                             }`}
// //                           >
// //                             <input
// //                               type="text"
// //                               inputMode="numeric"
// //                               value={newEntryPeriodHours[uniqueKey] ?? "0"}
// //                               onChange={(e) =>
// //                                 isInputEditable &&
// //                                 setNewEntryPeriodHours((prev) => ({
// //                                   ...prev,
// //                                   [uniqueKey]: e.target.value.replace(
// //                                     /[^0-9.]/g,
// //                                     ""
// //                                   ),
// //                                 }))
// //                               }
// //                               className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
// //                                 !isInputEditable
// //                                   ? "cursor-not-allowed text-gray-400"
// //                                   : "text-gray-700"
// //                               }`}
// //                               disabled={!isInputEditable}
// //                               placeholder="Enter Hours"
// //                             />
// //                           </td>
// //                         );
// //                       })}
// //                     </tr>
// //                   )}
// //                   {localEmployees
// //                     .filter((_, idx) => !hiddenRows[idx])
// //                     .map((emp, idx) => {
// //                       const actualEmpIdx = localEmployees.findIndex(
// //                         (e) => e === emp
// //                       );
// //                       const monthHours = getMonthHours(emp);
// //                       return (
// //                         <tr
// //                           key={`hours-${actualEmpIdx}`}
// //                           className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
// //                             selectedRowIndex === actualEmpIdx
// //                               ? "bg-yellow-100"
// //                               : "even:bg-gray-50"
// //                           }`}
// //                           style={{
// //                             height: `${ROW_HEIGHT_DEFAULT}px`,
// //                             lineHeight: "normal",
// //                             cursor: isEditable ? "pointer" : "default",
// //                           }}
// //                           onClick={() => handleRowClick(actualEmpIdx)}
// //                         >
// //                           {sortedDurations.map((duration) => {
// //                             const uniqueKey = `${duration.monthNo}_${duration.year}`;
// //                             const forecast = monthHours[uniqueKey];
// //                             const value =
// //                               inputValues[`${actualEmpIdx}_${uniqueKey}`] ??
// //                               (forecast?.value !== undefined
// //                                 ? forecast.value
// //                                 : "0");
// //                             const isInputEditable =
// //                               isEditable &&
// //                               isMonthEditable(duration, closedPeriod, planType);
// //                             return (
// //                               <td
// //                                 key={`hours-${actualEmpIdx}-${uniqueKey}`}
// //                                 className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
// //                                   selectedColumnKey === uniqueKey
// //                                     ? "bg-yellow-100"
// //                                     : ""
// //                                 } ${
// //                                   planType === "EAC"
// //                                     ? isInputEditable
// //                                       ? "bg-green-50"
// //                                       : "bg-gray-200"
// //                                     : ""
// //                                 }`}
// //                               >
// //                                 <input
// //                                   type="text"
// //                                   inputMode="numeric"
// //                                   className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
// //                                     !isInputEditable
// //                                       ? "cursor-not-allowed text-gray-400"
// //                                       : "text-gray-700"
// //                                   }`}
// //                                   value={value}
// //                                   onChange={(e) =>
// //                                     handleInputChange(
// //                                       actualEmpIdx,
// //                                       uniqueKey,
// //                                       e.target.value.replace(/[^0-9.]/g, "")
// //                                     )
// //                                   }
// //                                   onBlur={(e) =>
// //                                     handleForecastHoursBlur(
// //                                       actualEmpIdx,
// //                                       uniqueKey,
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   disabled={!isInputEditable}
// //                                   placeholder="Enter Hours"
// //                                 />
// //                               </td>
// //                             );
// //                           })}
// //                         </tr>
// //                       );
// //                     })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>

//  <div className="synchronized-tables-container flex">
//           <div
//             ref={firstTableRef}
//             onScroll={handleFirstScroll}
//             style={{
//               maxHeight: "400px",
//               overflowY: "auto",
//               overflowY: "hidden", // show scrollbar
//               overflowX: "auto",
//             }}
//           >
//             {" "}
//             {/* Added maxHeight and overflowY for vertical scrolling */}
//             <table className="table-fixed text-xs text-left min-w-max border border-gray-300 rounded-lg">
//               <thead
//                 className="sticky-thead"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   backgroundColor: "#fff",
//                   zIndex: 1,
//                 }}
//               >
//                 {" "}
//                 {/* Added sticky positioning and background for thead */}
//                 <tr
//                   style={{
//                     height: `${ROW_HEIGHT_DEFAULT}px`,
//                     lineHeight: "normal",
//                   }}
//                 >
//                   {EMPLOYEE_COLUMNS.map((col) => (
//                     <th
//                       key={col.key}
//                       className="p-1.5 border border-gray-200 whitespace-nowrap text-xs text-gray-900 font-normal min-w-[70px]"
//                     >
//                       {col.label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewForm && (
//                   <tr
//                     key="new-entry"
//                     className="bg-gray-50"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT}px`,
//                       lineHeight: "normal",
//                     }}
//                   >
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <select
//                         name="idType"
//                         value={newEntry.idType || ""}
//                         onChange={(e) => handleIdTypeChange(e.target.value)}
//                         className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                       >
//                         {ID_TYPE_OPTIONS.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="id"
//                         value={newEntry.id}
//                         onChange={(e) => handleIdChange(e.target.value)}
//                         disabled={newEntry.idType === "PLC"}
//                         className={`w-full rounded px-1 py-0.5 text-xs outline-none focus:ring-0 no-datalist-border ${
//                           newEntry.idType === "PLC"
//                             ? "bg-gray-100 cursor-not-allowed"
//                             : ""
//                         }`}
//                         list="employee-id-list"
//                         placeholder={
//                           newEntry.idType === "PLC"
//                             ? "Not required for PLC"
//                             : "Enter ID"
//                         }
//                       />
//                       <datalist id="employee-id-list">
//                         {newEntry.idType !== "Other" &&
//                           employeeSuggestions
//                             .filter(
//                               (emp) =>
//                                 emp.emplId && typeof emp.emplId === "string"
//                             )
//                             .map((emp, index) => (
//                               <option
//                                 key={`${emp.emplId}-${index}`}
//                                 value={emp.emplId}
//                               >
//                                 {emp.lastName && emp.firstName
//                                   ? `${emp.lastName}, ${emp.firstName}`
//                                   : emp.lastName || emp.firstName || emp.emplId}
//                               </option>
//                             ))}
//                       </datalist>
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="name"
//                         value={
//                           newEntry.idType === "Other"
//                             ? `${newEntry.firstName || ""} ${
//                                 newEntry.lastName || ""
//                               }`.trim()
//                             : newEntry.idType === "Vendor"
//                             ? newEntry.lastName || newEntry.firstName || ""
//                             : newEntry.lastName && newEntry.firstName
//                             ? `${newEntry.lastName}, ${newEntry.firstName}`
//                             : newEntry.lastName || newEntry.firstName || ""
//                         }
//                         readOnly={newEntry.idType !== "Other"}
//                         onChange={(e) => {
//                           if (newEntry.idType === "Other") {
//                             const fullName = e.target.value.trim();
//                             const nameParts = fullName.split(" ");
//                             const firstName = nameParts[0] || "";
//                             const lastName = nameParts.slice(1).join(" ") || "";

//                             setNewEntry((prev) => ({
//                               ...prev,
//                               firstName: firstName,
//                               lastName: lastName,
//                             }));
//                           }
//                         }}
//                         className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
//                           newEntry.idType === "Other"
//                             ? "bg-white"
//                             : "bg-gray-100 cursor-not-allowed"
//                         }`}
//                         placeholder={
//                           newEntry.idType === "Other"
//                             ? "Enter name"
//                             : "Name (auto-filled)"
//                         }
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="acctId"
//                         value={newEntry.acctId}
//                         onChange={(e) => handleAccountChange(e.target.value)}
//                         onBlur={(e) => handleAccountBlur(e.target.value)}
//                         className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
//                           !isFieldEditable
//                             ? "bg-gray-100 cursor-not-allowed"
//                             : ""
//                         }`}
//                         list="account-list"
//                         placeholder="Enter Account"
//                         disabled={!isFieldEditable}
//                       />
//                       <datalist id="account-list">
//                         {laborAccounts.map((account, index) => (
//                           <option
//                             key={`${account.id}-${index}`}
//                             value={account.id}
//                           >
//                             {account.id}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="orgId"
//                         value={newEntry.orgId}
//                         onChange={(e) => handleOrgInputChange(e.target.value)}
//                         onBlur={(e) => handleOrgBlur(e.target.value)}
//                         className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
//                           !isFieldEditable
//                             ? "bg-gray-100 cursor-not-allowed"
//                             : ""
//                         }`}
//                         list="organization-list"
//                         placeholder="Enter Organization ID (numeric)"
//                         disabled={!isFieldEditable}
//                       />
//                       <datalist id="organization-list">
//                         {organizationOptions.map((org, index) => (
//                           <option
//                             key={`${org.value}-${index}`}
//                             value={org.value}
//                           >
//                             {org.label}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="plcGlcCode"
//                         value={newEntry.plcGlcCode}
//                         onChange={(e) => handlePlcInputChange(e.target.value)}
//                         onBlur={(e) => handlePlcBlur(e.target.value)}
//                         className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
//                           autoPopulatedPLC
//                             ? "bg-gray-100 cursor-not-allowed"
//                             : ""
//                         }`}
//                         list="plc-list"
//                         placeholder="Enter Plc"
//                       />
//                       <datalist id="plc-list">
//                         {filteredPlcOptions.map((plc, index) => (
//                           <option
//                             key={`${plc.value}-${index}`}
//                             value={plc.value}
//                           >
//                             {plc.label}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5 text-center">
//                       <input
//                         type="checkbox"
//                         name="isRev"
//                         checked={newEntry.isRev}
//                         onChange={(e) =>
//                           isFieldEditable &&
//                           setNewEntry({
//                             ...newEntry,
//                             isRev: e.target.checked,
//                           })
//                         }
//                         disabled={!isFieldEditable}
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5 text-center">
//                       <input
//                         type="checkbox"
//                         name="isBrd"
//                         checked={newEntry.isBrd}
//                         onChange={(e) =>
//                           isFieldEditable &&
//                           setNewEntry({
//                             ...newEntry,
//                             isBrd: e.target.checked,
//                           })
//                         }
//                         disabled={!isFieldEditable}
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="status"
//                         value={newEntry.status}
//                         onChange={(e) =>
//                           setNewEntry({ ...newEntry, status: e.target.value })
//                         }
//                         className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                         placeholder="Enter Status"
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       <input
//                         type="text"
//                         name="perHourRate"
//                         value={newEntry.perHourRate}
//                         onChange={(e) =>
//                           isFieldEditable &&
//                           setNewEntry({
//                             ...newEntry,
//                             perHourRate: e.target.value.replace(/[^0-9.]/g, ""),
//                           })
//                         }
//                         className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
//                           !isFieldEditable
//                             ? "bg-gray-100 cursor-not-allowed"
//                             : ""
//                         }`}
//                         disabled={!isFieldEditable}
//                       />
//                     </td>
//                     <td className="border border-gray-300 px-1.5 py-0.5">
//                       {Object.values(newEntryPeriodHours)
//                         .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
//                         .toFixed(2)}
//                     </td>
//                   </tr>
//                 )}
//                 {localEmployees
//                   .filter((_, idx) => !hiddenRows[idx])
//                   .map((emp, idx) => {
//                     const actualEmpIdx = localEmployees.findIndex(
//                       (e) => e === emp
//                     );
//                     const row = getEmployeeRow(emp, actualEmpIdx);
//                     const editedData = editedEmployeeData[actualEmpIdx] || {};
//                     return (
//                       <tr
//                         key={`employee-${actualEmpIdx}`}
//                         className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
//                           selectedRowIndex === actualEmpIdx
//                             ? "bg-yellow-100"
//                             : "even:bg-gray-50"
//                         }`}
//                         style={{
//                           height: `${ROW_HEIGHT_DEFAULT}px`,
//                           lineHeight: "normal",
//                           cursor: isEditable ? "pointer" : "default",
//                         }}
//                         onClick={() => handleRowClick(actualEmpIdx)}
//                       >
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {row.idType}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {row.emplId}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {row.name}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="text"
//                               value={
//                                 editedData.acctId !== undefined
//                                   ? editedData.acctId
//                                   : row.acctId
//                               }
//                               onChange={(e) =>
//                                 handleAccountInputChangeForUpdate(
//                                   e.target.value,
//                                   actualEmpIdx
//                                 )
//                               }
//                               onBlur={(e) => {
//                                 const val = e.target.value;
//                                 if (
//                                   val &&
//                                   !isValidAccountForUpdate(
//                                     val,
//                                     updateAccountOptions
//                                   )
//                                 ) {
//                                   toast.error(
//                                     "Please enter a valid Account from the available list.",
//                                     {
//                                       autoClose: 3000,
//                                     }
//                                   );
//                                 } else {
//                                   handleEmployeeDataBlur(actualEmpIdx, emp);
//                                 }
//                               }}
//                               className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                               list={`account-list-${actualEmpIdx}`}
//                               placeholder="Enter Account"
//                             />
//                           ) : (
//                             row.acctId
//                           )}
//                           <datalist id={`account-list-${actualEmpIdx}`}>
//                             {updateAccountOptions.map((account, index) => (
//                               <option
//                                 key={`${account.id}-${index}`}
//                                 value={account.id}
//                               >
//                                 {account.id}
//                               </option>
//                             ))}
//                           </datalist>
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="text"
//                               value={
//                                 editedData.orgId !== undefined
//                                   ? editedData.orgId
//                                   : row.orgId
//                               }
//                               onChange={(e) =>
//                                 handleOrgInputChangeForUpdate(
//                                   e.target.value,
//                                   actualEmpIdx
//                                 )
//                               }
//                               onBlur={(e) => {
//                                 const val = e.target.value;
//                                 const originalValue = row.orgId;

//                                 if (
//                                   val !== originalValue &&
//                                   val &&
//                                   !isValidOrgForUpdate(
//                                     val,
//                                     updateOrganizationOptions
//                                   )
//                                 ) {
//                                   toast.error(
//                                     "Please enter a valid numeric Organization ID from the available list.",
//                                     {
//                                       autoClose: 3000,
//                                     }
//                                   );
//                                 } else {
//                                   handleEmployeeDataBlur(actualEmpIdx, emp);
//                                 }
//                               }}
//                               className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                               list={`organization-list-${actualEmpIdx}`}
//                               placeholder="Enter Organization ID"
//                             />
//                           ) : (
//                             row.orgId
//                           )}
//                           <datalist id={`organization-list-${actualEmpIdx}`}>
//                             {updateOrganizationOptions.map((org, index) => (
//                               <option
//                                 key={`${org.value}-${index}`}
//                                 value={org.value}
//                               >
//                                 {org.label}
//                               </option>
//                             ))}
//                           </datalist>
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="text"
//                               value={
//                                 editedData.glcPlc !== undefined
//                                   ? editedData.glcPlc
//                                   : row.glcPlc
//                               }
//                               onChange={(e) =>
//                                 handlePlcInputChangeForUpdate(
//                                   e.target.value,
//                                   actualEmpIdx
//                                 )
//                               }
//                               onBlur={(e) => {
//                                 const val = e.target.value;
//                                 const originalValue = row.glcPlc;

//                                 if (
//                                   val !== originalValue &&
//                                   val &&
//                                   !isValidPlcForUpdate(val, updatePlcOptions)
//                                 ) {
//                                   toast.error(
//                                     "Please enter a valid PLC from the available list.",
//                                     {
//                                       autoClose: 3000,
//                                     }
//                                   );
//                                 } else {
//                                   handleEmployeeDataBlur(actualEmpIdx, emp);
//                                 }
//                               }}
//                               className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                               list={`plc-list-${actualEmpIdx}`}
//                               placeholder="Enter PLC"
//                             />
//                           ) : (
//                             row.glcPlc
//                           )}
//                           <datalist id={`plc-list-${actualEmpIdx}`}>
//                             {(updatePlcOptions.length > 0
//                               ? updatePlcOptions
//                               : plcOptions
//                             ).map((plc, index) => (
//                               <option
//                                 key={`${plc.value}-${index}`}
//                                 value={plc.value}
//                               >
//                                 {plc.label}
//                               </option>
//                             ))}
//                           </datalist>
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="checkbox"
//                               checked={
//                                 editedData.isRev !== undefined
//                                   ? editedData.isRev
//                                   : emp.emple.isRev
//                               }
//                               onChange={(e) =>
//                                 handleEmployeeDataChange(
//                                   actualEmpIdx,
//                                   "isRev",
//                                   e.target.checked
//                                 )
//                               }
//                               onBlur={() =>
//                                 handleEmployeeDataBlur(actualEmpIdx, emp)
//                               }
//                               className="w-4 h-4"
//                             />
//                           ) : (
//                             row.isRev
//                           )}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="checkbox"
//                               checked={
//                                 editedData.isBrd !== undefined
//                                   ? editedData.isBrd
//                                   : emp.emple.isBrd
//                               }
//                               onChange={(e) =>
//                                 handleEmployeeDataChange(
//                                   actualEmpIdx,
//                                   "isBrd",
//                                   e.target.checked
//                                 )
//                               }
//                               onBlur={() =>
//                                 handleEmployeeDataBlur(actualEmpIdx, emp)
//                               }
//                               className="w-4 h-4"
//                             />
//                           ) : (
//                             row.isBrd
//                           )}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {row.status}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {isBudPlan && isEditable ? (
//                             <input
//                               type="text"
//                               value={
//                                 editedData.perHourRate !== undefined
//                                   ? editedData.perHourRate
//                                   : row.perHourRate
//                               }
//                               onChange={(e) =>
//                                 handleEmployeeDataChange(
//                                   actualEmpIdx,
//                                   "perHourRate",
//                                   e.target.value.replace(/[^0-9.]/g, "")
//                                 )
//                               }
//                               onBlur={() =>
//                                 handleEmployeeDataBlur(actualEmpIdx, emp)
//                               }
//                               className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
//                             />
//                           ) : (
//                             row.perHourRate
//                           )}
//                         </td>
//                         <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
//                           {row.total}
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>
//           <div
//             ref={secondTableRef}
//             onScroll={handleSecondScroll}
//             style={{
//               maxHeight: "400px",
//               overflowY: "auto", // show scrollbar
//               overflowX: "auto",
//             }}
//           >
//             {" "}
//             {/* Added maxHeight and overflowY for vertical scrolling */}
//             <table className="min-w-full text-xs text-center border-collapse border border-gray-300 rounded-lg">
//               <thead
//                 className="sticky-thead"
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   backgroundColor: "#fff",
//                   zIndex: 1,
//                 }}
//               >
//                 {" "}
//                 {/* Added sticky positioning and background for thead */}
//                 <tr
//                   style={{
//                     height: `${ROW_HEIGHT_DEFAULT}px`,
//                     lineHeight: "normal",
//                   }}
//                 >
//                   {sortedDurations.map((duration) => {
//                     const uniqueKey = `${duration.monthNo}_${duration.year}`;
//                     return (
//                       <th
//                         key={uniqueKey}
//                         className={`px-2 py-1.5 border border-gray-200 text-center min-w-[80px] text-xs text-gray-900 font-normal ${
//                           selectedColumnKey === uniqueKey ? "bg-yellow-100" : ""
//                         }`}
//                         style={{ cursor: isEditable ? "pointer" : "default" }}
//                         onClick={() => handleColumnHeaderClick(uniqueKey)}
//                       >
//                         <div className="flex flex-col items-center justify-center h-full">
//                           <span className="whitespace-nowrap text-xs text-gray-900 font-normal">
//                             {duration.month}
//                           </span>
//                           <span className="text-xs text-gray-600 font-normal">
//                             {duration.workingHours || 0} hrs
//                           </span>
//                         </div>
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody>
//                 {showNewForm && (
//                   <tr
//                     key="new-entry"
//                     className="bg-gray-50"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT}px`,
//                       lineHeight: "normal",
//                     }}
//                   >
//                     {sortedDurations.map((duration) => {
//                       const uniqueKey = `${duration.monthNo}_${duration.year}`;
//                       const isInputEditable =
//                         isEditable &&
//                         isMonthEditable(duration, closedPeriod, planType);
//                       return (
//                         <td
//                           key={`new-${uniqueKey}`}
//                           className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
//                             planType === "EAC"
//                               ? isInputEditable
//                                 ? "bg-green-50"
//                                 : "bg-gray-200"
//                               : ""
//                           }`}
//                         >
//                           <input
//                             type="text"
//                             inputMode="numeric"
//                             value={newEntryPeriodHours[uniqueKey] ?? "0"}
//                             onChange={(e) =>
//                               isInputEditable &&
//                               setNewEntryPeriodHours((prev) => ({
//                                 ...prev,
//                                 [uniqueKey]: e.target.value.replace(
//                                   /[^0-9.]/g,
//                                   ""
//                                 ),
//                               }))
//                             }
//                             className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
//                               !isInputEditable
//                                 ? "cursor-not-allowed text-gray-400"
//                                 : "text-gray-700"
//                             }`}
//                             disabled={!isInputEditable}
//                             placeholder="Enter Hours"
//                           />
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 )}
//                 {localEmployees
//                   .filter((_, idx) => !hiddenRows[idx])
//                   .map((emp, idx) => {
//                     const actualEmpIdx = localEmployees.findIndex(
//                       (e) => e === emp
//                     );
//                     const monthHours = getMonthHours(emp);
//                     return (
//                       <tr
//                         key={`hours-${actualEmpIdx}`}
//                         className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
//                           selectedRowIndex === actualEmpIdx
//                             ? "bg-yellow-100"
//                             : "even:bg-gray-50"
//                         }`}
//                         style={{
//                           height: `${ROW_HEIGHT_DEFAULT}px`,
//                           lineHeight: "normal",
//                           cursor: isEditable ? "pointer" : "default",
//                         }}
//                         onClick={() => handleRowClick(actualEmpIdx)}
//                       >
//                         {sortedDurations.map((duration) => {
//                           const uniqueKey = `${duration.monthNo}_${duration.year}`;
//                           const forecast = monthHours[uniqueKey];
//                           const value =
//                             inputValues[`${actualEmpIdx}_${uniqueKey}`] ??
//                             (forecast?.value !== undefined
//                               ? forecast.value
//                               : "0");
//                           const isInputEditable =
//                             isEditable &&
//                             isMonthEditable(duration, closedPeriod, planType);
//                           return (
//                             <td
//                               key={`hours-${actualEmpIdx}-${uniqueKey}`}
//                               className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
//                                 selectedColumnKey === uniqueKey
//                                   ? "bg-yellow-100"
//                                   : ""
//                               } ${
//                                 planType === "EAC"
//                                   ? isInputEditable
//                                     ? "bg-green-50"
//                                     : "bg-gray-200"
//                                   : ""
//                               }`}
//                             >
//                               <input
//                                 type="text"
//                                 inputMode="numeric"
//                                 className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
//                                   !isInputEditable
//                                     ? "cursor-not-allowed text-gray-400"
//                                     : "text-gray-700"
//                                 }`}
//                                 value={value}
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     actualEmpIdx,
//                                     uniqueKey,
//                                     e.target.value.replace(/[^0-9.]/g, "")
//                                   )
//                                 }
//                                 onBlur={(e) =>
//                                   handleForecastHoursBlur(
//                                     actualEmpIdx,
//                                     uniqueKey,
//                                     e.target.value
//                                   )
//                                 }
//                                 disabled={!isInputEditable}
//                                 placeholder="Enter Hours"
//                               />
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>
//         </div>
         
//       )}
//       {showFindReplace && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-sm">
//             <h3 className="text-lg font-semibold mb-4">
//               Find and Replace Hours
//             </h3>
//             <div className="mb-3">
//               <label
//                 htmlFor="findValue"
//                 className="block text-gray-700 text-xs font-medium mb-1"
//               >
//                 Find:
//               </label>
//               <input
//                 type="text"
//                 id="findValue"
//                 className="w-full border border-gray-300 rounded-md p-2 text-xs"
//                 value={findValue}
//                 onChange={(e) => setFindValue(e.target.value)}
//                 placeholder="Value to find (e.g., 100 or empty)"
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="replaceValue"
//                 className="block text-gray-700 text-xs font-medium mb-1"
//               >
//                 Replace with:
//               </label>
//               <input
//                 type="text"
//                 id="replaceValue"
//                 className="w-full border border-gray-300 rounded-md p-2 text-xs"
//                 value={replaceValue}
//                 onChange={(e) =>
//                   setReplaceValue(e.target.value.replace(/[^0-9.]/g, ""))
//                 }
//                 placeholder="New value (e.g., 120 or empty)"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-xs font-medium mb-1">
//                 Scope:
//               </label>
//               <div className="flex gap-4 flex-wrap">
//                 <label className="inline-flex items-center text-xs cursor-pointer">
//                   <input
//                     type="radio"
//                     className="form-radio text-blue-600"
//                     name="replaceScope"
//                     value="all"
//                     checked={replaceScope === "all"}
//                     onChange={(e) => setReplaceScope(e.target.value)}
//                   />
//                   <span className="ml-2">All</span>
//                 </label>
//                 <label className="inline-flex items-center text-xs cursor-pointer">
//                   <input
//                     type="radio"
//                     className="form-radio text-blue-600"
//                     name="replaceScope"
//                     value="row"
//                     checked={replaceScope === "row"}
//                     onChange={(e) => setReplaceScope(e.target.value)}
//                     disabled={selectedRowIndex === null}
//                   />
//                   <span className="ml-2">
//                     Selected Row (
//                     {selectedRowIndex !== null
//                       ? localEmployees[selectedRowIndex]?.emple.emplId
//                       : "N/A"}
//                     )
//                   </span>
//                 </label>
//                 <label className="inline-flex items-center text-xs cursor-pointer">
//                   <input
//                     type="radio"
//                     className="form-radio text-blue-600"
//                     name="replaceScope"
//                     value="column"
//                     checked={replaceScope === "column"}
//                     onChange={(e) => setReplaceScope(e.target.value)}
//                     disabled={selectedColumnKey === null}
//                   />
//                   <span className="ml-2">
//                     Selected Column (
//                     {selectedColumnKey
//                       ? sortedDurations.find(
//                           (d) => `${d.monthNo}_${d.year}` === selectedColumnKey
//                         )?.month
//                       : "N/A"}
//                     )
//                   </span>
//                 </label>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowFindReplace(false);
//                   setSelectedRowIndex(null);
//                   setSelectedColumnKey(null);
//                   setReplaceScope("all");
//                 }}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-xs"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleFindReplace}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
//               >
//                 Replace All
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Warning Popup Modal */}
//       {showWarningPopup && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">
//                 Warnings for Employee: {selectedEmployeeIdForWarning}
//               </h3>
//               <button
//                 onClick={() => setShowWarningPopup(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Warning Component */}
//             <Warning
//               planId={planId}
//               projectId={projectId}
//               planType={planType}
//             />

//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => setShowWarningPopup(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectHoursDetails;


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Warning from "./Warning";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const EMPLOYEE_COLUMNS = [
  { key: "idType", label: "ID Type" },
  { key: "emplId", label: "ID" },
  { key: "warning", label: "Warning" },
  { key: "name", label: "Name" },
  { key: "acctId", label: "Account" },
  { key: "orgId", label: "Organization" },
  { key: "glcPlc", label: "Plc" },
  { key: "isRev", label: "Rev" },
  { key: "isBrd", label: "Brd" },
  { key: "status", label: "Status" },
  { key: "perHourRate", label: "Hour Rate" },
  { key: "total", label: "Total" },
];

const ID_TYPE_OPTIONS = [
  { value: "", label: "Select ID Type" },
  { value: "Employee", label: "Employee" },
  { value: "Vendor", label: "Vendor Employee" },
  { value: "PLC", label: "PLC" },
  { value: "Other", label: "Other" },
];

const ROW_HEIGHT_DEFAULT = 48;

function isMonthEditable(duration, closedPeriod, planType) {
  if (planType !== "EAC") return true;
  if (!closedPeriod) return true;
  const closedDate = new Date(closedPeriod);
  if (isNaN(closedDate)) return true;
  const durationDate = new Date(duration.year, duration.monthNo - 1, 1);
  const closedMonth = closedDate.getMonth();
  const closedYear = closedDate.getFullYear();
  const durationMonth = durationDate.getMonth();
  const durationYear = durationDate.getFullYear();
  return (
    durationYear > closedYear ||
    (durationYear === closedYear && durationMonth >= closedMonth)
  );
}

const ProjectHoursDetails = ({
  planId,
  projectId,
  status,
  planType,
  closedPeriod,
  startDate,
  endDate,
  fiscalYear,
  onSaveSuccess,
}) => {
  const [durations, setDurations] = useState([]);
  const [isDurationLoading, setIsDurationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hiddenRows, setHiddenRows] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [replaceScope, setReplaceScope] = useState("all");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColumnKey, setSelectedColumnKey] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    id: "",
    firstName: "",
    lastName: "",
    isRev: false,
    isBrd: false,
    idType: "",
    acctId: "",
    orgId: "",
    plcGlcCode: "",
    perHourRate: "",
    status: "Act",
  });
  const [newEntryPeriodHours, setNewEntryPeriodHours] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [laborAccounts, setLaborAccounts] = useState([]);
  const [plcOptions, setPlcOptions] = useState([]);
  const [plcSearch, setPlcSearch] = useState("");
  const [showFillValues, setShowFillValues] = useState(false);
  const [fillMethod, setFillMethod] = useState("None");
  const [fillHours, setFillHours] = useState(0.0);
  const [sourceRowIndex, setSourceRowIndex] = useState(null);
  const [editedEmployeeData, setEditedEmployeeData] = useState({});
  const [localEmployees, setLocalEmployees] = useState([]);
  const [fillStartDate, setFillStartDate] = useState(startDate);
  const [fillEndDate, setFillEndDate] = useState(endDate);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPopulatedPLC, setAutoPopulatedPLC] = useState(false); // Track if PLC is auto-populated
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [filteredPlcOptions, setFilteredPlcOptions] = useState([]);
  // Add these state variables after your existing useState declarations
  const [updateAccountOptions, setUpdateAccountOptions] = useState([]);
  const [updateOrganizationOptions, setUpdateOrganizationOptions] = useState(
    []
  );
  const [updatePlcOptions, setUpdatePlcOptions] = useState([]);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [selectedEmployeeIdForWarning, setSelectedEmployeeIdForWarning] =
    useState(null);
  const [localWarnings, setLocalWarnings] = useState({});
  const firstTableRef = useRef(null);
  const secondTableRef = useRef(null);

  const debounceTimeout = useRef(null);
  // const horizontalScrollRef = useRef(null);
  // const verticalScrollRef = useRef(null);
  // const firstTableRef = useRef(null);
  // const lastTableRef = useRef(null);
  // const vfirstTableRef = useRef(null);
  // const vlastTableRef = useRef(null);

   const scrollingLock = useRef(false);
 
  const syncScroll = (sourceRef, targetRef) => {
    if (!sourceRef.current || !targetRef.current) return;
    // Only sync if not already in an update
    if (!scrollingLock.current) {
      scrollingLock.current = true;
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      // Allow event on next tick
      setTimeout(() => {
        scrollingLock.current = false;
      }, 0);
    }
  };
 
  const handleFirstScroll = () => {
    syncScroll(firstTableRef, secondTableRef);
  };
 
  const handleSecondScroll = () => {
    syncScroll(secondTableRef, firstTableRef);
  };
 

  const isEditable = status === "In Progress";
  // const isBudPlan = planType === "BUD";
  const isBudPlan = planType === "BUD" || planType === "NBBUD";

  // const isFieldEditable = planType === "BUD" || planType === "EAC"; // Add this line
  const isFieldEditable =
    planType === "BUD" || planType === "EAC" || planType === "NBBUD";

  // Clear all fields when ID type changes
  useEffect(() => {
    if (newEntry.idType === "PLC") {
      setNewEntry({
        ...newEntry,
        id: "PLC",
        firstName: "",
        lastName: "",
        perHourRate: "",
        orgId: "",
        plcGlcCode: "",
        acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
      });
      setPlcSearch("");
      setAutoPopulatedPLC(false);
    } else if (newEntry.idType !== "") {
      // Clear all fields when switching to any other type
      setNewEntry((prev) => ({
        ...prev,
        id: "",
        firstName: "",
        lastName: "",
        perHourRate: "",
        orgId: "",
        plcGlcCode: "",
        acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
      }));
      setPlcSearch("");
      setAutoPopulatedPLC(false);
    }
    // eslint-disable-next-line
  }, [newEntry.idType]);

  const isValidEmployeeId = (id) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!id) return false;
    if (newEntry.idType === "Employee" || newEntry.idType === "Vendor") {
      return !!employeeSuggestions.find((emp) => emp.emplId === id);
    }
    if (newEntry.idType === "Other") {
      return !!employeeSuggestions.find((emp) => emp.emplId === id);
    }
    return true;
  };

  const isValidAccount = (val) => {
    if (planType === "NBBUD") return true; // Add this line
    return !val || laborAccounts.some((acc) => acc.id === val);
  };

  const isValidOrg = (val) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!val) return false;
    const trimmed = val.toString().trim();
    if (!/^[\d.]+$/.test(trimmed)) return false;
    return organizationOptions.some((opt) => opt.value.toString() === trimmed);
  };

  const isValidOrgForUpdate = (val, updateOptions) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!val) return false;
    const trimmed = val.toString().trim();
    if (!/^[\d.]+$/.test(trimmed)) return false;
    return updateOptions.some((opt) => opt.value.toString() === trimmed);
  };

  const isValidAccountForUpdate = (val, updateOptions) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!val) return false;
    const trimmed = val.toString().trim();
    return updateOptions.some((opt) => opt.id === trimmed);
  };

  const isValidPlc = (val) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!val) return true;
    if (plcOptions.length === 0) return true;
    const isValid = plcOptions.some((option) => option.value === val.trim());
    return isValid;
  };

  const isValidPlcForUpdate = (val, updateOptions) => {
    if (planType === "NBBUD") return true; // Add this line
    if (!val) return true;
    if (updateOptions.length === 0) return true;
    const trimmed = val.toString().trim();
    return updateOptions.some((option) => option.value === trimmed);
  };

  // Track unsaved changes
  const hasUnsavedChanges = () => {
    const isNewEntryModified =
      newEntry.id !== "" ||
      newEntry.firstName !== "" ||
      newEntry.lastName !== "" ||
      newEntry.isRev ||
      newEntry.isBrd ||
      newEntry.idType !== "" ||
      newEntry.acctId !== "" ||
      newEntry.orgId !== "" ||
      newEntry.plcGlcCode !== "" ||
      newEntry.perHourRate !== "" ||
      newEntry.status !== "Act";

    const isPeriodHoursModified = Object.keys(newEntryPeriodHours).length > 0;
    const isInputValuesModified = Object.keys(inputValues).length > 0;
    const isEditedEmployeeDataModified =
      Object.keys(editedEmployeeData).length > 0;

    return (
      isNewEntryModified ||
      isPeriodHoursModified ||
      isInputValuesModified ||
      isEditedEmployeeDataModified
    );
  };

  // Handle beforeunload event for unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges()) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave without saving?";
      return event.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [newEntry, newEntryPeriodHours, inputValues, editedEmployeeData]);

  // Vertical sync only
  // useEffect(() => {
  //   const container = verticalScrollRef.current;
  //   const firstScroll = vfirstTableRef.current;
  //   const lastScroll = vlastTableRef.current;

  //   if (!container || !firstScroll || !lastScroll) return;

  //   const onScroll = () => {
  //     const scrollTop = container.scrollTop;
  //     firstScroll.scrollTop = scrollTop;
  //     lastScroll.scrollTop = scrollTop;
  //   };

  //   container.addEventListener("scroll", onScroll);
  //   return () => container.removeEventListener("scroll", onScroll);
  // }, []);

  // useEffect(() => {
  //   const container = horizontalScrollRef.current;
  //   const firstScroll = firstTableRef.current;
  //   const lastScroll = lastTableRef.current;

  //   if (!container || !firstScroll || !lastScroll) return;

  //   const onScroll = () => {
  //     const scrollLeft = container.scrollLeft;
  //     firstScroll.scrollLeft = scrollLeft;
  //     lastScroll.scrollLeft = scrollLeft;
  //   };

  //   container.addEventListener("scroll", onScroll);
  //   return () => container.removeEventListener("scroll", onScroll);
  // }, []);

  const fetchEmployees = async () => {
    if (!planId) return;
    setIsLoading(true);
    try {
      const employeeApi =
        planType === "EAC"
          ? `${backendUrl}/Project/GetEmployeeForecastByPlanID/${planId}`
          : `${backendUrl}/Project/GetEmployeeForecastByPlanID/${planId}`;
      const response = await axios.get(employeeApi);
      setLocalEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setLocalEmployees([]);
      if (err.response && err.response.status === 500) {
        toast.info("No forecast data available for this plan.", {
          toastId: "no-forecast-data",
          autoClose: 3000,
        });
      } else {
        toast.error(
          "Failed to load forecast data: " +
            (err.response?.data?.message || err.message),
          {
            toastId: "forecast-error",
            autoClose: 3000,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [planId, planType]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!startDate || !endDate) {
        setDurations([]);
        setIsDurationLoading(false);
        return;
      }
      setIsDurationLoading(true);
      setError(null);
      try {
        const durationResponse = await axios.get(
          `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startDate}/${endDate}`
        );
        if (!Array.isArray(durationResponse.data)) {
          throw new Error("Invalid duration response format");
        }
        setDurations(durationResponse.data);
      } catch (err) {
        setError("Failed to load duration data. Please try again.");
        toast.error(
          "Failed to load duration data: " +
            (err.response?.data?.message || err.message),
          {
            toastId: "duration-error",
            autoClose: 3000,
          }
        );
      } finally {
        setIsDurationLoading(false);
      }
    };
    fetchDurations();
  }, [startDate, endDate]);

  // ADD THIS useEffect after your existing useEffects
  useEffect(() => {
    const loadOrganizationOptions = async () => {
      if (!showNewForm) return;

      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetAllOrgs`
        );
        const orgOptions = Array.isArray(response.data)
          ? response.data.map((org) => ({
              value: org.orgId,
              label: org.orgId,
            }))
          : [];
        setOrganizationOptions(orgOptions);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    };

    loadOrganizationOptions();
  }, [showNewForm]);

  useEffect(() => {
    const initializeUpdateOptions = async () => {
      if (localEmployees.length === 0) return;

      try {
        // Load organizations for updates
        const orgResponse = await axios.get(
          `${backendUrl}/Orgnization/GetAllOrgs`
        );
        const orgOptions = Array.isArray(orgResponse.data)
          ? orgResponse.data.map((org) => ({
              value: org.orgId,
              label: org.orgId,
            }))
          : [];

        // Load project data for accounts and PLC options
        if (projectId) {
          try {
            const response = await axios.get(
              `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
            );
            const data = Array.isArray(response.data)
              ? response.data[0]
              : response.data;

            // Load ALL account types for updates (including PLC and Other types)
            let allAccounts = [];

            // Employee accounts
            if (
              data.employeeLaborAccounts &&
              Array.isArray(data.employeeLaborAccounts)
            ) {
              const employeeAccounts = data.employeeLaborAccounts.map(
                (account) => ({
                  id: account.accountId,
                  type: "employee",
                })
              );
              allAccounts.push(...employeeAccounts);
            }

            // Vendor accounts
            if (
              data.sunContractorLaborAccounts &&
              Array.isArray(data.sunContractorLaborAccounts)
            ) {
              const vendorAccounts = data.sunContractorLaborAccounts.map(
                (account) => ({
                  id: account.accountId,
                  type: "vendor",
                })
              );
              allAccounts.push(...vendorAccounts);
            }

            // Other Direct Cost accounts (for "Other" ID type)
            if (
              data.otherDirectCostLaborAccounts &&
              Array.isArray(data.otherDirectCostLaborAccounts)
            ) {
              const otherAccounts = data.otherDirectCostLaborAccounts.map(
                (account) => ({
                  id: account.accountId,
                  type: "other",
                })
              );
              allAccounts.push(...otherAccounts);
            }

            // Remove duplicates
            const uniqueAccountsMap = new Map();
            allAccounts.forEach((acc) => {
              if (acc.id && !uniqueAccountsMap.has(acc.id)) {
                uniqueAccountsMap.set(acc.id, { id: acc.id });
              }
            });
            const uniqueAccounts = Array.from(uniqueAccountsMap.values());

            // Load PLC options
            let plcOptionsForUpdate = [];
            if (data.plc && Array.isArray(data.plc)) {
              plcOptionsForUpdate = data.plc.map((plc) => ({
                value: plc.laborCategoryCode,
                label: `${plc.laborCategoryCode} - ${plc.description}`,
              }));
            }

            // Initialize all update options with ALL available accounts
            setUpdateAccountOptions(uniqueAccounts);
            setUpdateOrganizationOptions(orgOptions);
            setUpdatePlcOptions(plcOptionsForUpdate);

            // Also update main options if they're empty
            if (plcOptions.length === 0) {
              setPlcOptions(plcOptionsForUpdate);
              setFilteredPlcOptions(plcOptionsForUpdate);
            }
          } catch (err) {
            console.error("Failed to load project data for updates:", err);
            setUpdateAccountOptions(laborAccounts);
            setUpdateOrganizationOptions(orgOptions);
            setUpdatePlcOptions(plcOptions.length > 0 ? plcOptions : []);
          }
        }
      } catch (err) {
        console.error("Failed to initialize update options:", err);
      }
    };

    initializeUpdateOptions();
  }, [localEmployees.length, projectId]);

  useEffect(() => {
    const fetchEmployeesSuggestions = async () => {
      // Skip fetching suggestions for NBBUD
      if (planType === "NBBUD") {
        setEmployeeSuggestions([]);
        return;
      }

      if (
        !projectId ||
        !showNewForm ||
        !newEntry.idType ||
        newEntry.idType === ""
      ) {
        setEmployeeSuggestions([]);
        return;
      }

      try {
        const endpoint =
          newEntry.idType === "Vendor"
            ? `${backendUrl}/Project/GetVenderEmployeesByProject/${projectId}`
            : `${backendUrl}/Project/GetEmployeesByProject/${projectId}`;
        const response = await axios.get(endpoint);
        const suggestions = Array.isArray(response.data)
          ? response.data.map((emp) => {
              if (newEntry.idType === "Vendor") {
                return {
                  emplId: emp.vendId,
                  firstName: "",
                  lastName: emp.employeeName || "",
                  perHourRate: emp.perHourRate || emp.hrRate || "",
                  plc: emp.plc || "",
                  orgId: emp.orgId || "",
                };
              } else {
                const [lastName, firstName] = (emp.employeeName || "")
                  .split(", ")
                  .map((str) => str.trim());
                return {
                  emplId: emp.empId,
                  firstName: firstName || "",
                  lastName: lastName || "",
                  perHourRate: emp.perHourRate || emp.hrRate || "",
                  plc: emp.plc || "",
                  orgId: emp.orgId || "",
                };
              }
            })
          : [];
        setEmployeeSuggestions(suggestions);
      } catch (err) {
        setEmployeeSuggestions([]);
        toast.error(`Failed to fetch employee suggestions`, {
          toastId: "employee-fetch-error",
          autoClose: 3000,
        });
      }
    };

    const fetchLaborAccounts = async () => {
      if (planType === "NBBUD") return;

      if (!projectId || !showNewForm) return;
      try {
        const response = await axios.get(
          `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
        );
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        let accounts = [];

        if (newEntry.idType === "PLC") {
          // Combine both employee and vendor accounts for PLC
          const employeeAccounts = Array.isArray(data.employeeLaborAccounts)
            ? data.employeeLaborAccounts.map((account) => ({
                id: account.accountId,
              }))
            : [];

          const vendorAccounts = Array.isArray(data.sunContractorLaborAccounts)
            ? data.sunContractorLaborAccounts.map((account) => ({
                id: account.accountId,
              }))
            : [];

          accounts = [...employeeAccounts, ...vendorAccounts];
        } else if (newEntry.idType === "Employee") {
          accounts = Array.isArray(data.employeeLaborAccounts)
            ? data.employeeLaborAccounts.map((account) => ({
                id: account.accountId,
              }))
            : [];
        } else if (newEntry.idType === "Vendor") {
          accounts = Array.isArray(data.sunContractorLaborAccounts)
            ? data.sunContractorLaborAccounts.map((account) => ({
                id: account.accountId,
              }))
            : [];
        } else if (newEntry.idType === "Other") {
          // ADD THIS: For "Other" type, show all available accounts (both employee and vendor)
          // const employeeAccounts = Array.isArray(data.employeeLaborAccounts)
          //   ? data.employeeLaborAccounts.map(account => ({ id: account.accountId }))
          //   : [];

          // const vendorAccounts = Array.isArray(data.sunContractorLaborAccounts)
          //   ? data.sunContractorLaborAccounts.map(account => ({ id: account.accountId }))
          //   : [];

          // accounts = [...employeeAccounts, ...vendorAccounts];
          // For "Other" type, show only otherDirectCostLaborAccounts
          accounts = Array.isArray(data.otherDirectCostLaborAccounts)
            ? data.otherDirectCostLaborAccounts.map((account) => ({
                id: account.accountId,
              }))
            : [];
        } else {
          accounts = [];
        }

        // Remove duplicates
        const uniqueAccountsMap = new Map();
        accounts.forEach((acc) => {
          if (acc.id && !uniqueAccountsMap.has(acc.id)) {
            uniqueAccountsMap.set(acc.id, acc);
          }
        });
        const uniqueAccounts = Array.from(uniqueAccountsMap.values());
        setLaborAccounts(uniqueAccounts);

        // Rest of your existing code for PLC options and organization...
        if (data.plc && Array.isArray(data.plc)) {
          const plcOptionsFromApi = data.plc.map((plc) => ({
            value: plc.laborCategoryCode,
            label: `${plc.laborCategoryCode} - ${plc.description}`,
          }));
          // console.log('PLC Options loaded:', plcOptionsFromApi);
          setPlcOptions(plcOptionsFromApi);
          setFilteredPlcOptions(plcOptionsFromApi);
        } else {
          // console.log('No PLC data found in API response:', data);
          setPlcOptions([]);
          setFilteredPlcOptions([]);
        }

        // Auto-populate organization for Vendor Employees if present
        if (newEntry.idType === "Vendor" && data.orgId) {
          setNewEntry((prev) => ({
            ...prev,
            orgId: data.orgId,
          }));
        }
      } catch (err) {
        console.error("Error fetching labor accounts:", err);
        setLaborAccounts([]);
        setPlcOptions([]);
        setFilteredPlcOptions([]);
        toast.error("Failed to fetch labor accounts", {
          toastId: "labor-accounts-error",
          autoClose: 3000,
        });
      }
    };

    if (showNewForm) {
      fetchEmployeesSuggestions();
      fetchLaborAccounts();
    } else {
      setEmployeeSuggestions([]);
      setLaborAccounts([]);
      setPlcOptions([]);
      setFilteredPlcOptions([]); // ADD THIS LINE
      setPlcSearch("");
      setOrgSearch("");
      setAutoPopulatedPLC(false);
      // setEmployeeSuggestions([]);
      // setLaborAccounts([]);
      // setPlcSearch("");
      // setOrgSearch("");
      // setAutoPopulatedPLC(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [projectId, showNewForm, newEntry.idType, planType]);

  // Initialize filtered PLC options when PLC options change
  useEffect(() => {
    if (plcOptions.length > 0) {
      setFilteredPlcOptions(plcOptions);
      // console.log('PLC options initialized:', plcOptions.length); // DEBUG LOG
    }
  }, [plcOptions]);

  // const handleEmployeeDataChange = (empIdx, field, value) => {
  //   if (!isEditable || !isFieldEditable) return;

  //   setEditedEmployeeData((prev) => ({
  //     ...prev,
  //     [empIdx]: {
  //       ...prev[empIdx],
  //       [field]: value,
  //     },
  //   }));

  //   // ADD WARNING CHECKS FOR ACCOUNT AND ORGANIZATION
  //   const emp = localEmployees[empIdx];
  //   if (emp && emp.emple) {
  //     const emplId = emp.emple.emplId;

  //     if (field === "acctId") {
  //       const warningKey = generateFieldWarningKey(emplId, "account", value);
  //       const hasWarning = checkAccountInvalid(value, updateAccountOptions);

  //       setLocalWarnings(prev => {
  //         const updated = { ...prev };
  //         if (hasWarning) {
  //           updated[warningKey] = true;
  //         } else {
  //           // Remove warning when value becomes valid
  //           delete updated[warningKey];
  //         }
  //         return updated;
  //       });
  //     }

  //     if (field === "orgId") {
  //       const warningKey = generateFieldWarningKey(emplId, "organization", value);
  //       const hasWarning = checkOrgInvalid(value, updateOrganizationOptions);

  //       setLocalWarnings(prev => {
  //         const updated = { ...prev };
  //         if (hasWarning) {
  //           updated[warningKey] = true;
  //         } else {
  //           // Remove warning when value becomes valid
  //           delete updated[warningKey];
  //         }
  //         return updated;
  //       });
  //     }
  //   }
  // };

  const handleEmployeeDataChange = (empIdx, field, value) => {
    if (!isEditable || !isFieldEditable) return;

    setEditedEmployeeData((prev) => ({
      ...prev,
      [empIdx]: {
        ...prev[empIdx],
        [field]: value,
      },
    }));

    // ADD WARNING CHECKS FOR ACCOUNT AND ORGANIZATION
    const emp = localEmployees[empIdx];
    if (emp && emp.emple) {
      const emplId = emp.emple.emplId;

      if (field === "acctId") {
        const warningKey = generateFieldWarningKey(emplId, "account", value);
        const hasWarning = checkAccountInvalid(value, updateAccountOptions);

        setLocalWarnings((prev) => {
          const updated = { ...prev };
          if (hasWarning) {
            updated[warningKey] = true;
          } else {
            delete updated[warningKey]; // ✅ ENSURE THIS IS PRESENT
          }
          return updated;
        });
      }

      if (field === "orgId") {
        const warningKey = generateFieldWarningKey(
          emplId,
          "organization",
          value
        );
        const hasWarning = checkOrgInvalid(value, updateOrganizationOptions);

        setLocalWarnings((prev) => {
          const updated = { ...prev };
          if (hasWarning) {
            updated[warningKey] = true;
          } else {
            delete updated[warningKey]; // ✅ ENSURE THIS IS PRESENT
          }
          return updated;
        });
      }
    }
  };

  const handleOrgInputChangeForUpdate = (value, actualEmpIdx) => {
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Remove real-time validation - only validate on blur
    handleEmployeeDataChange(actualEmpIdx, "orgId", numericValue);
    setOrgSearch(numericValue);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Always fetch filtered organizations when user types
    if (numericValue.length >= 1) {
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/Orgnization/GetAllOrgs`
          );
          const filteredOptions = Array.isArray(response.data)
            ? response.data
                .filter((org) => org.orgId.toString().startsWith(numericValue))
                .map((org) => ({
                  value: org.orgId,
                  label: org.orgId,
                }))
            : [];
          setUpdateOrganizationOptions(filteredOptions); // Use correct state variable
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
          setUpdateOrganizationOptions([]);
        }
      }, 300);
    } else {
      // Load all organizations when input is empty
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/Orgnization/GetAllOrgs`
          );
          const orgOptions = Array.isArray(response.data)
            ? response.data.map((org) => ({
                value: org.orgId,
                label: org.orgId,
              }))
            : [];
          setUpdateOrganizationOptions(orgOptions);
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
          setUpdateOrganizationOptions([]);
        }
      }, 300);
    }
  };

  const handlePlcInputChangeForUpdate = (value, actualEmpIdx) => {
    handleEmployeeDataChange(actualEmpIdx, "glcPlc", value);
    setPlcSearch(value);

    // Always filter from the original plcOptions, not updatePlcOptions
    if (value.length >= 1) {
      const filtered = plcOptions.filter(
        (option) =>
          option.value.toLowerCase().includes(value.toLowerCase()) ||
          option.label.toLowerCase().includes(value.toLowerCase())
      );
      setUpdatePlcOptions(filtered);
    } else {
      // Reset to all available PLC options when input is empty
      setUpdatePlcOptions(plcOptions);
    }
  };

  const handleOrgInputChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Remove real-time validation - only validate on blur
    setNewEntry((prev) => ({ ...prev, orgId: numericValue }));
    setOrgSearch(numericValue);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Always fetch filtered organizations when user types
    if (numericValue.length >= 1) {
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/Orgnization/GetAllOrgs`
          );
          const filteredOptions = Array.isArray(response.data)
            ? response.data
                .filter((org) => org.orgId.toString().startsWith(numericValue))
                .map((org) => ({
                  value: org.orgId,
                  label: org.orgId,
                }))
            : [];
          setOrganizationOptions(filteredOptions);
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
          setOrganizationOptions([]);
        }
      }, 300);
    } else {
      // Load all organizations when input is empty
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/Orgnization/GetAllOrgs`
          );
          const orgOptions = Array.isArray(response.data)
            ? response.data.map((org) => ({
                value: org.orgId,
                label: org.orgId,
              }))
            : [];
          setOrganizationOptions(orgOptions);
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
          setOrganizationOptions([]);
        }
      }, 300);
    }
  };

  const handleIdTypeChange = (value) => {
    setNewEntry((prev) => ({
      id: "",
      firstName: "",
      lastName: "",
      isRev: false,
      isBrd: false,
      idType: value,
      acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
      orgId: "",
      plcGlcCode: "",
      perHourRate: "",
      status: "Act",
    }));
    setPlcSearch("");
    setAutoPopulatedPLC(false);
  };

  const handlePlcInputChange = (value) => {
    // Remove real-time validation - only validate on blur
    setPlcSearch(value);
    setNewEntry((prev) => ({ ...prev, plcGlcCode: value }));

    // Filter PLC options
    if (value.length >= 1) {
      const filtered = plcOptions.filter((option) =>
        option.value.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredPlcOptions(filtered);
    } else {
      setFilteredPlcOptions(plcOptions);
    }

    // Reset auto-populated flag when user manually types
    if (autoPopulatedPLC && value !== newEntry.plcGlcCode) {
      setAutoPopulatedPLC(false);
    }
  };

  const handleAccountBlur = (val) => {
    if (planType === "NBBUD") return; // Add this line
    if (val && !isValidAccount(val)) {
      toast.error("Please enter a valid Account from the available list.", {
        autoClose: 3000,
      });
      setNewEntry((prev) => ({ ...prev, acctId: "" }));
    }
  };

  const handleOrgBlur = (val) => {
    if (planType === "NBBUD") return; // Add this line
    if (!isValidOrg(val)) {
      toast.error(
        "Please enter a valid numeric Organization ID from the available list.",
        { autoClose: 3000 }
      );
      setNewEntry((prev) => ({ ...prev, orgId: "" }));
      setOrgSearch("");
    }
  };

  const handlePlcBlur = (val) => {
    if (planType === "NBBUD") return; // Add this line
    if (val && !isValidPlc(val)) {
      toast.error("Please enter a valid PLC from the available list.", {
        autoClose: 3000,
      });
      if (!autoPopulatedPLC) {
        setNewEntry((prev) => ({ ...prev, plcGlcCode: "" }));
        setPlcSearch("");
      }
    }
  };

  const handleAccountChange = (value) => {
    setNewEntry((prev) => ({ ...prev, acctId: value }));
  };

  const handleOrgChange = (value) => {
    setNewEntry((prev) => ({ ...prev, orgId: value }));
    setOrgSearch(value); // Add this line to track search
  };

  //   const handleOrgBlur = (val) => {
  //   if (val && val.length >= 3 && !isValidOrg(val)) {
  //     toast.error("Please enter a valid numeric Organization ID from the available list.", {
  //       autoClose: 3000,
  //     });
  //     setNewEntry(prev => ({...prev, orgId: ""}));
  //     setOrgSearch("");
  //   }
  // };

  const handleIdChange = (value) => {
    const trimmedValue = value.trim();

    // Skip all validation and suggestions for NBBUD
    if (planType === "NBBUD") {
      setNewEntry((prev) => ({ ...prev, id: trimmedValue }));
      return;
    }

    // 1. PLC type is always “PLC”
    if (newEntry.idType === "PLC") {
      setNewEntry((prev) => ({ ...prev, id: "PLC" }));
      return;
    }

    // 2. Persist whatever the user typed
    setNewEntry((prev) => ({ ...prev, id: trimmedValue }));

    // 3. If the field is cleared, reset most fields and exit
    if (!trimmedValue) {
      setNewEntry((prev) => ({
        ...prev,
        id: "",
        firstName: "",
        lastName: "",
        perHourRate: "",
        orgId: newEntry.idType === "Vendor" ? prev.orgId : "",
        plcGlcCode: "",
        acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
      }));
      setPlcSearch("");
      setAutoPopulatedPLC(false);
      return;
    }

    // 5. “Other” type needs no further validation
    if (newEntry.idType === "Other") return;

    // 6. For Employee / Vendor types, try to auto-populate from suggestions
    if (
      (newEntry.idType === "Employee" || newEntry.idType === "Vendor") &&
      employeeSuggestions.length > 0
    ) {
      const selectedEmployee = employeeSuggestions.find(
        (emp) => emp.emplId === trimmedValue
      );

      if (selectedEmployee) {
        // Found a match – copy its details, *including PLC*
        setNewEntry((prev) => ({
          ...prev,
          id: trimmedValue,
          firstName: selectedEmployee.firstName || "",
          lastName: selectedEmployee.lastName || "",
          perHourRate: selectedEmployee.perHourRate || "",
          orgId: selectedEmployee.orgId || prev.orgId,
          plcGlcCode: selectedEmployee.plc || "",
          acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
        }));
        setPlcSearch(selectedEmployee.plc || "");
        // setAutoPopulatedPLC(!!selectedEmployee.plc);
      } else {
        // No exact match – warn only if the entry is clearly invalid
        if (trimmedValue.length >= 3) {
          const partialMatch = employeeSuggestions.some((emp) =>
            emp.emplId.startsWith(trimmedValue)
          );
          if (!partialMatch) {
            toast.error("Invalid ID, please select a valid one!", {
              toastId: "invalid-id",
              autoClose: 3000,
            });
          }
        }

        // Leave any previously auto-populated PLC untouched;
        // only clear PLC when it wasn’t auto-filled.
        setNewEntry((prev) => ({
          ...prev,
          firstName: "",
          lastName: "",
          perHourRate: "",
          orgId: newEntry.idType === "Vendor" ? prev.orgId : "",
          plcGlcCode:
            newEntry.idType === "Vendor" && autoPopulatedPLC
              ? prev.plcGlcCode
              : "",
          acctId: laborAccounts.length > 0 ? laborAccounts[0].id : "",
        }));

        if (!(newEntry.idType === "Vendor" && autoPopulatedPLC)) {
          setPlcSearch("");
          setAutoPopulatedPLC(false);
        }
      }
    }
  };

  //   const getEmployeeRow = (emp, idx) => {
  //     if (!emp || !emp.emple) {
  //       return {
  //         idType: "-",
  //         emplId: "-",
  //         name: "-",
  //         acctId: "-",
  //         orgId: "-",
  //         glcPlc: "-",
  //         isRev: "-",
  //         isBrd: "-",
  //         status: "-",
  //         perHourRate: "0",
  //         total: "0",
  //         warning: false
  //       };
  //     }
  //     const monthHours = getMonthHours(emp);
  //     const totalHours = sortedDurations.reduce((sum, duration) => {
  //       const uniqueKey = `${duration.monthNo}_${duration.year}`;
  //       const inputValue = inputValues[`${idx}_${uniqueKey}`];
  //       const forecastValue = monthHours[uniqueKey]?.value;
  //       const value =
  //         inputValue !== undefined && inputValue !== ""
  //           ? inputValue
  //           : forecastValue;
  //       return sum + (value && !isNaN(value) ? Number(value) : 0);
  //     }, 0);

  //     // const warningValue = emp.isWarning || emp.emple?.isWarning || false;
  //     // CHECK FOR ANY LOCAL WARNINGS FOR THIS EMPLOYEE
  //   const hasLocalWarning = sortedDurations.some(duration => {
  //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
  //     const warningKey = `${emp.emple.emplId}_${uniqueKey}`;
  //     return localWarnings[warningKey];
  //   });

  //   const warningValue = emp.isWarning || emp.emple?.isWarning || hasLocalWarning || false;

  //     return {
  //       idType:
  //         ID_TYPE_OPTIONS.find(
  //           (opt) => opt.value === (emp.emple.type || "Employee")
  //         )?.label ||
  //         emp.emple.type ||
  //         "Employee",
  //       emplId: emp.emple.emplId,
  //       warning: Boolean(warningValue),

  //       name:
  //         emp.emple.idType === "Vendor"
  //           ? emp.emple.lastName || emp.emple.firstName || "-"
  //           : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
  //             "-",
  //       acctId:
  //         emp.emple.accId ||
  //         (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
  //       orgId: emp.emple.orgId || "-",
  //     //   glcPlc: emp.emple.plcGlcCode || "-",
  //     glcPlc: (() => {
  //   const plcCode = emp.emple.plcGlcCode || "";
  //   if (!plcCode) return "-";

  //   // Try to find the full description from available PLC options
  //   const plcOption = plcOptions.find(option => option.value === plcCode) ||
  //                    updatePlcOptions.find(option => option.value === plcCode);

  //   return plcOption ? plcOption.label : plcCode; // Show full description if found, otherwise just code
  // })(),

  //       isRev: emp.emple.isRev ? (
  //         <span className="text-green-600 font-sm text-lg">✓</span>
  //       ) : (
  //         "-"
  //       ),
  //       isBrd: emp.emple.isBrd ? (
  //         <span className="text-green-600 font-sm text-lg">✓</span>
  //       ) : (
  //         "-"
  //       ),
  //       status: emp.emple.status || "Act",
  //       perHourRate:
  //         emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
  //           ? Number(emp.emple.perHourRate).toFixed(2)
  //           : "0",
  //       total: totalHours.toFixed(2) || "-",
  //     };
  //   };

  // const getEmployeeRow = (emp, idx) => {
  //   if (!emp || !emp.emple) {
  //     return {
  //       idType: "-",
  //       emplId: "-",
  //       name: "-",
  //       acctId: "-",
  //       orgId: "-",
  //       glcPlc: "-",
  //       isRev: "-",
  //       isBrd: "-",
  //       status: "-",
  //       perHourRate: "0",
  //       total: "0",
  //       warning: false,
  //     };
  //   }

  //   const monthHours = getMonthHours(emp);
  //   const totalHours = sortedDurations.reduce((sum, duration) => {
  //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
  //     const inputValue = inputValues[`${idx}_${uniqueKey}`];
  //     const forecastValue = monthHours[uniqueKey]?.value;
  //     const value =
  //       inputValue !== undefined && inputValue !== ""
  //         ? inputValue
  //         : forecastValue;
  //     return sum + (value && !isNaN(value) ? Number(value) : 0);
  //   }, 0);

  //   // CHECK FOR ANY LOCAL WARNINGS FOR THIS SPECIFIC EMPLOYEE + PLC COMBINATION
  //   const plcCode = emp.emple.plcGlcCode || '';
  //   const hasLocalWarning = sortedDurations.some(duration => {
  //     const uniqueKey = `${duration.monthNo}_${duration.year}`;
  //     const warningKey = generateWarningKey(emp.emple.emplId, plcCode, uniqueKey);
  //     return localWarnings[warningKey];
  //   });

  //   const warningValue = emp.isWarning || emp.emple?.isWarning || hasLocalWarning || false;

  //   return {
  //     idType:
  //       ID_TYPE_OPTIONS.find(
  //         (opt) => opt.value === (emp.emple.type || "Employee")
  //       )?.label ||
  //       emp.emple.type ||
  //       "Employee",
  //     emplId: emp.emple.emplId,
  //     warning: Boolean(warningValue), // This will now be PLC-specific

  //     name:
  //       emp.emple.idType === "Vendor"
  //         ? emp.emple.lastName || emp.emple.firstName || "-"
  //         : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
  //           "-",
  //     acctId:
  //       emp.emple.accId ||
  //       (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
  //     orgId: emp.emple.orgId || "-",
  //     glcPlc: (() => {
  //       const plcCode = emp.emple.plcGlcCode || "";
  //       if (!plcCode) return "-";

  //       const plcOption = plcOptions.find(option => option.value === plcCode) ||
  //                        updatePlcOptions.find(option => option.value === plcCode);

  //       return plcOption ? plcOption.label : plcCode;
  //     })(),

  //     isRev: emp.emple.isRev ? (
  //       <span className="text-green-600 font-sm text-lg">✓</span>
  //     ) : (
  //       "-"
  //     ),
  //     isBrd: emp.emple.isBrd ? (
  //       <span className="text-green-600 font-sm text-lg">✓</span>
  //     ) : (
  //       "-"
  //     ),
  //     status: emp.emple.status || "Act",
  //     perHourRate:
  //       emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
  //         ? Number(emp.emple.perHourRate).toFixed(2)
  //         : "0",
  //     total: totalHours.toFixed(2) || "-",
  //   };
  // };

  const getEmployeeRow = (emp, idx) => {
    if (!emp || !emp.emple) {
      return {
        idType: "-",
        emplId: "-",
        name: "-",
        acctId: "-",
        orgId: "-",
        glcPlc: "-",
        isRev: "-",
        isBrd: "-",
        status: "-",
        perHourRate: "0",
        total: "0",
        warning: false,
      };
    }

    const monthHours = getMonthHours(emp);
    const totalHours = sortedDurations.reduce((sum, duration) => {
      const uniqueKey = `${duration.monthNo}_${duration.year}`;
      const inputValue = inputValues[`${idx}_${uniqueKey}`];
      const forecastValue = monthHours[uniqueKey]?.value;
      const value =
        inputValue !== undefined && inputValue !== ""
          ? inputValue
          : forecastValue;
      return sum + (value && !isNaN(value) ? Number(value) : 0);
    }, 0);

    // CHECK FOR ANY LOCAL WARNINGS FOR THIS SPECIFIC EMPLOYEE
    const emplId = emp.emple.emplId;
    const plcCode = emp.emple.plcGlcCode || "";

    // Check hours warnings (existing logic)
    const hasHoursWarning = sortedDurations.some((duration) => {
      const uniqueKey = `${duration.monthNo}_${duration.year}`;
      const warningKey = generateWarningKey(emplId, plcCode, uniqueKey);
      return localWarnings[warningKey];
    });

    // CHECK FOR ACCOUNT/ORG FIELD WARNINGS
    const accountWarningKey = generateFieldWarningKey(
      emplId,
      "account",
      emp.emple.accId
    );
    const orgWarningKey = generateFieldWarningKey(
      emplId,
      "organization",
      emp.emple.orgId
    );
    const hasAccountWarning = localWarnings[accountWarningKey];
    const hasOrgWarning = localWarnings[orgWarningKey];

    // Combine all warning types
    const warningValue =
      emp.isWarning ||
      emp.emple?.isWarning ||
      hasHoursWarning ||
      hasAccountWarning ||
      hasOrgWarning ||
      false;

    return {
      idType:
        ID_TYPE_OPTIONS.find(
          (opt) => opt.value === (emp.emple.type || "Employee")
        )?.label ||
        emp.emple.type ||
        "Employee",
      emplId: emp.emple.emplId,
      warning: Boolean(warningValue), // This will now include all warning types

      name:
        emp.emple.idType === "Vendor"
          ? emp.emple.lastName || emp.emple.firstName || "-"
          : `${emp.emple.firstName || ""} ${emp.emple.lastName || ""}`.trim() ||
            "-",
      acctId:
        emp.emple.accId ||
        (laborAccounts.length > 0 ? laborAccounts[0].id : "-"),
      orgId: emp.emple.orgId || "-",
      glcPlc: (() => {
        const plcCode = emp.emple.plcGlcCode || "";
        if (!plcCode) return "-";

        const plcOption =
          plcOptions.find((option) => option.value === plcCode) ||
          updatePlcOptions.find((option) => option.value === plcCode);

        return plcOption ? plcOption.label : plcCode;
      })(),

      isRev: emp.emple.isRev ? (
        <span className="text-green-600 font-sm text-lg">✓</span>
      ) : (
        "-"
      ),
      isBrd: emp.emple.isBrd ? (
        <span className="text-green-600 font-sm text-lg">✓</span>
      ) : (
        "-"
      ),
      status: emp.emple.status || "Act",
      perHourRate:
        emp.emple.perHourRate !== undefined && emp.emple.perHourRate !== null
          ? Number(emp.emple.perHourRate).toFixed(2)
          : "0",
      total: totalHours.toFixed(2) || "-",
    };
  };

  const getMonthHours = (emp) => {
    const monthHours = {};
    if (emp.emple && Array.isArray(emp.emple.plForecasts)) {
      emp.emple.plForecasts.forEach((forecast) => {
        const uniqueKey = `${forecast.month}_${forecast.year}`;
        const value =
          planType === "EAC" && forecast.actualhours !== undefined
            ? forecast.actualhours
            : forecast.forecastedhours ?? 0;
        monthHours[uniqueKey] = { value, ...forecast };
      });
    }
    return monthHours;
  };

  //   const handleInputChange = (empIdx, uniqueKey, newValue) => {
  //   if (!isEditable) return;
  //   if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
  //     setInputValues((prev) => ({
  //       ...prev,
  //       [`${empIdx}_${uniqueKey}`]: newValue,
  //     }));

  //     // CHECK FOR WARNINGS IMMEDIATELY
  //     const emp = localEmployees[empIdx];
  //     if (emp && emp.emple) {
  //       const warningKey = `${emp.emple.emplId}_${uniqueKey}`;
  //       const hasWarning = checkHoursExceedLimit(empIdx, uniqueKey, newValue);

  //       setLocalWarnings(prev => ({
  //         ...prev,
  //         [warningKey]: hasWarning
  //       }));
  //     }
  //   }
  // };

  const handleInputChange = (empIdx, uniqueKey, newValue) => {
    if (!isEditable) return;
    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      setInputValues((prev) => ({
        ...prev,
        [`${empIdx}_${uniqueKey}`]: newValue,
      }));

      // CHECK FOR WARNINGS IMMEDIATELY WITH PLC-SPECIFIC KEY
      const emp = localEmployees[empIdx];
      if (emp && emp.emple) {
        const plcCode = emp.emple.plcGlcCode || "";
        const warningKey = generateWarningKey(
          emp.emple.emplId,
          plcCode,
          uniqueKey
        );
        const hasWarning = checkHoursExceedLimit(empIdx, uniqueKey, newValue);

        setLocalWarnings((prev) => {
          const updated = { ...prev };
          if (hasWarning) {
            updated[warningKey] = true;
          } else {
            delete updated[warningKey]; // ✅ ADD THIS LINE
          }
          return updated;
        });
      }
    }
  };

  const handleEmployeeDataBlur = async (empIdx, emp) => {
    if (!isEditable || !isBudPlan) return;
    const editedData = editedEmployeeData[empIdx] || {};
    const originalData = getEmployeeRow(emp, empIdx);
    if (
      !editedData ||
      ((editedData.acctId === undefined ||
        editedData.acctId === originalData.acctId) &&
        (editedData.orgId === undefined ||
          editedData.orgId === originalData.orgId) &&
        (editedData.glcPlc === undefined ||
          editedData.glcPlc === originalData.glcPlc) &&
        (editedData.perHourRate === undefined ||
          editedData.perHourRate === originalData.perHourRate) &&
        (editedData.isRev === undefined ||
          editedData.isRev === emp.emple.isRev) &&
        (editedData.isBrd === undefined ||
          editedData.isBrd === emp.emple.isBrd))
    ) {
      return;
    }
    const payload = {
      id: emp.emple.id || 0,
      emplId: emp.emple.emplId,
      firstName: emp.emple.firstName || "",
      lastName: emp.emple.lastName || "",
      type: emp.emple.type || "Employee",
      isRev:
        editedData.isRev !== undefined ? editedData.isRev : emp.emple.isRev,
      isBrd:
        editedData.isBrd !== undefined ? editedData.isBrd : emp.emple.isBrd,
      plcGlcCode: (editedData.glcPlc || emp.emple.plcGlcCode || "")
        .split("-")[0]
        .substring(0, 20),
      perHourRate: Number(editedData.perHourRate || emp.emple.perHourRate || 0),
      status: emp.emple.status || "Act",
      accId:
        editedData.acctId ||
        emp.emple.accId ||
        (laborAccounts.length > 0 ? laborAccounts[0].id : ""),
      orgId: editedData.orgId || emp.emple.orgId || "",
      plId: planId,
      plForecasts: emp.emple.plForecasts || [],
    };

    try {
      await axios.put(`${backendUrl}/Employee/UpdateEmployee`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setEditedEmployeeData((prev) => {
        const newData = { ...prev };
        delete newData[empIdx];
        return newData;
      });
      setLocalEmployees((prev) => {
        const updated = [...prev];
        updated[empIdx] = {
          ...updated[empIdx],
          emple: {
            ...updated[empIdx].emple,
            ...payload,
          },
        };
        return updated;
      });

      toast.success("Employee updated successfully!", {
        toastId: `employee-update-${empIdx}`,
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Failed to update employee:", err);
    }
  };

  const handleForecastHoursBlur = async (empIdx, uniqueKey, value) => {
    if (!isEditable) return;
    const newValue = value === "" ? 0 : Number(value);
    const emp = localEmployees[empIdx];
    const monthHours = getMonthHours(emp);
    const forecast = monthHours[uniqueKey];

    // Check if forecast exists and has required data
    if (!forecast || !forecast.forecastid) {
      console.warn(
        "No forecast data found for this employee/month combination"
      );
      return;
    }

    const originalForecastedHours = forecast?.forecastedhours ?? 0;

    if (newValue === originalForecastedHours) {
      return;
    }

    const currentDuration = sortedDurations.find(
      (d) => `${d.monthNo}_${d.year}` === uniqueKey
    );

    if (!isMonthEditable(currentDuration, closedPeriod, planType)) {
      setInputValues((prev) => ({
        ...prev,
        [`${empIdx}_${uniqueKey}`]: String(originalForecastedHours),
      }));
      toast.warn("Cannot edit hours for a closed period.", {
        toastId: "closed-period-warning",
        autoClose: 3000,
      });
      return;
    }

    // Create payload with safe fallbacks
    const payload = {
      forecastedamt: forecast?.forecastedamt ?? 0,
      forecastid: Number(forecast?.forecastid ?? 0),
      projId: forecast?.projId ?? projectId ?? "",
      plId: forecast?.plId ?? planId ?? 0,
      emplId: forecast?.emplId ?? emp?.emple?.emplId ?? "",
      dctId: forecast?.dctId ?? 0,
      month: forecast?.month ?? currentDuration?.monthNo ?? 0,
      year: forecast?.year ?? currentDuration?.year ?? 0,
      totalBurdenCost: forecast?.totalBurdenCost ?? 0,
      burden: forecast?.burden ?? 0,
      ccffRevenue: forecast?.ccffRevenue ?? 0,
      tnmRevenue: forecast?.tnmRevenue ?? 0,
      cost: forecast?.cost ?? 0,
      fringe: forecast?.fringe ?? 0,
      overhead: forecast?.overhead ?? 0,
      gna: forecast?.gna ?? 0,
      ...(planType === "EAC"
        ? { actualhours: Number(newValue) || 0 }
        : { forecastedhours: Number(newValue) || 0 }),
      createdat: forecast?.createdat ?? new Date().toISOString(),
      updatedat: new Date().toISOString().split("T")[0],
      displayText: forecast?.displayText ?? "",
    };

    try {
      // **KEY CHANGE**: Handle NBBUD by sending "BUD" as the plan type parameter
      const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

      // console.log('Forecast update payload:', payload); // DEBUG LOG
      // console.log('API Plan Type being sent:', apiPlanType); // DEBUG LOG
      // console.log('Original Plan Type:', planType); // DEBUG LOG

      await axios.put(
        `${backendUrl}/Forecast/UpdateForecastHours/${apiPlanType}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Update local state to reflect the change
      setLocalEmployees((prev) => {
        const updated = [...prev];
        if (
          updated[empIdx] &&
          updated[empIdx].emple &&
          updated[empIdx].emple.plForecasts
        ) {
          const forecastIndex = updated[empIdx].emple.plForecasts.findIndex(
            (f) => f.month === payload.month && f.year === payload.year
          );
          if (forecastIndex !== -1) {
            if (planType === "EAC") {
              updated[empIdx].emple.plForecasts[forecastIndex].actualhours =
                newValue;
            } else {
              updated[empIdx].emple.plForecasts[forecastIndex].forecastedhours =
                newValue;
            }
          }
        }
        return updated;
      });

      toast.success("Employee updated successfully!", {
        toastId: `employee-update-${empIdx}`,
        autoClose: 2000,
      });
    } catch (err) {
      // Reset the input value on error
      setInputValues((prev) => ({
        ...prev,
        [`${empIdx}_${uniqueKey}`]: String(originalForecastedHours),
      }));

      console.error("Update forecast error:", err);
      console.error(
        "Failed API Plan Type:",
        planType === "NBBUD" ? "BUD" : planType
      ); // DEBUG LOG

      toast.error(
        "Failed to update forecast: " +
          (err.response?.data?.message || err.message),
        {
          toastId: "forecast-update-error",
          autoClose: 3000,
        }
      );
    }
  };

  const handleAccountInputChangeForUpdate = (value, actualEmpIdx) => {
    handleEmployeeDataChange(actualEmpIdx, "acctId", value);

    // Filter accounts based on input - ensure we're using all available accounts
    if (value.length >= 1) {
      const baseAccounts =
        updateAccountOptions.length > 0 ? updateAccountOptions : laborAccounts;
      const filtered = baseAccounts.filter((acc) =>
        acc.id.toLowerCase().includes(value.toLowerCase())
      );
      // Don't update the state here, just use the filtered results for display
      // The datalist will automatically show filtered options
    } else {
      // When input is empty, ensure all accounts are available
      if (updateAccountOptions.length === 0 && laborAccounts.length > 0) {
        setUpdateAccountOptions(laborAccounts);
      }
    }
  };

  const handleFillValues = async () => {
    if (!showNewForm || !isEditable) return;

    if (new Date(fillEndDate) < new Date(fillStartDate)) {
      toast.error("End Period cannot be before Start Period.");
      return;
    }

    const startDateObj = new Date(fillStartDate);
    const endDateObj = new Date(fillEndDate);

    const newHours = {};

    const isDurationInRange = (duration) => {
      const durationValue = duration.year * 100 + duration.monthNo;
      const startYear = startDateObj.getFullYear();
      const startMonth = startDateObj.getMonth() + 1;
      const startValue = startYear * 100 + startMonth;
      const endYear = endDateObj.getFullYear();
      const endMonth = endDateObj.getMonth() + 1;
      const endValue = endYear * 100 + endMonth;
      return durationValue >= startValue && durationValue <= endValue;
    };

    if (fillMethod === "Copy From Source Record" && sourceRowIndex !== null) {
      const sourceEmp = localEmployees[sourceRowIndex];
      const sourceMonthHours = getMonthHours(sourceEmp);
      sortedDurations.forEach((duration) => {
        if (!isDurationInRange(duration)) return;
        const uniqueKey = `${duration.monthNo}_${duration.year}`;
        if (
          planType === "EAC" &&
          !isMonthEditable(duration, closedPeriod, planType)
        ) {
          newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
        } else {
          newHours[uniqueKey] = sourceMonthHours[uniqueKey]?.value || "0";
        }
      });
    } else if (fillMethod === "Specify Hours") {
      sortedDurations.forEach((duration) => {
        if (!isDurationInRange(duration)) return;
        const uniqueKey = `${duration.monthNo}_${duration.year}`;
        if (
          planType === "EAC" &&
          !isMonthEditable(duration, closedPeriod, planType)
        ) {
          newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
        } else if (isMonthEditable(duration, closedPeriod, planType)) {
          newHours[uniqueKey] = fillHours.toString();
        }
      });
    } else if (fillMethod === "Use Available Hours") {
      try {
        const response = await axios.get(
          `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startDate}/${endDate}`
        );
        const availableHours = response.data.reduce((acc, d) => {
          const uniqueKey = `${d.monthNo}_${d.year}`;
          acc[uniqueKey] = d.workingHours || 0;
          return acc;
        }, {});
        sortedDurations.forEach((duration) => {
          if (!isDurationInRange(duration)) return;
          const uniqueKey = `${duration.monthNo}_${duration.year}`;
          if (
            planType === "EAC" &&
            !isMonthEditable(duration, closedPeriod, planType)
          ) {
            newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
          } else if (isMonthEditable(duration, closedPeriod, planType)) {
            newHours[uniqueKey] = availableHours[uniqueKey] || "0";
          }
        });
      } catch (err) {
        toast.error("Failed to fetch available hours.", {
          toastId: "available-hours-error",
          autoClose: 3000,
        });
        return;
      }
    } else if (
      fillMethod === "Use Start Period Hours" &&
      sortedDurations.length > 0
    ) {
      const firstDuration = sortedDurations[0];
      if (!isDurationInRange(firstDuration)) {
        toast.error(
          "Start Period hours are outside the selected duration range."
        );
        return;
      }
      const firstUniqueKey = `${firstDuration.monthNo}_${firstDuration.year}`;
      const firstValue = newEntryPeriodHours[firstUniqueKey] || "0";
      sortedDurations.forEach((duration) => {
        if (!isDurationInRange(duration)) return;
        const uniqueKey = `${duration.monthNo}_${duration.year}`;
        if (
          planType === "EAC" &&
          !isMonthEditable(duration, closedPeriod, planType)
        ) {
          newHours[uniqueKey] = newEntryPeriodHours[uniqueKey] || "0";
        } else if (isMonthEditable(duration, closedPeriod, planType)) {
          newHours[uniqueKey] = firstValue;
        }
      });
    }

    setNewEntryPeriodHours((prev) => ({ ...prev, ...newHours }));
    setShowFillValues(false);
    setFillMethod("None");
    setFillHours(0.0);
    setSourceRowIndex(null);
  };

  //   const handleSaveNewEntry = async () => {
  //     if (!planId) {
  //       toast.error("Plan ID is required to save a new entry.", {
  //         autoClose: 3000,
  //       });
  //       return;
  //     }

  //     // Check for duplicate employee ID before validating anything else
  //     // const isDuplicate = localEmployees.some(
  //     //   (emp) => emp.emple && emp.emple.emplId === newEntry.id.trim()
  //     // );
  //     // if (isDuplicate) {
  //     //   toast.error(
  //     //     "Can't save entry with existing ID. Please use a different ID.",
  //     //     {
  //     //       toastId: "duplicate-save-error",
  //     //       autoClose: 3000,
  //     //     }
  //     //   );
  //     //   return;
  //     // }

  //     const isDuplicate = localEmployees.some(
  //   (emp) => emp.emple &&
  //     emp.emple.emplId === newEntry.id.trim() &&
  //     emp.emple.plcGlcCode === newEntry.plcGlcCode.trim()
  // );
  // if (isDuplicate) {
  //   toast.error(
  //     "Can't save entry with existing ID and PLC combination. Please use a different ID or PLC.",
  //     {
  //       toastId: "duplicate-save-error",
  //       autoClose: 3000,
  //     }
  //   );
  //   return;
  // }

  //     if (newEntry.idType === "PLC") {
  //       if (!newEntry.id || newEntry.id !== "PLC") {
  //         toast.error("ID must be automatically set to 'PLC' for PLC type.", {
  //           autoClose: 3000,
  //         });
  //         return;
  //       }
  //     } else if (newEntry.idType === "Other") {
  //       // For Other type, just check that it's not empty (no further validation)
  //       if (!newEntry.id.trim()) {
  //         toast.error("ID is required.", { autoClose: 3000 });
  //         return;
  //       }
  //     } else if (newEntry.idType === "Employee" || newEntry.idType === "Vendor") {
  //       if (!newEntry.id.trim()) {
  //         toast.error("ID is required.", { autoClose: 3000 });
  //         return;
  //       }
  //       // Only validate against suggestions if we have them
  //       if (employeeSuggestions.length > 0) {
  //         const validEmployee = employeeSuggestions.find(
  //           (emp) => emp.emplId === newEntry.id.trim()
  //         );
  //         if (!validEmployee) {
  //           toast.error("Please enter a valid ID from the available list.", {
  //             autoClose: 3000,
  //           });
  //           return;
  //         }
  //       }
  //     }

  //     if (!isValidAccount(newEntry.acctId)) {
  //       toast.error("Please enter a valid Account from the available list.", {
  //         autoClose: 3000,
  //       });
  //       return;
  //     }
  //     if (!isValidOrg(newEntry.orgId)) {
  //       toast.error("Organization is required.", { autoClose: 3000 });
  //       return;
  //     }
  //     if (!isValidPlc(newEntry.plcGlcCode)) {
  //       toast.error("Please enter a valid Plc from the available list.", {
  //         autoClose: 3000,
  //       });
  //       return;
  //     }

  //     setIsDurationLoading(true);
  //     const payloadForecasts = durations.map((duration) => ({
  //       forecastedhours:
  //         Number(newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]) ||
  //         0,
  //       projId: projectId,
  //       plId: planId,
  //       emplId: newEntry.id,
  //       month: duration.monthNo,
  //       year: duration.year,
  //       acctId: newEntry.acctId,
  //       orgId: newEntry.orgId,
  //       plc: newEntry.plcGlcCode || "",
  //       hrlyRate: Number(newEntry.perHourRate) || 0,
  //       effectDt: null,
  //       plEmployee: null,
  //     }));
  //     const payload = {
  //       id: 0,
  //       emplId: newEntry.id,
  //       firstName: newEntry.firstName,
  //       lastName: newEntry.lastName,
  //       type: newEntry.idType,
  //       isRev: newEntry.isRev,
  //       isBrd: newEntry.isBrd,
  //       plcGlcCode: (newEntry.plcGlcCode || "").substring(0, 20),
  //       perHourRate: Number(newEntry.perHourRate) || 0,
  //       status: newEntry.status || "Act",
  //       accId: newEntry.acctId,
  //       orgId: newEntry.orgId || "",
  //       plId: planId,
  //       plForecasts: payloadForecasts,
  //     };
  //     try {
  //       await axios.post(
  //         "${backendUrl}/Employee/AddNewEmployee",
  //         payload
  //       );
  //       setSuccessMessageText("Entry saved successfully!");
  //       setShowSuccessMessage(true);
  //       setShowNewForm(false);
  //       setNewEntry({
  //         id: "",
  //         firstName: "",
  //         lastName: "",
  //         isRev: false,
  //         isBrd: false,
  //         idType: "",
  //         acctId: "",
  //         orgId: "",
  //         plcGlcCode: "",
  //         perHourRate: "",
  //         status: "Act",
  //       });
  //       setNewEntryPeriodHours({});
  //       setEmployeeSuggestions([]);
  //       setLaborAccounts([]);
  //       setPlcOptions([]);
  //       setPlcSearch("");
  //       setAutoPopulatedPLC(false);
  //       if (onSaveSuccess) {
  //         onSaveSuccess();
  //       }
  //       fetchEmployees();
  //     } catch (err) {
  //   setSuccessMessageText("Failed to save entry.");
  //   setShowSuccessMessage(true);

  //   // Simple error extraction
  //   let errorMessage = "Failed to save new entry: ";

  //   if (err?.response?.data?.error) {
  //     errorMessage += err.response.data.error;
  //   } else if (err?.response?.data?.message) {
  //     errorMessage += err.response.data.message;
  //   } else if (err?.message) {
  //     errorMessage += err.message;
  //   } else {
  //     errorMessage += "Unknown error occurred";
  //   }

  //   toast.error(errorMessage, {
  //     toastId: "save-entry-error",
  //     autoClose: 5000,
  //   });

  //   // Optional: Log for debugging
  //   console.error("API Error:", err?.response?.data || err);
  // } finally {
  //   setIsDurationLoading(false);
  //   setTimeout(() => setShowSuccessMessage(false), 2000);
  // }
  //   };

  const handleSaveNewEntry = async () => {
    if (!planId) {
      toast.error("Plan ID is required to save a new entry.", {
        autoClose: 3000,
      });
      return;
    }

    // Skip all validations if planType is NBBUD
    if (planType !== "NBBUD") {
      // Check for duplicate employee ID before validating anything else
      const isDuplicate = localEmployees.some(
        (emp) =>
          emp.emple &&
          emp.emple.emplId === newEntry.id.trim() &&
          emp.emple.plcGlcCode === newEntry.plcGlcCode.trim()
      );
      if (isDuplicate) {
        toast.error(
          "Can't save entry with existing ID and PLC combination. Please use a different ID or PLC.",
          {
            toastId: "duplicate-save-error",
            autoClose: 3000,
          }
        );
        return;
      }

      if (newEntry.idType === "PLC") {
        if (!newEntry.id || newEntry.id !== "PLC") {
          toast.error("ID must be automatically set to 'PLC' for PLC type.", {
            autoClose: 3000,
          });
          return;
        }
      } else if (newEntry.idType === "Other") {
        // For Other type, just check that it's not empty (no further validation)
        if (!newEntry.id.trim()) {
          toast.error("ID is required.", { autoClose: 3000 });
          return;
        }
      } else if (
        newEntry.idType === "Employee" ||
        newEntry.idType === "Vendor"
      ) {
        if (!newEntry.id.trim()) {
          toast.error("ID is required.", { autoClose: 3000 });
          return;
        }
        // Only validate against suggestions if we have them
        if (employeeSuggestions.length > 0) {
          const validEmployee = employeeSuggestions.find(
            (emp) => emp.emplId === newEntry.id.trim()
          );
          if (!validEmployee) {
            toast.error("Please enter a valid ID from the available list.", {
              autoClose: 3000,
            });
            return;
          }
        }
      }

      if (!isValidAccount(newEntry.acctId)) {
        toast.error("Please enter a valid Account from the available list.", {
          autoClose: 3000,
        });
        return;
      }
      if (!isValidOrg(newEntry.orgId)) {
        toast.error("Organization is required.", { autoClose: 3000 });
        return;
      }
      if (!isValidPlc(newEntry.plcGlcCode)) {
        toast.error("Please enter a valid Plc from the available list.", {
          autoClose: 3000,
        });
        return;
      }
    }

    setIsDurationLoading(true);
    const payloadForecasts = durations.map((duration) => ({
      // forecastedhours:
      //   Number(newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]) ||
      //   0,
      ...(planType === "EAC"
        ? {
            actualhours:
              Number(
                newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]
              ) || 0,
          }
        : {
            forecastedhours:
              Number(
                newEntryPeriodHours[`${duration.monthNo}_${duration.year}`]
              ) || 0,
          }),
      projId: projectId,
      plId: planId,
      emplId: newEntry.id,
      month: duration.monthNo,
      year: duration.year,
      acctId: newEntry.acctId,
      orgId: newEntry.orgId,
      plc: newEntry.plcGlcCode || "",
      hrlyRate: Number(newEntry.perHourRate) || 0,
      effectDt: null,
      plEmployee: null,
    }));

    const payload = {
      id: 0,
      emplId: newEntry.id,
      firstName: newEntry.firstName,
      lastName: newEntry.lastName,
      type: newEntry.idType,
      isRev: newEntry.isRev,
      isBrd: newEntry.isBrd,
      plcGlcCode: (newEntry.plcGlcCode || "").substring(0, 20),
      perHourRate: Number(newEntry.perHourRate) || 0,
      status: newEntry.status || "Act",
      accId: newEntry.acctId,
      orgId: newEntry.orgId || "",
      plId: planId,
      plForecasts: payloadForecasts,
    };

    try {
      await axios.post(`${backendUrl}/Employee/AddNewEmployee`, payload);
      setSuccessMessageText("Entry saved successfully!");
      setShowSuccessMessage(true);
      setShowNewForm(false);
      setNewEntry({
        id: "",
        firstName: "",
        lastName: "",
        isRev: false,
        isBrd: false,
        idType: "",
        acctId: "",
        orgId: "",
        plcGlcCode: "",
        perHourRate: "",
        status: "Act",
      });
      setNewEntryPeriodHours({});
      setEmployeeSuggestions([]);
      setLaborAccounts([]);
      setPlcOptions([]);
      setPlcSearch("");
      setAutoPopulatedPLC(false);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      fetchEmployees();
    } catch (err) {
      setSuccessMessageText("Failed to save entry.");
      setShowSuccessMessage(true);

      // Simple error extraction
      let errorMessage = "Failed to save new entry: ";

      if (err?.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err?.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Unknown error occurred";
      }

      toast.error(errorMessage, {
        toastId: "save-entry-error",
        autoClose: 5000,
      });

      // Optional: Log for debugging
      console.error("API Error:", err?.response?.data || err);
    } finally {
      setIsDurationLoading(false);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }
  };

  const handleFindReplace = async () => {
    if (
      !isEditable ||
      findValue === "" ||
      (replaceScope === "row" && selectedRowIndex === null) ||
      (replaceScope === "column" && selectedColumnKey === null)
    ) {
      toast.warn("Please select a valid scope and enter a value to find.", {
        toastId: "find-replace-warning",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    const updates = [];
    const updatedInputValues = { ...inputValues };
    let replacementsCount = 0;
    let skippedCount = 0;

    for (const empIdx in localEmployees) {
      const emp = localEmployees[empIdx];
      const actualEmpIdx = parseInt(empIdx, 10);

      if (replaceScope === "row" && actualEmpIdx !== selectedRowIndex) {
        continue;
      }

      for (const duration of sortedDurations) {
        const uniqueKey = `${duration.monthNo}_${duration.year}`;

        if (replaceScope === "column" && uniqueKey !== selectedColumnKey) {
          continue;
        }

        if (!isMonthEditable(duration, closedPeriod, planType)) {
          continue;
        }

        const currentInputKey = `${actualEmpIdx}_${uniqueKey}`;
        let displayedValue;
        if (inputValues[currentInputKey] !== undefined) {
          displayedValue = String(inputValues[currentInputKey]);
        } else {
          const monthHours = getMonthHours(emp);
          const forecast = monthHours[uniqueKey];
          if (forecast && forecast.value !== undefined) {
            displayedValue = String(forecast.value);
          } else {
            displayedValue = "0";
          }
        }

        const findValueTrimmed = findValue.trim();
        const displayedValueTrimmed = displayedValue.trim();

        function isZeroLike(val) {
          if (val === undefined || val === null) return true;
          if (typeof val === "number") return val === 0;
          if (typeof val === "string") {
            const trimmed = val.trim();
            return (
              trimmed === "" ||
              trimmed === "0" ||
              trimmed === "0.0" ||
              trimmed === "0.00" ||
              (!isNaN(Number(trimmed)) && Number(trimmed) === 0)
            );
          }
          return false;
        }

        let isMatch = false;
        if (
          !isNaN(Number(findValueTrimmed)) &&
          Number(findValueTrimmed) === 0
        ) {
          isMatch = isZeroLike(displayedValueTrimmed);
        } else {
          isMatch = displayedValueTrimmed === findValueTrimmed;
          if (!isMatch) {
            const findNum = parseFloat(findValueTrimmed);
            const displayNum = parseFloat(displayedValueTrimmed);
            if (!isNaN(findNum) && !isNaN(displayNum)) {
              isMatch = findNum === displayNum;
            }
          }
        }

        if (isMatch) {
          const newValue = replaceValue.trim();
          const newNumericValue =
            newValue === "" ? 0 : parseFloat(newValue) || 0;
          const forecast = getMonthHours(emp)[uniqueKey];

          if (forecast && forecast.forecastid) {
            if (displayedValueTrimmed !== newValue) {
              updatedInputValues[currentInputKey] = newValue;
              replacementsCount++;
              const payload = {
                forecastedamt: forecast.forecastedamt ?? 0,
                forecastid: Number(forecast.forecastid),
                projId: forecast.projId,
                plId: forecast.plId,
                emplId: forecast.emplId,
                dctId: forecast.dctId ?? 0,
                month: forecast.month,
                year: forecast.year,
                totalBurdenCost: forecast.totalBurdenCost ?? 0,
                burden: forecast.burden ?? 0,
                ccffRevenue: forecast.ccffRevenue ?? 0,
                tnmRevenue: forecast.tnmRevenue ?? 0,
                cost: forecast.cost ?? 0,
                fringe: forecast.fringe ?? 0,
                overhead: forecast.overhead ?? 0,
                gna: forecast.gna ?? 0,
                [planType === "EAC" ? "actualhours" : "forecastedhours"]:
                  newNumericValue,
                updatedat: new Date().toISOString().split("T")[0],
                displayText: forecast.displayText ?? "",
              };

              const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

              updates.push(
                axios
                  .put(
                    `${backendUrl}/Forecast/UpdateForecastHours/${apiPlanType}`,
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                  )
                  .catch((err) => {
                    console.error(
                      "Failed update for payload:",
                      payload,
                      err?.response?.data || err.message
                    );
                  })
              );
            }
          } else {
            // console.log(
            //   `Skipping cell without forecast: employee ${emp.emple?.emplId} for ${duration.monthNo}/${duration.year}`
            // );
            skippedCount++;
          }
        }
      }
    }

    // console.log(
    //   `Total replacements to make: ${replacementsCount}, Skipped: ${skippedCount}`
    // );

    setInputValues(updatedInputValues);
    try {
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      setLocalEmployees((prev) => {
        const updated = [...prev];
        for (const empIdx in updated) {
          const emp = updated[empIdx];
          for (const duration of sortedDurations) {
            const uniqueKey = `${duration.monthNo}_${duration.year}`;
            const currentInputKey = `${empIdx}_${uniqueKey}`;
            if (updatedInputValues[currentInputKey] !== undefined) {
              if (emp.emple && Array.isArray(emp.emple.plForecasts)) {
                const forecast = emp.emple.plForecasts.find(
                  (f) =>
                    f.month === duration.monthNo && f.year === duration.year
                );
                if (forecast) {
                  const newValue =
                    parseFloat(updatedInputValues[currentInputKey]) || 0;
                  if (planType === "EAC") {
                    forecast.actualhours = newValue;
                  } else {
                    forecast.forecastedhours = newValue;
                  }
                }
              }
            }
          }
        }
        return updated;
      });

      if (replacementsCount > 0) {
        toast.success(`Successfully replaced ${replacementsCount} cells.`, {
          autoClose: 2000,
        });
      }

      if (replacementsCount === 0 && skippedCount === 0) {
        toast.info("No cells replaced.", { autoClose: 2000 });
      }
    } catch (err) {
      toast.error(
        "Failed to replace values: " +
          (err.response?.data?.message || err.message),
        {
          toastId: "replace-error",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
      setShowFindReplace(false);
      setFindValue("");
      setReplaceValue("");
      setSelectedRowIndex(null);
      setSelectedColumnKey(null);
      setReplaceScope("all");
    }
  };

  const handleRowClick = (actualEmpIdx) => {
    if (!isEditable) return;
    setSelectedRowIndex(
      actualEmpIdx === selectedRowIndex ? null : actualEmpIdx
    );
    setSelectedEmployeeId(localEmployees[actualEmpIdx]?.emple_Id);
    setSelectedColumnKey(null);
    setReplaceScope(actualEmpIdx === selectedRowIndex ? "all" : "row");
    if (showNewForm) setSourceRowIndex(actualEmpIdx);
  };

  // handle delete employee here
  const handleDeleteEmployee = async (emple_Id) => {
    if (!emple_Id) return;

    try {
      await axios.delete(`${backendUrl}/Employee/DeleteEmployee/${emple_Id}`);

      toast.success("Employee deleted successfully!");

      // Remove deleted employee from local state
      setLocalEmployees((prev) =>
        prev.filter((emp) => emp.emple_Id !== emple_Id)
      );
    } catch (err) {
      toast.error(
        "Failed to delete employee: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleColumnHeaderClick = (uniqueKey) => {
    if (!isEditable) return;
    setSelectedColumnKey(uniqueKey === selectedColumnKey ? null : uniqueKey);
    setSelectedRowIndex(null);
    setReplaceScope(uniqueKey === selectedColumnKey ? "all" : "column");
  };

  const hasHiddenRows = Object.values(hiddenRows).some(Boolean);
  const showHiddenRows = () => setHiddenRows({});

  const sortedDurations = [...durations]
    .filter((d) => fiscalYear === "All" || d.year === parseInt(fiscalYear))
    .sort(
      (a, b) =>
        new Date(a.year, a.monthNo - 1, 1) - new Date(b.year, b.monthNo - 1, 1)
    );

  const handleWarningClick = (e, emplId) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedEmployeeIdForWarning(emplId);
    setShowWarningPopup(true);
  };

  const checkHoursExceedLimit = (empIdx, uniqueKey, hours) => {
    const duration = sortedDurations.find(
      (d) => `${d.monthNo}_${d.year}` === uniqueKey
    );
    if (!duration || !duration.workingHours) return false;

    const numericHours = parseFloat(hours) || 0;
    return numericHours > duration.workingHours;
  };

  const generateWarningKey = (emplId, plcCode, uniqueKey) => {
    return `${emplId}_${plcCode || "NOPLC"}_${uniqueKey}`;
  };

  const generateFieldWarningKey = (emplId, field, value) => {
    return `${emplId}_${field}_${value || "empty"}`;
  };

  const checkAccountInvalid = (value, updateOptions) => {
    if (planType === "NBBUD") return false; // No warnings for NBBUD
    if (!value || value.trim() === "") return true; // Empty is invalid
    return !updateOptions.some((opt) => opt.id === value.trim());
  };

  const checkOrgInvalid = (value, updateOptions) => {
    if (planType === "NBBUD") return false; // No warnings for NBBUD
    if (!value || value.trim() === "") return true; // Empty is invalid
    const trimmed = value.toString().trim();
    if (!/^[\d.]+$/.test(trimmed)) return true; // Not numeric
    return !updateOptions.some((opt) => opt.value.toString() === trimmed);
  };

  if (isLoading || isDurationLoading) {
    return (
      <div className="p-4 font-inter flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-xs text-gray-600">
          Loading forecast data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 font-inter">
        <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded">
          <strong className="font-bold text-xs">Error: </strong>
          <span className="block sm:inline text-xs">{error}</span>
        </div>
      </div>
    );
  }

  const rowCount = Math.max(
    localEmployees.filter((_, idx) => !hiddenRows[idx]).length +
      (showNewForm ? 1 : 0),
    2
  );

  return (
    <div className="relative p-4 font-inter w-full synchronized-tables-outer">
      {showSuccessMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            successMessageText.includes("successfully") ||
            successMessageText.includes("Replaced")
              ? "bg-green-500"
              : "bg-red-500"
          } text-white text-xs`}
        >
          {successMessageText}
        </div>
      )}

      <div className="w-full flex justify-between mb-4 gap-2">
        <div className="flex-grow"></div>
        <div className="flex gap-2 ">
          {hasHiddenRows && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
              onClick={showHiddenRows}
            >
              Show Hidden Rows
            </button>
          )}
          {isEditable && (
            <>
              {/* <button
                onClick={() => setShowNewForm((prev) => !prev)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
              >
                {showNewForm ? "Cancel" : "New"}
              </button> */}
              <button
                onClick={() => {
                  if (showNewForm) {
                    // Reset all form fields when canceling
                    setNewEntry({
                      id: "",
                      firstName: "",
                      lastName: "",
                      isRev: false,
                      isBrd: false,
                      idType: "",
                      acctId: "",
                      orgId: "",
                      plcGlcCode: "",
                      perHourRate: "",
                      status: "Act",
                    });
                    setNewEntryPeriodHours({});
                    setEmployeeSuggestions([]);
                    setLaborAccounts([]);
                    setPlcOptions([]);
                    setFilteredPlcOptions([]);
                    setPlcSearch("");
                    setOrgSearch("");
                    setAutoPopulatedPLC(false);
                    setShowNewForm(false);
                  } else {
                    setShowNewForm(true);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
              >
                {showNewForm ? "Cancel" : "New"}
              </button>

              {!showNewForm && (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                    onClick={() => isEditable && setShowFindReplace(true)}
                  >
                    Find / Replace
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-medium"
                    onClick={() => {
                      if (!selectedEmployeeId) {
                        toast.error("Please select an employee to delete");
                        return;
                      }
                      if (
                        window.confirm(
                          "Are you sure you want to delete this employee?"
                        )
                      ) {
                        handleDeleteEmployee(selectedEmployeeId);
                        setSelectedEmployeeId(null); // optional: clear selection
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
              {showNewForm && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                  onClick={() => isEditable && setShowFillValues(true)}
                >
                  Fill Values
                </button>
              )}
            </>
          )}

          {showNewForm && (
            <button
              onClick={handleSaveNewEntry}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
            >
              Save Entry
            </button>
          )}
        </div>
      </div>

      {showFillValues && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-sm">
            <h3 className="text-lg font-semibold mb-4">
              Fill Values to selected record/s
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Select Fill Method
              </label>
              <select
                value={fillMethod}
                onChange={(e) => setFillMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-xs"
              >
                <option value="None">None</option>
                <option value="Copy From Source Record">
                  Copy from source record
                </option>
                <option value="Specify Hours">Specify Hours</option>
                <option value="Use Available Hours">Use Available Hours</option>
                <option value="Use Start Period Hours">
                  Use Start Period Hours
                </option>
              </select>
            </div>
            {fillMethod === "Specify Hours" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-xs font-medium mb-1">
                  Hours
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={fillHours}
                  onChange={(e) =>
                    setFillHours(parseFloat(e.target.value) || 0)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      (e.target.value === "0" || e.target.value === "")
                    ) {
                      e.preventDefault();
                      setFillHours("");
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 text-xs"
                  placeholder="0.00"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Start Period
              </label>
              <input
                type="date"
                value={fillStartDate}
                onChange={(e) => setFillStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-xs"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-medium mb-1">
                End Period
              </label>
              <input
                type="date"
                value={fillEndDate}
                onChange={(e) => setFillEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-xs"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowFillValues(false);
                  setFillMethod("None");
                  setFillHours(0.0);
                  setSourceRowIndex(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleFillValues}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
              >
                Fill
              </button>
            </div>
          </div>
        </div>
      )}

      {localEmployees.length === 0 &&
      !showNewForm &&
      sortedDurations.length > 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-xs">
          No forecast data available for this plan.
        </div>
      ) : (
         
          <div className="synchronized-tables-container flex">
            <div
            ref={firstTableRef}
            onScroll={handleFirstScroll}
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowY: "hidden", // show scrollbar
              overflowX: "auto",
            }}
          >
              <table className="table-fixed text-xs text-left min-w-max border border-gray-300 rounded-lg">
                <thead className="sticky-thead">
                  <tr
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT}px`,
                      lineHeight: "normal",
                    }}
                  >
                    {EMPLOYEE_COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className="p-1.5 border border-gray-200 whitespace-nowrap text-xs text-gray-900 font-normal min-w-[70px]"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {showNewForm && (
                    <tr
                      key="new-entry"
                      className="bg-gray-50"
                      style={{
                        height: `${ROW_HEIGHT_DEFAULT}px`,
                        lineHeight: "normal",
                      }}
                    >
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <select
                          name="idType"
                          value={newEntry.idType || ""}
                          onChange={(e) => handleIdTypeChange(e.target.value)}
                          className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                        >
                          {ID_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="id"
                          value={newEntry.id}
                          onChange={(e) => handleIdChange(e.target.value)}
                          disabled={newEntry.idType === "PLC"}
                          className={`w-full rounded px-1 py-0.5 text-xs outline-none focus:ring-0 no-datalist-border ${
                            newEntry.idType === "PLC"
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          list={
                            planType === "NBBUD"
                              ? undefined
                              : "employee-id-list"
                          }
                          placeholder={
                            newEntry.idType === "PLC"
                              ? "Not required for PLC"
                              : "Enter ID"
                          }
                        />
                        {/* <datalist id="employee-id-list">
                          {employeeSuggestions
                            .filter(
                              (emp) =>
                                emp.emplId && typeof emp.emplId === "string"
                            )
                            .map((emp, index) => (
                              <option
                                key={`${emp.emplId}-${index}`}
                                value={emp.emplId}
                              >
                                {emp.lastName && emp.firstName
                                  ? `${emp.lastName}, ${emp.firstName}`
                                  : emp.lastName || emp.firstName || emp.emplId}
                              </option>
                            ))}
                        </datalist> */}
                        <datalist id="employee-id-list">
                          {newEntry.idType !== "Other" &&
                            employeeSuggestions
                              .filter(
                                (emp) =>
                                  emp.emplId && typeof emp.emplId === "string"
                              )
                              .map((emp, index) => (
                                <option
                                  key={`${emp.emplId}-${index}`}
                                  value={emp.emplId}
                                >
                                  {emp.lastName && emp.firstName
                                    ? `${emp.lastName}, ${emp.firstName}`
                                    : emp.lastName ||
                                      emp.firstName ||
                                      emp.emplId}
                                </option>
                              ))}
                        </datalist>
                      </td>

                      <td className="border border-gray-300 px-1.5 py-0.5 text-center">
                        <span className="text-gray-400 text-xs">-</span>
                      </td>
                      {/* <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="name"
                          value={
                            newEntry.idType === "Vendor"
                              ? newEntry.lastName || newEntry.firstName || ""
                              : newEntry.lastName && newEntry.firstName
                              ? `${newEntry.lastName}, ${newEntry.firstName}`
                              : newEntry.lastName || newEntry.firstName || ""
                          }
                          readOnly
                          className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs bg-gray-100 cursor-not-allowed"
                          placeholder="Name (auto-filled)"
                        />
                      </td> */}
                      {/* <td className="border border-gray-300 px-1.5 py-0.5">
  <input
    type="text"
    name="name"
    value={
      newEntry.idType === "Other" || planType === "NBBUD"
        ? `${newEntry.firstName || ""} ${newEntry.lastName || ""}`.trim()
        : newEntry.idType === "Vendor"
        ? newEntry.lastName || newEntry.firstName || ""
        : newEntry.lastName && newEntry.firstName
        ? `${newEntry.lastName}, ${newEntry.firstName}`
        : newEntry.lastName || newEntry.firstName || ""
    }
    readOnly={planType !== "NBBUD" && newEntry.idType !== "Other"}
    onChange={(e) => {
      if (newEntry.idType === "Other" || planType === "NBBUD") {
        const fullName = e.target.value.trim();
        // Split name into first and last (assuming format: "First Last")
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        setNewEntry(prev => ({
          ...prev,
          firstName: firstName,
          lastName: lastName
        }));
      }
    }}
    className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
      newEntry.idType === "Other"  || planType === "NBBUD"
        ? "bg-white" 
        : "bg-gray-100 cursor-not-allowed"
    }`}
    placeholder={
      newEntry.idType === "Other" || planType === "NBBUD" 
        ? "Enter name" 
        : "Name (auto-filled)"
    }
  />
</td> */}
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        {newEntry.idType === "PLC" ? (
                          // PLC Name field - automatically show selected PLC description
                          <input
                            type="text"
                            name="name"
                            value={newEntry.firstName || ""} // This will contain the PLC description
                            readOnly
                            className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs bg-gray-100 cursor-not-allowed"
                            // placeholder="PLC description will appear here"
                          />
                        ) : (
                          // Existing logic for other ID types
                          <input
                            type="text"
                            name="name"
                            value={
                              newEntry.idType === "Other" ||
                              planType === "NBBUD"
                                ? `${newEntry.firstName || ""} ${
                                    newEntry.lastName || ""
                                  }`.trim()
                                : newEntry.idType === "Vendor"
                                ? newEntry.lastName || newEntry.firstName || ""
                                : newEntry.lastName && newEntry.firstName
                                ? `${newEntry.lastName}, ${newEntry.firstName}`
                                : newEntry.lastName || newEntry.firstName || ""
                            }
                            readOnly={
                              planType !== "NBBUD" &&
                              newEntry.idType !== "Other"
                            }
                            onChange={(e) => {
                              if (
                                newEntry.idType === "Other" ||
                                planType === "NBBUD"
                              ) {
                                const fullName = e.target.value.trim();
                                const nameParts = fullName.split(" ");
                                const firstName = nameParts[0] || "";
                                const lastName =
                                  nameParts.slice(1).join(" ") || "";

                                setNewEntry((prev) => ({
                                  ...prev,
                                  firstName: firstName,
                                  lastName: lastName,
                                }));
                              }
                            }}
                            className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                              newEntry.idType === "Other" ||
                              planType === "NBBUD"
                                ? "bg-white"
                                : "bg-gray-100 cursor-not-allowed"
                            }`}
                            placeholder={
                              newEntry.idType === "Other" ||
                              planType === "NBBUD"
                                ? "Enter name"
                                : "Name (auto-filled)"
                            }
                          />
                        )}
                      </td>

                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="acctId"
                          value={newEntry.acctId}
                          onChange={(e) => handleAccountChange(e.target.value)}
                          onBlur={(e) => handleAccountBlur(e.target.value)}
                          className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                            !isFieldEditable
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          list="account-list"
                          placeholder="Enter Account"
                          //   disabled={!isBudPlan}
                          disabled={!isFieldEditable}
                        />
                        <datalist id="account-list">
                          {laborAccounts.map((account, index) => (
                            <option
                              key={`${account.id}-${index}`}
                              value={account.id}
                            >
                              {account.id}
                            </option>
                          ))}
                        </datalist>
                      </td>
                      {/* <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="orgId"
                          value={newEntry.orgId}
                          onChange={(e) => handleOrgChange(e.target.value)}
                          onBlur={(e) => handleOrgBlur(e.target.value)}
                          className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                            !isBudPlan ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          placeholder="Enter Organization"
                          disabled={!isBudPlan}
                        />
                      </td> */}
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="orgId"
                          value={newEntry.orgId}
                          onChange={(e) => handleOrgInputChange(e.target.value)}
                          onBlur={(e) => handleOrgBlur(e.target.value)}
                          className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                            !isFieldEditable
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          list="organization-list"
                          placeholder="Enter Organization ID (numeric)"
                          // disabled={!isBudPlan}
                          disabled={!isFieldEditable}
                        />
                        <datalist id="organization-list">
                          {organizationOptions.map((org, index) => (
                            <option
                              key={`${org.value}-${index}`}
                              value={org.value}
                            >
                              {org.label}
                            </option>
                          ))}
                        </datalist>
                      </td>

                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="plcGlcCode"
                          value={newEntry.plcGlcCode}
                          onChange={(e) => {
                            if (newEntry.idType === "PLC") {
                              // For PLC type, auto-populate the name field with PLC description
                              const selectedPlc = plcOptions.find(
                                (plc) => plc.value === e.target.value
                              );
                              handlePlcInputChange(e.target.value);

                              // Automatically set the firstName to the full PLC description
                              if (selectedPlc) {
                                const description =
                                  selectedPlc.label.split(" - ")[1] ||
                                  selectedPlc.label;

                                setNewEntry((prev) => ({
                                  ...prev,
                                  firstName: description, // Store full description in firstName
                                  lastName: "", // Clear lastName for PLC
                                }));
                              }
                            } else {
                              handlePlcInputChange(e.target.value);
                            }
                          }}
                          onBlur={(e) => handlePlcBlur(e.target.value)}
                          className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                            autoPopulatedPLC
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          list="plc-list"
                          placeholder="Enter Plc"
                        />
                        <datalist id="plc-list">
                          {filteredPlcOptions.map((plc, index) => (
                            <option
                              key={`${plc.value}-${index}`}
                              value={plc.value}
                            >
                              {plc.label}
                            </option>
                          ))}
                        </datalist>
                      </td>

                      <td className="border border-gray-300 px-1.5 py-0.5 text-center">
                        <input
                          type="checkbox"
                          name="isRev"
                          checked={newEntry.isRev}
                          //   onChange={(e) =>
                          //     isBudPlan &&
                          //     setNewEntry({
                          //       ...newEntry,
                          //       isRev: e.target.checked,
                          //     })
                          //   }
                          // CHANGE TO:
                          onChange={(e) =>
                            isFieldEditable &&
                            setNewEntry({
                              ...newEntry,
                              isRev: e.target.checked,
                            })
                          }
                          disabled={!isFieldEditable}
                        />
                      </td>
                      <td className="border border-gray-300 px-1.5 py-0.5 text-center">
                        <input
                          type="checkbox"
                          name="isBrd"
                          checked={newEntry.isBrd}
                          //   onChange={(e) =>
                          //     isBudPlan &&
                          //     setNewEntry({
                          //       ...newEntry,
                          //       isBrd: e.target.checked,
                          //     })
                          //   }
                          //   className="w-4 h-4"
                          //   disabled={!isBudPlan}
                          // CHANGE TO:
                          onChange={(e) =>
                            isFieldEditable &&
                            setNewEntry({
                              ...newEntry,
                              isBrd: e.target.checked,
                            })
                          }
                          disabled={!isFieldEditable}
                        />
                      </td>
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="status"
                          value={newEntry.status}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, status: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                          placeholder="Enter Status"
                        />
                      </td>
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        <input
                          type="text"
                          name="perHourRate"
                          value={newEntry.perHourRate}
                          //   onChange={(e) =>
                          //     isBudPlan &&
                          //     setNewEntry({
                          //       ...newEntry,
                          //       perHourRate: e.target.value.replace(
                          //         /[^0-9.]/g,
                          //         ""
                          //       ),
                          //     })
                          //   }
                          //   className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                          //     !isBudPlan ? "bg-gray-100 cursor-not-allowed" : ""
                          //   }`}
                          //   placeholder="Enter Hour Rate"
                          //   disabled={!isBudPlan}
                          // CHANGE TO:
                          onChange={(e) =>
                            isFieldEditable &&
                            setNewEntry({
                              ...newEntry,
                              perHourRate: e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              ),
                            })
                          }
                          className={`w-full border border-gray-300 rounded px-1 py-0.5 text-xs ${
                            !isFieldEditable
                              ? "bg-gray-100 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={!isFieldEditable}
                        />
                      </td>
                      <td className="border border-gray-300 px-1.5 py-0.5">
                        {Object.values(newEntryPeriodHours)
                          .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {localEmployees
                    .filter((_, idx) => !hiddenRows[idx])
                    .map((emp, idx) => {
                      const actualEmpIdx = localEmployees.findIndex(
                        (e) => e === emp
                      );
                      const row = getEmployeeRow(emp, actualEmpIdx);
                      const editedData = editedEmployeeData[actualEmpIdx] || {};
                      return (
                        <tr
                          key={`employee-${actualEmpIdx}`}
                          className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
                            selectedRowIndex === actualEmpIdx
                              ? "bg-yellow-100"
                              : "even:bg-gray-50"
                          }`}
                          style={{
                            height: `${ROW_HEIGHT_DEFAULT}px`,
                            lineHeight: "normal",
                            cursor: isEditable ? "pointer" : "default",
                          }}
                          onClick={() => handleRowClick(actualEmpIdx)}
                        >
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {row.idType}
                          </td>
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {row.emplId}
                          </td>
                          {/* ADD THIS WARNING CELL */}
                          {/* <td className="p-1.5 border-r border-gray-200 text-xs text-center min-w-[70px]">
  {row.warning ? (
    <span className="text-yellow-500 text-lg" title="Warning">
      ⚠️
    </span>
  ) : (
    <span className="text-gray-300 text-xs">-</span>
  )}
</td> */}
                          {/* UPDATE THIS WARNING CELL */}
                          <td className="p-1.5 border-r border-gray-200 text-xs text-center min-w-[70px]">
                            {row.warning ? (
                              <span
                                className="text-yellow-500 text-lg cursor-pointer hover:text-yellow-600"
                                title="Click to view warnings"
                                onClick={(e) =>
                                  handleWarningClick(e, row.emplId)
                                }
                              >
                                ⚠️
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">-</span>
                            )}
                          </td>

                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {row.name}
                          </td>

                          {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
  {isBudPlan && isEditable ? (
    <input
      type="text"
      value={
        editedData.acctId !== undefined
          ? editedData.acctId
          : row.acctId
      }
      onChange={(e) => handleAccountInputChangeForUpdate(e.target.value, actualEmpIdx)}
      onBlur={() => handleEmployeeDataBlur(actualEmpIdx, emp)}
      className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
      list={`account-list-${actualEmpIdx}`}
      placeholder="Enter Account"
    />
  ) : (
    row.acctId
  )}
  <datalist id={`account-list-${actualEmpIdx}`}>
    {updateAccountOptions.map((account, index) => (
      <option
        key={`${account.id}-${index}`}
        value={account.id}
      >
        {account.id}
      </option>
    ))}
  </datalist>
</td> */}

                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isFieldEditable && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.acctId !== undefined
                                    ? editedData.acctId
                                    : row.acctId
                                }
                                onChange={(e) =>
                                  handleAccountInputChangeForUpdate(
                                    e.target.value,
                                    actualEmpIdx
                                  )
                                }
                                onBlur={(e) => {
                                  if (planType === "NBBUD") return; // Add this line
                                  const val = e.target.value;
                                  const originalValue = row.acctId;

                                  if (
                                    val !== originalValue &&
                                    !isValidAccountForUpdate(
                                      val,
                                      updateAccountOptions
                                    )
                                  ) {
                                    toast.error(
                                      "Please enter a valid Account from the available list.",
                                      {
                                        autoClose: 3000,
                                      }
                                    );
                                  } else {
                                    handleEmployeeDataBlur(actualEmpIdx, emp);
                                  }
                                }}
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                list={`account-list-${actualEmpIdx}`}
                                placeholder="Enter Account"
                              />
                            ) : (
                              row.acctId
                            )}
                            <datalist id={`account-list-${actualEmpIdx}`}>
                              {updateAccountOptions.map((account, index) => (
                                <option
                                  key={`${account.id}-${index}`}
                                  value={account.id}
                                >
                                  {account.id}
                                </option>
                              ))}
                            </datalist>
                          </td>

                          {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isBudPlan && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.acctId !== undefined
                                    ? editedData.acctId
                                    : row.acctId
                                }
                                onChange={(e) =>
                                  handleEmployeeDataChange(
                                    actualEmpIdx,
                                    "acctId",
                                    e.target.value
                                  )
                                }
                                onBlur={() =>
                                  handleEmployeeDataBlur(actualEmpIdx, emp)
                                }
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                list="account-list"
                              />
                            ) : (
                              row.acctId
                            )}
                          </td> */}

                          {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isBudPlan && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.orgId !== undefined
                                    ? editedData.orgId
                                    : row.orgId
                                }
                                onChange={(e) =>
                                  handleEmployeeDataChange(
                                    actualEmpIdx,
                                    "orgId",
                                    e.target.value
                                  )
                                }
                                onBlur={() =>
                                  handleEmployeeDataBlur(actualEmpIdx, emp)
                                }
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                              />
                            ) : (
                              row.orgId
                            )}
                          </td> */}
                          {/* <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
  {isBudPlan && isEditable ? (
    <input
      type="text"
      value={
        editedData.orgId !== undefined
          ? editedData.orgId
          : row.orgId
      }
      onChange={(e) => handleOrgInputChangeForUpdate(e.target.value, actualEmpIdx)}
      onBlur={(e) => {
        const val = e.target.value;
        if (val && val.length >= 3 && !isValidOrg(val)) {
          toast.error("Please enter a valid numeric Organization ID from the available list.", {
            autoClose: 3000,
          });
          handleEmployeeDataChange(actualEmpIdx, "orgId", "");
        } else {
          handleEmployeeDataBlur(actualEmpIdx, emp);
        }
      }}
      className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
      list="organization-list"
      placeholder="Enter Organization ID"
    />
  ) : (
    row.orgId
  )}
</td> */}

                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isBudPlan && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.orgId !== undefined
                                    ? editedData.orgId
                                    : row.orgId
                                }
                                onChange={(e) =>
                                  handleOrgInputChangeForUpdate(
                                    e.target.value,
                                    actualEmpIdx
                                  )
                                }
                                //   onBlur={(e) => {
                                //     const val = e.target.value;
                                //     if (val && !isValidOrg(val)) {
                                //       toast.error("Please enter a valid numeric Organization ID from the available list.", {
                                //         autoClose: 3000,
                                //       });
                                //       // Don't clear the value automatically - let user fix it
                                //     } else {
                                //       handleEmployeeDataBlur(actualEmpIdx, emp);
                                //     }
                                //   }}
                                onBlur={(e) => {
                                  if (planType === "NBBUD") return; // Add this line
                                  const val = e.target.value;
                                  const originalValue = row.orgId;

                                  if (
                                    val !== originalValue &&
                                    val &&
                                    !isValidOrgForUpdate(
                                      val,
                                      updateOrganizationOptions
                                    )
                                  ) {
                                    toast.error(
                                      "Please enter a valid numeric Organization ID from the available list.",
                                      {
                                        autoClose: 3000,
                                      }
                                    );
                                  } else {
                                    handleEmployeeDataBlur(actualEmpIdx, emp);
                                  }
                                }}
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                list={`organization-list-${actualEmpIdx}`}
                                placeholder="Enter Organization ID"
                              />
                            ) : (
                              row.orgId
                            )}
                            <datalist id={`organization-list-${actualEmpIdx}`}>
                              {updateOrganizationOptions.map((org, index) => (
                                <option
                                  key={`${org.value}-${index}`}
                                  value={org.value}
                                >
                                  {org.label}
                                </option>
                              ))}
                            </datalist>
                          </td>

                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isBudPlan && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.glcPlc !== undefined
                                    ? editedData.glcPlc
                                    : row.glcPlc
                                }
                                onChange={(e) =>
                                  handlePlcInputChangeForUpdate(
                                    e.target.value,
                                    actualEmpIdx
                                  )
                                }
                                onBlur={(e) => {
                                  if (planType === "NBBUD") return; // Add this line
                                  const val = e.target.value;
                                  const originalValue = row.glcPlc;

                                  if (
                                    val !== originalValue &&
                                    val &&
                                    !isValidPlcForUpdate(val, updatePlcOptions)
                                  ) {
                                    toast.error(
                                      "Please enter a valid PLC from the available list.",
                                      {
                                        autoClose: 3000,
                                      }
                                    );
                                  } else {
                                    handleEmployeeDataBlur(actualEmpIdx, emp);
                                  }
                                }}
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                                list={`plc-list-${actualEmpIdx}`}
                                placeholder="Enter PLC"
                              />
                            ) : (
                              row.glcPlc
                            )}
                            <datalist id={`plc-list-${actualEmpIdx}`}>
                              {/* Use updatePlcOptions if available, otherwise fallback to plcOptions */}
                              {(updatePlcOptions.length > 0
                                ? updatePlcOptions
                                : plcOptions
                              ).map((plc, index) => (
                                <option
                                  key={`${plc.value}-${index}`}
                                  value={plc.value}
                                >
                                  {plc.label}
                                </option>
                              ))}
                            </datalist>
                          </td>

                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
                            {isFieldEditable && isEditable ? (
                              <input
                                type="checkbox"
                                checked={
                                  editedData.isRev !== undefined
                                    ? editedData.isRev
                                    : emp.emple.isRev
                                }
                                onChange={(e) =>
                                  handleEmployeeDataChange(
                                    actualEmpIdx,
                                    "isRev",
                                    e.target.checked
                                  )
                                }
                                onBlur={() =>
                                  handleEmployeeDataBlur(actualEmpIdx, emp)
                                }
                                className="w-4 h-4"
                              />
                            ) : (
                              row.isRev
                            )}
                          </td>
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px] text-center">
                            {isFieldEditable && isEditable ? (
                              <input
                                type="checkbox"
                                checked={
                                  editedData.isBrd !== undefined
                                    ? editedData.isBrd
                                    : emp.emple.isBrd
                                }
                                onChange={(e) =>
                                  handleEmployeeDataChange(
                                    actualEmpIdx,
                                    "isBrd",
                                    e.target.checked
                                  )
                                }
                                onBlur={() =>
                                  handleEmployeeDataBlur(actualEmpIdx, emp)
                                }
                                className="w-4 h-4"
                              />
                            ) : (
                              row.isBrd
                            )}
                          </td>
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {row.status}
                          </td>
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {isFieldEditable && isEditable ? (
                              <input
                                type="text"
                                value={
                                  editedData.perHourRate !== undefined
                                    ? editedData.perHourRate
                                    : row.perHourRate
                                }
                                onChange={(e) =>
                                  handleEmployeeDataChange(
                                    actualEmpIdx,
                                    "perHourRate",
                                    e.target.value.replace(/[^0-9.]/g, "")
                                  )
                                }
                                onBlur={() =>
                                  handleEmployeeDataBlur(actualEmpIdx, emp)
                                }
                                className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs"
                              />
                            ) : (
                              row.perHourRate
                            )}
                          </td>
                          <td className="p-1.5 border-r border-gray-200 text-xs text-gray-700 min-w-[70px]">
                            {row.total}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div
            ref={secondTableRef}
            onScroll={handleSecondScroll}
            style={{
              maxHeight: "400px",
              overflowY: "auto", // show scrollbar
              overflowX: "auto",
            }}
          >
              <table className="min-w-full text-xs text-center border-collapse border border-gray-300 rounded-lg">
                <thead className="sticky-thead">
                  <tr
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT}px`,
                      lineHeight: "normal",
                    }}
                  >
                    {sortedDurations.map((duration) => {
                      const uniqueKey = `${duration.monthNo}_${duration.year}`;
                      return (
                        <th
                          key={uniqueKey}
                          className={`px-2 py-1.5 border border-gray-200 text-center min-w-[80px] text-xs text-gray-900 font-normal ${
                            selectedColumnKey === uniqueKey
                              ? "bg-yellow-100"
                              : ""
                          }`}
                          style={{ cursor: isEditable ? "pointer" : "default" }}
                          onClick={() => handleColumnHeaderClick(uniqueKey)}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="whitespace-nowrap text-xs text-gray-900 font-normal">
                              {duration.month}
                            </span>
                            <span className="text-xs text-gray-600 font-normal">
                              {duration.workingHours || 0} hrs
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {showNewForm && (
                    <tr
                      key="new-entry"
                      className="bg-gray-50"
                      style={{
                        height: `${ROW_HEIGHT_DEFAULT}px`,
                        lineHeight: "normal",
                      }}
                    >
                      {sortedDurations.map((duration) => {
                        const uniqueKey = `${duration.monthNo}_${duration.year}`;
                        const isInputEditable =
                          isEditable &&
                          isMonthEditable(duration, closedPeriod, planType);
                        return (
                          <td
                            key={`new-${uniqueKey}`}
                            className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
                              planType === "EAC"
                                ? isInputEditable
                                  ? "bg-green-50"
                                  : "bg-gray-200"
                                : ""
                            }`}
                          >
                            <input
                              type="text"
                              inputMode="numeric"
                              value={newEntryPeriodHours[uniqueKey] ?? "0"}
                              onChange={(e) =>
                                isInputEditable &&
                                setNewEntryPeriodHours((prev) => ({
                                  ...prev,
                                  [uniqueKey]: e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  ),
                                }))
                              }
                              className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
                                !isInputEditable
                                  ? "cursor-not-allowed text-gray-400"
                                  : "text-gray-700"
                              }`}
                              disabled={!isInputEditable}
                              placeholder="Enter Hours"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  )}
                  {localEmployees
                    .filter((_, idx) => !hiddenRows[idx])
                    .map((emp, idx) => {
                      const actualEmpIdx = localEmployees.findIndex(
                        (e) => e === emp
                      );
                      const monthHours = getMonthHours(emp);
                      return (
                        <tr
                          key={`hours-${actualEmpIdx}`}
                          className={`whitespace-nowrap hover:bg-blue-50 transition border-b border-gray-200 ${
                            selectedRowIndex === actualEmpIdx
                              ? "bg-yellow-100"
                              : "even:bg-gray-50"
                          }`}
                          style={{
                            height: `${ROW_HEIGHT_DEFAULT}px`,
                            lineHeight: "normal",
                            cursor: isEditable ? "pointer" : "default",
                          }}
                          onClick={() => handleRowClick(actualEmpIdx)}
                        >
                          {sortedDurations.map((duration) => {
                            const uniqueKey = `${duration.monthNo}_${duration.year}`;
                            const forecast = monthHours[uniqueKey];
                            const value =
                              inputValues[`${actualEmpIdx}_${uniqueKey}`] ??
                              (forecast?.value !== undefined
                                ? forecast.value
                                : "0");
                            const isInputEditable =
                              isEditable &&
                              isMonthEditable(duration, closedPeriod, planType);
                            return (
                              <td
                                key={`hours-${actualEmpIdx}-${uniqueKey}`}
                                className={`px-2 py-1.5 border-r border-gray-200 text-center min-w-[80px] ${
                                  selectedColumnKey === uniqueKey
                                    ? "bg-yellow-100"
                                    : ""
                                } ${
                                  planType === "EAC"
                                    ? isInputEditable
                                      ? "bg-green-50"
                                      : "bg-gray-200"
                                    : ""
                                }`}
                              >
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  className={`text-center border border-gray-300 bg-white text-xs w-[50px] h-[18px] p-[2px] ${
                                    !isInputEditable
                                      ? "cursor-not-allowed text-gray-400"
                                      : "text-gray-700"
                                  }`}
                                  value={value}
                                  onChange={(e) =>
                                    handleInputChange(
                                      actualEmpIdx,
                                      uniqueKey,
                                      e.target.value.replace(/[^0-9.]/g, "")
                                    )
                                  }
                                  onBlur={(e) =>
                                    handleForecastHoursBlur(
                                      actualEmpIdx,
                                      uniqueKey,
                                      e.target.value
                                    )
                                  }
                                  disabled={!isInputEditable}
                                  placeholder="Enter Hours"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        
      )}
      {showFindReplace && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-sm">
            <h3 className="text-lg font-semibold mb-4">
              Find and Replace Hours
            </h3>
            <div className="mb-3">
              <label
                htmlFor="findValue"
                className="block text-gray-700 text-xs font-medium mb-1"
              >
                Find:
              </label>
              <input
                type="text"
                id="findValue"
                className="w-full border border-gray-300 rounded-md p-2 text-xs"
                value={findValue}
                onChange={(e) => setFindValue(e.target.value)}
                placeholder="Value to find (e.g., 100 or empty)"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="replaceValue"
                className="block text-gray-700 text-xs font-medium mb-1"
              >
                Replace with:
              </label>
              <input
                type="text"
                id="replaceValue"
                className="w-full border border-gray-300 rounded-md p-2 text-xs"
                value={replaceValue}
                onChange={(e) =>
                  setReplaceValue(e.target.value.replace(/[^0-9.]/g, ""))
                }
                placeholder="New value (e.g., 120 or empty)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Scope:
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="inline-flex items-center text-xs cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="replaceScope"
                    value="all"
                    checked={replaceScope === "all"}
                    onChange={(e) => setReplaceScope(e.target.value)}
                  />
                  <span className="ml-2">All</span>
                </label>
                <label className="inline-flex items-center text-xs cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="replaceScope"
                    value="row"
                    checked={replaceScope === "row"}
                    onChange={(e) => setReplaceScope(e.target.value)}
                    disabled={selectedRowIndex === null}
                  />
                  <span className="ml-2">
                    Selected Row (
                    {selectedRowIndex !== null
                      ? localEmployees[selectedRowIndex]?.emple.emplId
                      : "N/A"}
                    )
                  </span>
                </label>
                <label className="inline-flex items-center text-xs cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="replaceScope"
                    value="column"
                    checked={replaceScope === "column"}
                    onChange={(e) => setReplaceScope(e.target.value)}
                    disabled={selectedColumnKey === null}
                  />
                  <span className="ml-2">
                    Selected Column (
                    {selectedColumnKey
                      ? sortedDurations.find(
                          (d) => `${d.monthNo}_${d.year}` === selectedColumnKey
                        )?.month
                      : "N/A"}
                    )
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowFindReplace(false);
                  setSelectedRowIndex(null);
                  setSelectedColumnKey(null);
                  setReplaceScope("all");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFindReplace}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Popup Modal */}
      {showWarningPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Warnings for Employee: {selectedEmployeeIdForWarning}
              </h3>
              <button
                onClick={() => setShowWarningPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Warning Component */}
            <Warning
              planId={planId}
              projectId={projectId}
              planType={planType}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowWarningPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHoursDetails;
