import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Importing icons
import { v4 as uuidv4 } from "uuid"; // For unique IDs
import { backendUrl } from "./config";

const PLCComponent = ({ selectedProjectId, selectedPlan, showPLC }) => {
  const [billingRatesSchedule, setBillingRatesSchedule] = useState([]);
  const [newRate, setNewRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editBillRate, setEditBillRate] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeBillingRates, setEmployeeBillingRates] = useState([]);
  const [newEmployeeRate, setNewEmployeeRate] = useState(null);
  const [editEmployeeBillRate, setEditEmployeeBillRate] = useState({});
  const [editEmployeeFields, setEditEmployeeFields] = useState({});
  const [editingEmployeeRowId, setEditingEmployeeRowId] = useState(null);
  const [vendorBillingRates, setVendorBillingRates] = useState([]);
  const [newVendorRate, setNewVendorRate] = useState(null);
  const [editVendorBillRate, setEditVendorBillRate] = useState({});
  const [editVendorFields, setEditVendorFields] = useState({});
  const [editingVendorRowId, setEditingVendorRowId] = useState(null);
  const [plcs, setPlcs] = useState([]);
  const [plcSearch, setPlcSearch] = useState("");
  const [vendorEmployees, setVendorEmployees] = useState([]);
  const [editingProjectPlcRowId, setEditingProjectPlcRowId] = useState(null);
  const [editProjectPlcFields, setEditProjectPlcFields] = useState({});
  const [loadingAction, setLoadingAction] = useState({});
  const [hasFetchedPLC, setHasFetchedPLC] = useState(false);
  const [loadingPLC, setLoadingPLC] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  const [loadingVendor, setLoadingVendor] = useState(false);

  const lookupTypeOptions = ["Select", "Employee", "Contract Employee"];
  const rateTypeOptions = ["Select", "Billing", "Actual"];
  const vendorLookupTypeOptions = ["Select", "Vendor", "Employee"];

  const dropdownStyles = {
    //  Remove borders from datalist suggestions
    noBorderDropdown: {
      border: "none",
      outline: "none",
      boxShadow: "none",
      background: "transparent",
    },
  };

  useEffect(() => {
    setHasFetchedPLC(false);
  }, [selectedProjectId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  // Move the function OUTSIDE useEffect and add useCallback
  const fetchBillingRates = useCallback(async () => {
    if (!selectedProjectId) {
      // ✅ Clear states when no project selected
      setBillingRatesSchedule([]);
      setEditBillRate({});
      setEditProjectPlcFields({});
      return;
    }

    //   setLoading(true);
    setLoadingPLC(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/ProjectPlcRates`
      );
      const filteredData = response.data.filter((item) =>
        item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
      );

      // Check for duplicate IDs
      // const seenKeys = new Set();
      // const uniqueData = filteredData.map((item, index) => {
      //   const id =
      //     item.id ||
      //     `${item.projId}-${item.laborCategoryCode}-${item.effectiveDate}-${index}`;
      //   if (seenKeys.has(id)) {
      //     console.warn(
      //       `Duplicate key detected in billingRatesSchedule: ${id}. Using composite key.`
      //     );
      //     return { ...item, id: `${id}-${index}` };
      //   }
      //   seenKeys.add(id);
      //   return { ...item, id };
      // });

    //   // ✅ ALWAYS generate unique IDs, store original for API calls
    // const uniqueData = filteredData.map((item, index) => {
    //   // const uniqueId = `plc-${Date.now()}-${index}-${uuidv4().substring(0, 8)}`;
    //   const uniqueId = `plc-${Date.now()}-${Math.random()}-${index}-${uuidv4()}`;
    //   return { 
    //     ...item, 
    //     id: uniqueId,
    //     originalId: item.id // Store original for API calls
    //   };
    // });

//     const uniqueData = filteredData.map((item, index) => {
//   const uniqueId = `plc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}-${uuidv4()}`;
//   return { 
//     ...item, 
//     id: uniqueId,
//     originalId: item.id // Store original for API calls
//   };
// });

const uniqueData = filteredData.map((item, index) => {
    const uniqueId = `plc-${uuidv4()}-${index}`;
    return { 
      ...item, 
      id: uniqueId,
      originalId: item.id
    };
  });



      setBillingRatesSchedule(
        uniqueData.map((item) => ({
          id: item.id,
          originalId: item.originalId,
          plc: item.laborCategoryCode,
          billRate: item.billingRate,
          // rateType: item.rateType || "Select",
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.effectiveDate),
          endDate: formatDate(item.endDate),
        }))
      );

      const newEditBillRate = {};
      const newEditProjectPlcFields = {};
      uniqueData.forEach((item) => {
        newEditBillRate[item.id] = item.billingRate;
        newEditProjectPlcFields[item.id] = {
          // rateType: item.rateType,
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.effectiveDate),
          endDate: formatDate(item.endDate),
        };
      });
      setEditBillRate(newEditBillRate);
      setEditProjectPlcFields(newEditProjectPlcFields);
    } catch (error) {
      console.error("Error fetching billing rates:", error);
      toast.error(
        `Failed to fetch billing rates: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      // setLoading(false);
      setLoadingPLC(false);
    }
  }, [selectedProjectId]); // ✅ Memoized with dependency

  // Move the function OUTSIDE useEffect and add useCallback
  const fetchEmployees = useCallback(async () => {
    if (
      !selectedProjectId ||
      typeof selectedProjectId !== "string" ||
      selectedProjectId.trim() === ""
    ) {
      // ✅ Clear employees when no valid project selected
      setEmployees([]);
      return;
    }

    //   setLoading(true);
    setLoadingEmployee(true);
    try {
      const response = await axios.get(
        `${backendUrl}/Project/GetEmployeesByProject/${selectedProjectId}`
      );
      setEmployees(
        response.data.map((item) => ({
          empId: item.empId,
          employeeName: item.employeeName,
        }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    } finally {
      // setLoading(false);
      setLoadingEmployee(false);
    }
  }, [selectedProjectId]); // Memoized with dependency

  // Simple useEffect that calls the memoized function
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // Only runs when selectedProjectId changes

  // Fetch PLCs for search
  // useEffect(() => {
  //   const fetchPlcs = async () => {
  //     if (!plcSearch) {
  //       setPlcs([]);
  //       return;
  //     }
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/Project/GetAllPlcs/${plcSearch}`
  //       );
  //       const filteredPlcs = response.data
  //         .filter((item) =>
  //           item.laborCategoryCode
  //             .toLowerCase()
  //             .includes(plcSearch.toLowerCase())
  //         )
  //         .map((item) => ({
  //           laborCategoryCode: item.laborCategoryCode,
  //           description: item.description || "",
  //         }));
  //       setPlcs(filteredPlcs);
  //     } catch (error) {
  //       console.error("Error fetching PLCs:", error);
  //       setPlcs([]);
  //     }
  //   };
  //   fetchPlcs();
  // }, [plcSearch]);

  const fetchPlcs = useCallback(async () => {
    if (!plcSearch) {
      setPlcs([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/Project/GetAllPlcs/${plcSearch}`
      );
      const filteredPlcs = response.data
        .filter((item) =>
          item.laborCategoryCode.toLowerCase().includes(plcSearch.toLowerCase())
        )
        .map((item) => ({
          laborCategoryCode: item.laborCategoryCode,
          description: item.description || "",
        }));
      setPlcs(filteredPlcs);
    } catch (error) {
      console.error("Error fetching PLCs:", error);
      setPlcs([]);
    }
  }, [plcSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPlcs();
    }, 100); //  debounce to prevent excessive API calls while typing

    return () => clearTimeout(timeoutId);
  }, [fetchPlcs]);

  const fetchEmployeeBillingRates = useCallback(async () => {
    if (!selectedProjectId) {
      setEmployeeBillingRates([]);
      setEditEmployeeBillRate({});
      setEditEmployeeFields({});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/ProjEmplRt`
      );
      const filteredData = response.data.filter(
        (item) =>
          item.projId
            .toLowerCase()
            .startsWith(selectedProjectId.toLowerCase()) && item.emplId
      );

      // // Check for duplicate IDs
      // const seenKeys = new Set();
      // const uniqueData = filteredData.map((item, index) => {
      //   const id =
      //     item.projEmplRtKey ||
      //     item.id ||
      //     `${item.projId}-${item.emplId}-${item.startDt}-${index}`;
      //   if (seenKeys.has(id)) {
      //     console.warn(
      //       `Duplicate key detected in employeeBillingRates: ${id}. Using composite key.`
      //     );
      //     return { ...item, id: `${id}-${index}` };
      //   }
      //   seenKeys.add(id);
      //   return { ...item, id };
      // });

      // ✅ Always generate unique IDs
    // const uniqueData = filteredData.map((item, index) => {
    //   // const uniqueId = `emp-${Date.now()}-${index}-${uuidv4().substring(0, 8)}`;
    //   const uniqueId = `emp-${Date.now()}-${Math.random()}-${index}-${uuidv4()}`;
    //   return { 
    //     ...item, 
    //     id: uniqueId,
    //     originalId: item.projEmplRtKey || item.id // Keep original for API calls
    //   };
    // });

//     const uniqueData = filteredData.map((item, index) => {
//   const uniqueId = `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}-${uuidv4()}`;
//   return { 
//     ...item, 
//     id: uniqueId,
//     originalId: item.projEmplRtKey || item.id
//   };
// });

const uniqueData = filteredData.map((item, index) => {
    const uniqueId = `emp-${uuidv4()}-${index}`;
    return { 
      ...item, 
      id: uniqueId,
      originalId: item.projEmplRtKey || item.id
    };
  });


      setEmployeeBillingRates(
        uniqueData.map((item) => ({
          id: item.id,
          originalId: item.originalId,
          lookupType: item.type || "Select",
          empId: item.emplId,
          employeeName:
            item.emplName ||
            employees.find((emp) => emp.empId === item.emplId)?.employeeName ||
            "",
          plc: item.billLabCatCd,
          plcDescription: item.plcDescription || "",
          billRate: item.billRtAmt,
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.startDt),
          endDate: formatDate(item.endDt),
        }))
      );

      const newEditEmployeeBillRate = {};
      const newEditEmployeeFields = {};
      uniqueData.forEach((item) => {
        const id = item.id;
        if (id) {
          newEditEmployeeBillRate[id] = item.billRtAmt;
          newEditEmployeeFields[id] = {
            lookupType: item.type || "Select",
            rateType: item.sBillRtTypeCd || "Select",
            startDate: formatDate(item.startDt),
            endDate: formatDate(item.endDt),
            empId: item.emplId,
            employeeName: item.employeeName,
            plc: item.billLabCatCd,
            plcDescription: item.plcDescription,
          };
        }
      });
      setEditEmployeeBillRate(newEditEmployeeBillRate);
      setEditEmployeeFields(newEditEmployeeFields);
    } catch (error) {
      console.error("Error fetching employee billing rates:", error);
      toast.error(
        `Failed to fetch employee billing rates: ${
          error.response?.data?.message || error.message
        }`
      );
      setEmployeeBillingRates([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, employees]);

  // useEffect(() => {
  //   fetchEmployeeBillingRates();
  // }, [fetchEmployeeBillingRates]);

  // Fetch vendor billing rates
  // useEffect(() => {
  //   const fetchVendorBillingRates = async () => {
  //     if (!selectedProjectId) return;
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/ProjVendRt`
  //       );
  //       const filteredData = response.data.filter((item) =>
  //         item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
  //       );
  //       setVendorBillingRates(
  //         filteredData.map((item) => ({
  //           id: item.projVendRtKey || item.id,
  //           projVendRtKey: item.projVendRtKey,
  //           lookupType: item.type,
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription || item.description || "",
  //           billRate: item.billRtAmt,
  //           rateType: item.sBillRtTypeCd,
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //         }))
  //       );
  //       const newEditVendorBillRate = {};
  //       const newEditVendorFields = {};
  //       filteredData.forEach((item) => {
  //         const id = item.projVendRtKey || item.id;
  //         newEditVendorBillRate[id] = item.billRtAmt;
  //         newEditVendorFields[id] = {
  //           lookupType: item.type || "Select",
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription,
  //         };
  //       });
  //       setEditVendorBillRate(newEditVendorBillRate);
  //       setEditVendorFields(newEditVendorFields);
  //     } catch (error) {
  //       console.error("Error fetching vendor billing rates:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchVendorBillingRates();
  // }, [selectedProjectId]);
  // useEffect(() => {
  //   const fetchVendorBillingRates = async () => {
  //     if (!selectedProjectId) return;
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/ProjVendRt`
  //       );
  //       const filteredData = response.data.filter((item) =>
  //         item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
  //       );

  //       // Create a map to detect and handle duplicates
  //       const seenKeys = new Set();
  //       const uniqueVendorBillingRates = filteredData
  //         .map((item, index) => {
  //           const id =
  //             item.projVendRtKey ||
  //             item.id ||
  //             `${item.projId}-${item.vendId}-${item.startDt}-${index}`;
  //           // Check for duplicates
  //           if (seenKeys.has(id)) {
  //             // console.warn(`Duplicate key detected: ${id}. Using composite key.`);
  //             return {
  //               ...item,
  //               id: `${id}-${index}`, // Append index to make it unique
  //             };
  //           }
  //           seenKeys.add(id);
  //           return {
  //             ...item,
  //             id,
  //           };
  //         })
  //         .map((item) => ({
  //           id: item.id,
  //           projVendRtKey: item.projVendRtKey,
  //           lookupType: item.type || "Select",
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || item.vendEmplName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription || item.description || "",
  //           billRate: item.billRtAmt,
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //         }));

  //       setVendorBillingRates(uniqueVendorBillingRates);

  //       const newEditVendorBillRate = {};
  //       const newEditVendorFields = {};
  //       uniqueVendorBillingRates.forEach((item) => {
  //         const id = item.id;
  //         newEditVendorBillRate[id] = item.billRtAmt;
  //         newEditVendorFields[id] = {
  //           lookupType: item.type || "Select",
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || item.vendEmplName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription,
  //         };
  //       });
  //       setEditVendorBillRate(newEditVendorBillRate);
  //       setEditVendorFields(newEditVendorFields);
  //     } catch (error) {
  //       console.error("Error fetching vendor billing rates:", error);
  //       toast.error(
  //         `Failed to fetch vendor billing rates: ${
  //           error.response?.data?.message || error.message
  //         }`
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchVendorBillingRates();
  // }, [selectedProjectId]);
  // useEffect(() => {
  //   const fetchVendorBillingRates = async () => {
  //     if (!selectedProjectId) return;
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/ProjVendRt`
  //       );
  //       const filteredData = response.data.filter((item) =>
  //         item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
  //       );

  //       // Check for duplicate IDs
  //       const seenKeys = new Set();
  //       const uniqueData = filteredData.map((item, index) => {
  //         const id =
  //           item.projVendRtKey ||
  //           item.id ||
  //           `${item.projId}-${item.vendId}-${item.startDt}-${index}`;
  //         if (seenKeys.has(id)) {
  //           console.warn(
  //             `Duplicate key detected in vendorBillingRates: ${id}. Using composite key.`
  //           );
  //           return { ...item, id: `${id}-${index}` };
  //         }
  //         seenKeys.add(id);
  //         return { ...item, id };
  //       });

  //       setVendorBillingRates(
  //         uniqueData.map((item) => ({
  //           id: item.id,
  //           projVendRtKey: item.projVendRtKey,
  //           lookupType: item.type || "Select",
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || item.vendEmplName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription || item.description || "",
  //           billRate: item.billRtAmt,
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //         }))
  //       );

  //       const newEditVendorBillRate = {};
  //       const newEditVendorFields = {};
  //       uniqueData.forEach((item) => {
  //         const id = item.id;
  //         newEditVendorBillRate[id] = item.billRtAmt;
  //         newEditVendorFields[id] = {
  //           lookupType: item.type || "Select",
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //           vendorId: item.vendId || "",
  //           vendorName: item.vendorName || item.vendEmplName || "",
  //           vendorEmployee: item.vendEmplId || "",
  //           vendorEmployeeName: item.vendEmplName || "",
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription,
  //         };
  //       });
  //       setEditVendorBillRate(newEditVendorBillRate);
  //       setEditVendorFields(newEditVendorFields);
  //     } catch (error) {
  //       console.error("Error fetching vendor billing rates:", error);
  //       toast.error(
  //         `Failed to fetch vendor billing rates: ${
  //           error.response?.data?.message || error.message
  //         }`
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchVendorBillingRates();
  // }, [selectedProjectId]);

  const fetchVendorBillingRates = useCallback(async () => {
    if (!selectedProjectId) {
      setVendorBillingRates([]);
      setEditVendorBillRate({});
      setEditVendorFields({});
      return;
    }

    //   setLoading(true);
    setLoadingVendor(true);
    try {
      const response = await axios.get(
        `${backendUrl}/ProjVendRt`
      );
      const filteredData = response.data.filter((item) =>
        item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
      );

      // // Check for duplicate IDs
      // const seenKeys = new Set();
      // const uniqueData = filteredData.map((item, index) => {
      //   const id =
      //     item.projVendRtKey ||
      //     item.id ||
      //     `${item.projId}-${item.vendId}-${item.startDt}-${index}`;
      //   if (seenKeys.has(id)) {
      //     console.warn(
      //       `Duplicate key detected in vendorBillingRates: ${id}. Using composite key.`
      //     );
      //     return { ...item, id: `${id}-${index}` };
      //   }
      //   seenKeys.add(id);
      //   return { ...item, id };
      // });

    //   // ✅ Generate truly unique IDs
    // const uniqueData = filteredData.map((item, index) => {
    //   const uniqueId = item.projVendRtKey || item.id || `vendor-${Date.now()}-${index}-${uuidv4().substring(0, 8)}`;
    //   return { ...item, id: uniqueId };
    // });

    // ✅ ALWAYS generate unique IDs
    // const uniqueData = filteredData.map((item, index) => {
    //   // const uniqueId = `vendor-${Date.now()}-${index}-${uuidv4().substring(0, 8)}`;
    //   const uniqueId = `vendor-${Date.now()}-${Math.random()}-${index}-${uuidv4()}`;
    //   return { 
    //     ...item, 
    //     id: uniqueId,
    //     originalId: item.projVendRtKey || item.id // Store original for API calls
    //   };
    // });

//     const uniqueData = filteredData.map((item, index) => {
//   const uniqueId = `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}-${uuidv4()}`;
//   return { 
//     ...item, 
//     id: uniqueId,
//     originalId: item.projVendRtKey || item.id
//   };
// });

const uniqueData = filteredData.map((item, index) => {
    const uniqueId = `vendor-${uuidv4()}-${index}`;
    return { 
      ...item, 
      id: uniqueId,
      originalId: item.projVendRtKey || item.id
    };
  });

      setVendorBillingRates(
        uniqueData.map((item) => ({
          id: item.id,
          originalId: item.originalId,
          projVendRtKey: item.projVendRtKey,
          lookupType: item.type || "Select",
          vendorId: item.vendId || "",
          vendorName: item.vendorName || item.vendEmplName || "",
          vendorEmployee: item.vendEmplId || "",
          vendorEmployeeName: item.vendEmplName || "",
          plc: item.billLabCatCd,
          plcDescription: item.plcDescription || item.description || "",
          billRate: item.billRtAmt,
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.startDt),
          endDate: formatDate(item.endDt),
        }))
      );

      const newEditVendorBillRate = {};
      const newEditVendorFields = {};
      uniqueData.forEach((item) => {
        const id = item.id;
        newEditVendorBillRate[id] = item.billRtAmt;
        newEditVendorFields[id] = {
          lookupType: item.type || "Select",
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.startDt),
          endDate: formatDate(item.endDt),
          vendorId: item.vendId || "",
          vendorName: item.vendorName || item.vendEmplName || "",
          vendorEmployee: item.vendEmplId || "",
          vendorEmployeeName: item.vendEmplName || "",
          plc: item.billLabCatCd,
          plcDescription: item.plcDescription,
        };
      });
      setEditVendorBillRate(newEditVendorBillRate);
      setEditVendorFields(newEditVendorFields);
    } catch (error) {
      console.error("Error fetching vendor billing rates:", error);
      toast.error(
        `Failed to fetch vendor billing rates: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      // setLoading(false);
      setLoadingVendor(false);
    }
  }, [selectedProjectId]);

  // useEffect(() => {
  //   fetchVendorBillingRates();
  // }, [fetchVendorBillingRates]);

  // const handleUpdate = async (id) => {
  //   // setLoading(true);
  //   setLoadingAction((prev) => ({ ...prev, [id]: true })); // ← Only specific row loading
  //   const updatedData = {
  //     plc: billingRatesSchedule.find((item) => item.id === id)?.plc, // PLC is not editable
  //     billRate: editBillRate[id],
  //     rateType: editProjectPlcFields[id]?.rateType,
  //     startDate: editProjectPlcFields[id]?.startDate,
  //     endDate: editProjectPlcFields[id]?.endDate,
  //   };

  //   if (
  //     updatedData.startDate &&
  //     updatedData.endDate &&
  //     new Date(updatedData.startDate) > new Date(updatedData.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     await axios.put(
  //       `${backendUrl}/api/ProjectPlcRates/${id}`,
  //       {
  //         id,
  //         projId: selectedProjectId,
  //         laborCategoryCode: updatedData.plc,
  //         costRate: parseFloat(updatedData.billRate) * 0.65,
  //         billingRate: parseFloat(updatedData.billRate),
  //         effectiveDate: updatedData.startDate,
  //         endDate: updatedData.endDate || null,
  //         // rateType: updatedData.rateType,
  //         sBillRtTypeCd: updatedData.rateType,
  //         isActive: true,
  //         modifiedBy: "admin",
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString(),
  //       }
  //     );
  //     setBillingRatesSchedule((prev) =>
  //       prev.map((rate) =>
  //         rate.id === id
  //           ? {
  //               ...rate,
  //               billRate: parseFloat(updatedData.billRate),
  //               rateType: updatedData.rateType,
  //               startDate: updatedData.startDate,
  //               endDate: updatedData.endDate || null,
  //             }
  //           : rate
  //       )
  //     );
  //     setEditingProjectPlcRowId(null);
  //     toast.success("Billing rate updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating billing rate:", error);
  //     toast.error(
  //       `Failed to update billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdate = async (id) => {
  setLoadingAction((prev) => ({ ...prev, [id]: true })); // ✅ Fixed
  
  const currentItem = billingRatesSchedule.find((item) => item.id === id);
  const originalId = currentItem?.originalId || id; // ✅ Use original ID for API
  
  const updatedData = {
    plc: currentItem?.plc,
    billRate: editBillRate[id],
    rateType: editProjectPlcFields[id]?.rateType,
    startDate: editProjectPlcFields[id]?.startDate,
    endDate: editProjectPlcFields[id]?.endDate,
  };

  if (
    updatedData.startDate &&
    updatedData.endDate &&
    new Date(updatedData.startDate) > new Date(updatedData.endDate)
  ) {
    toast.error("End Date cannot be before Start Date.");
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
    return;
  }

  try {
    await axios.put(
      `${backendUrl}/api/ProjectPlcRates/${originalId}`, // ✅ Use original ID
      {
        id: originalId, // ✅ Use original ID
        projId: selectedProjectId,
        laborCategoryCode: updatedData.plc,
        costRate: parseFloat(updatedData.billRate) * 0.65,
        billingRate: parseFloat(updatedData.billRate),
        effectiveDate: updatedData.startDate,
        endDate: updatedData.endDate || null,
        sBillRtTypeCd: updatedData.rateType,
        isActive: true,
        modifiedBy: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    
    setBillingRatesSchedule((prev) =>
      prev.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              billRate: parseFloat(updatedData.billRate),
              rateType: updatedData.rateType,
              startDate: updatedData.startDate,
              endDate: updatedData.endDate || null,
            }
          : rate
      )
    );
    setEditingProjectPlcRowId(null);
    toast.success("Billing rate updated successfully!");
  } catch (error) {
    console.error("Error updating billing rate:", error);
    toast.error(`Failed to update billing rate: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
  }
};


  // useEffect(() => {
  //   if (!selectedProjectId) {
  //     setVendorEmployees([]);
  //     return;
  //   }
  //   const fetchVendorEmployees = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/Project/GetVenderEmployeesByProject/${selectedProjectId}`
  //       );
  //       setVendorEmployees(response.data);
  //     } catch (error) {
  //       setVendorEmployees([]);
  //       console.error("Error fetching vendor employees:", error);
  //     }
  //   };
  //   fetchVendorEmployees();
  // }, [selectedProjectId]);

  const fetchVendorEmployees = useCallback(async () => {
    if (!selectedProjectId) {
      setVendorEmployees([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/Project/GetVenderEmployeesByProject/${selectedProjectId}`
      );
      setVendorEmployees(response.data);
    } catch (error) {
      setVendorEmployees([]);
      console.error("Error fetching vendor employees:", error);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchVendorEmployees();
  }, [fetchVendorEmployees]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this billing rate?")) {
      return; // User cancelled, do nothing
    }
    setLoading(true);
    try {
      await axios.delete(
        `${backendUrl}/api/ProjectPlcRates/${id}`
      );
      setBillingRatesSchedule((prev) => prev.filter((rate) => rate.id !== id));
      setEditBillRate((prev) => {
        const newEditBillRate = { ...prev };
        delete newEditBillRate[id];
        return newEditBillRate;
      });
      setEditProjectPlcFields((prev) => {
        const newEditProjectPlcFields = { ...prev };
        delete newEditProjectPlcFields[id];
        return newEditProjectPlcFields;
      });
      toast.success("Billing rate deleted successfully!");
    } catch (error) {
      console.error("Error deleting billing rate:", error);
      toast.error(
        `Failed to delete billing rate: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setNewRate({
      plc: "",
      billRate: "",
      rateType: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleSaveNewRate = async () => {
    if (!newRate || !newRate.plc || !newRate.startDate || !newRate.billRate) {
      toast.error(
        "Please fill all required fields (PLC, Bill Rate, Start Date)."
      );
      return;
    }

    if (isNaN(newRate.billRate) || Number(newRate.billRate) <= 0) {
      toast.error("Bill Rate must be a valid number greater than 0.");
      return;
    }

    // if (
    //   newRate.startDate &&
    //   newRate.endDate &&
    //   new Date(newRate.startDate) > new Date(newRate.endDate)
    // ) {
    //   toast.error("End Date cannot be before Start Date.");
    //   return;
    // }

    if (
      newRate.startDate &&
      newRate.endDate &&
      new Date(newRate.startDate) > new Date(newRate.endDate)
    ) {
      toast.error("End Date cannot be before Start Date.");
      return;
    }

    // ✅ Project boundaries
    const projectStart = new Date(selectedPlan.projStartDt);
    const projectEnd = new Date(selectedPlan.projEndDt);

    if (newRate.startDate) {
      const start = new Date(newRate.startDate);

      if (start < projectStart) {
        toast.error("Start Date cannot be before Project Start Date.");
        return;
      }

      if (start > projectEnd) {
        toast.error("Start Date cannot be after Project End Date.");
        return;
      }
    }

    if (newRate.endDate) {
      const end = new Date(newRate.endDate);

      if (end < projectStart) {
        toast.error("End Date cannot be before Project Start Date.");
        return;
      }

      if (end > projectEnd) {
        toast.error("End Date cannot be after Project End Date.");
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(
        `${backendUrl}/api/ProjectPlcRates`,
        {
          id: 0,
          projId: selectedProjectId,
          laborCategoryCode: newRate.plc,
          costRate: parseFloat(newRate.billRate) * 0.65,
          billingRate: parseFloat(newRate.billRate),
          effectiveDate: newRate.startDate,
          endDate: newRate.endDate || null,
          sBillRtTypeCd: newRate.rateType,
          isActive: true,
          modifiedBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      setNewRate(null);
      const fetchResponse = await axios.get(
        `${backendUrl}/api/ProjectPlcRates`
      );
      const filteredData = fetchResponse.data.filter((item) =>
        item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
      );
      setBillingRatesSchedule(
        filteredData.map((item) => ({
          id: item.id,
          plc: item.laborCategoryCode,
          billRate: item.billingRate,
          // rateType: item.rateType || "Select",
          rateType: item.sBillRtTypeCd || "Select",
          startDate: formatDate(item.effectiveDate),
          endDate: formatDate(item.endDate),
        }))
      );
      const newEditBillRate = {};
      const newEditProjectPlcFields = {};
      filteredData.forEach((item) => {
        newEditBillRate[item.id] = item.billingRate;
        newEditProjectPlcFields[item.id] = {
          rateType: item.rateType || "Select",
          startDate: formatDate(item.effectiveDate),
          endDate: formatDate(item.endDate),
        };
      });
      setEditBillRate(newEditBillRate);
      setEditProjectPlcFields(newEditProjectPlcFields);
      toast.success("New billing rate added successfully!");
    } catch (error) {
      console.error(
        "Error adding billing rate:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `Failed to add billing rate: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleNewRateChange = (field, value) => {
  //   if (field === "billRate") {
  //     // Allow only numbers (with decimals)
  //     if (!/^\d*\.?\d*$/.test(value)) {
  //       return; // ignore invalid input
  //     }
  //   }
  //   setNewRate((prev) => ({ ...prev, [field]: value }));
  // };
  
  // const handleNewRateChange = (field, value) => {
  //   if (field === "billRate") {
  //     // Allow only numbers, commas, and decimals
  //     if (!/^[0-9,]*\.?[0-9]*$/.test(value)) {
  //       return; // ignore invalid input
  //     }
 
  //     // Remove commas before saving as number string
  //     const cleanValue = value.replace(/,/g, "");
 
  //     setNewRate((prev) => ({ ...prev, [field]: cleanValue }));
  //     return;
  //   }
 
  //   setNewRate((prev) => ({ ...prev, [field]: value }));
  // };

  const handleNewRateChange = (field, value) => {
    if (field === "billRate") {
      // Allow only digits, commas, and ONE decimal point
      if (!/^\d{0,3}(?:,?\d{3})*(?:\.\d*)?$/.test(value) && value !== "") {
        return; // ignore invalid input
      }
 
      // Keep value as-is (don't parse here, so user can type 4.5 naturally)
      setNewRate((prev) => ({ ...prev, [field]: value }));
      return;
    }
 
    setNewRate((prev) => ({ ...prev, [field]: value }));
  };


  // const handleBillRateChange = (id, value) => {
  //   setEditBillRate((prev) => ({
  //     ...prev,
  //     [id]: value === "" ? "" : parseFloat(value) || 0,
  //   }));
  // };
  
  const handleBillRateChange = (id, value) => {
    // Allow only digits, commas, and one decimal
    if (!/^\d{0,3}(?:,?\d{3})*(?:\.\d*)?$/.test(value) && value !== "") {
      return; // ignore invalid input
    }
 
    setEditBillRate((prev) => ({
      ...prev,
      [id]: value,
    }));
  };


  const handleProjectPlcFieldChange = (id, field, value) => {
    setEditProjectPlcFields((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleEditProjectPlcRow = (id) => {
    setEditingProjectPlcRowId(id);
    const currentRow = billingRatesSchedule.find((item) => item.id === id);
    if (currentRow) {
      setEditProjectPlcFields((prev) => ({
        ...prev,
        [id]: {
          rateType: currentRow.rateType,
          startDate: currentRow.startDate,
          endDate: currentRow.endDate,
        },
      }));
      setEditBillRate((prev) => ({
        ...prev,
        [id]: currentRow.billRate,
      }));
    }
  };

  // Employee Billing Rates Handlers
  const handleAddEmployeeRow = () => {
    setNewEmployeeRate({
      lookupType: "",
      empId: "",
      employeeName: "",
      plc: "",
      plcDescription: "",
      billRate: "",
      rateType: "",
      startDate: "",
      endDate: "",
    });
  };

  // const handleSaveNewEmployeeRate = async () => {
  //   if (
  //     !newEmployeeRate ||
  //     !newEmployeeRate.empId ||
  //     !newEmployeeRate.plc ||
  //     !newEmployeeRate.startDate ||
  //     !newEmployeeRate.billRate ||
  //     newEmployeeRate.lookupType === "Select" ||
  //     newEmployeeRate.rateType === "Select"
  //   ) {
  //     toast.error(
  //       "Please fill all required fields (Lookup Type, Employee, PLC, Bill Rate, Rate Type, Start Date)."
  //     );
  //     return;
  //   }
  //   if (
  //     newEmployeeRate.startDate &&
  //     newEmployeeRate.endDate &&
  //     new Date(newEmployeeRate.startDate) > new Date(newEmployeeRate.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await axios.post(`${backendUrl}/ProjEmplRt`, {
  //       id: 0,
  //       projId: selectedProjectId,
  //       emplId: newEmployeeRate.empId,
  //       employeeName: newEmployeeRate.employeeName,
  //       billLabCatCd: newEmployeeRate.plc,
  //       billRtAmt: parseFloat(newEmployeeRate.billRate),
  //       startDt: newEmployeeRate.startDate,
  //       endDt: newEmployeeRate.endDate || null,
  //       sBillRtTypeCd: newEmployeeRate.rateType,
  //       type: newEmployeeRate.lookupType,
  //       isActive: true,
  //       modifiedBy: "admin",
  //     });
  //     setNewEmployeeRate(null);
  //     // Refetch employee billing rates to ensure state consistency after adding
  //     const fetchResponse = await axios.get(
  //       `${backendUrl}/ProjEmplRt`
  //     );
  //     const filteredData = fetchResponse.data.filter(
  //       (item) =>
  //         item.projId
  //           .toLowerCase()
  //           .startsWith(selectedProjectId.toLowerCase()) && item.emplId
  //     );
  //     setEmployeeBillingRates(
  //       filteredData.map((item) => ({
  //         id: item.projEmplRtKey || item.id,
  //         lookupType: item.type || "Select",
  //         empId: item.emplId,
  //         employeeName:
  //           item.employeeName ||
  //           employees.find((emp) => emp.empId === item.emplId)?.employeeName ||
  //           "",
  //         plc: item.billLabCatCd,
  //         plcDescription: item.plcDescription || "",
  //         billRate: item.billRtAmt,
  //         rateType: item.sBillRtTypeCd || "Select",
  //         startDate: formatDate(item.startDt),
  //         endDate: formatDate(item.endDt),
  //       }))
  //     );
  //     const newEditEmployeeBillRate = {};
  //     const newEditEmployeeFields = {};
  //     filteredData.forEach((item) => {
  //       const id = item.projEmplRtKey || item.id;
  //       if (id) {
  //         newEditEmployeeBillRate[id] = item.billRtAmt;
  //         newEditEmployeeFields[id] = {
  //           lookupType: item.type || "Select",
  //           rateType: item.sBillRtTypeCd || "Select",
  //           startDate: formatDate(item.startDt),
  //           endDate: formatDate(item.endDt),
  //           empId: item.emplId,
  //           employeeName: item.employeeName,
  //           plc: item.billLabCatCd,
  //           plcDescription: item.plcDescription,
  //         };
  //       }
  //     });
  //     setEditEmployeeBillRate(newEditEmployeeBillRate);
  //     setEditEmployeeFields(newEditEmployeeFields);
  //     toast.success("New employee billing rate added successfully!");
  //   } catch (error) {
  //     console.error(
  //       "Error adding employee billing rate:",
  //       error.response ? error.response.data : error.message
  //     );
  //     toast.error(
  //       `Failed to add employee billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSaveNewEmployeeRate = async () => {
    if (
      !newEmployeeRate ||
      !newEmployeeRate.empId ||
      !newEmployeeRate.plc ||
      !newEmployeeRate.startDate ||
      !newEmployeeRate.billRate
    ) {
      console.error(
        "Please fill all required fields (Employee, PLC, Bill Rate, Start Date)"
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/ProjEmplRt`, {
        id: 0,
        projId: selectedProjectId,
        emplId: newEmployeeRate.empId,
        employeeName: newEmployeeRate.employeeName,
        billLabCatCd: newEmployeeRate.plc,
        billRtAmt: parseFloat(newEmployeeRate.billRate),
        startDt: newEmployeeRate.startDate,
        endDt: newEmployeeRate.endDate || null,
        sBillRtTypeCd: newEmployeeRate.rateType,
        type: newEmployeeRate.lookupType,
        isActive: true,
        modifiedBy: "admin",
      });
      setNewEmployeeRate(null);
      const fetchResponse = await axios.get(
        `${backendUrl}/ProjEmplRt`
      );
      const filteredData = fetchResponse.data.filter(
        (item) =>
          item.projId
            .toLowerCase()
            .startsWith(selectedProjectId.toLowerCase()) && item.emplId
      );
      setEmployeeBillingRates(
        filteredData.map((item) => ({
          id: item.projEmplRtKey || item.id,
          lookupType: item.type || "Select",
          empId: item.emplId,
          employeeName:
            item.employeeName ||
            employees.find((emp) => emp.empId === item.emplId)?.employeeName ||
            "",
          plc: item.billLabCatCd,
          plcDescription: item.plcDescription || "",
          billRate: item.billRtAmt,
          rateType: item.sBillRtTypeCd || "Select",
          startDate: item.startDt ? item.startDt.split("T")[0] : "",
          endDate: item.endDt ? item.endDt.split("T")[0] : null,
        }))
      );
      const newEditEmployeeBillRate = {};
      const newEditEmployeeFields = {};
      filteredData.forEach((item) => {
        const id = item.projEmplRtKey || item.id;
        if (id) {
          newEditEmployeeBillRate[id] = item.billRtAmt;
          newEditEmployeeFields[id] = {
            lookupType: item.type || "Select",
            rateType: item.sBillRtTypeCd || "Select",
            startDate: item.startDt ? item.startDt.split("T")[0] : "",
            endDate: item.endDt ? item.endDt.split("T")[0] : null,
          };
        }
      });
      setEditEmployeeBillRate(newEditEmployeeBillRate);
      setEditEmployeeFields(newEditEmployeeFields);
    } catch (error) {
      console.error(
        "Error adding employee billing rate:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleEmployeeBillRateChange = (id, value) => {
  //   if (isNaN(newRate.billRate) || Number(newRate.billRate) <= 0) {
  //     toast.error("Bill Rate must be a valid number greater than 0.");
  //     return;
  //   }
  //   setEditEmployeeBillRate((prev) => ({
  //     ...prev,
  //     [id]: value === "" ? "" : parseFloat(value) || 0,
  //   }));
  // };
  
   const handleEmployeeBillRateChange = (id, value) => {
    // ✅ allow only numbers, commas, and decimals while typing
    if (!/^[0-9,]*\.?[0-9]*$/.test(value) && value !== "") {
      return; // ❌ ignore invalid input
    }
 
    // Remove commas for validation/storage
    const cleanValue = value.replace(/,/g, "");
 
    if (cleanValue !== "" && (isNaN(cleanValue) || Number(cleanValue) <= 0)) {
      toast.error("Bill Rate must be a valid number greater than 0.");
      return;
    }
 
    setEditEmployeeBillRate((prev) => ({
      ...prev,
      [id]: cleanValue, // store clean number string
    }));
  };
 
  // const handleUpdateEmployee = async (id) => {
  //   if (!id) {
  //     console.error("Invalid ID for update");
  //     return;
  //   }
  //   // setLoading(true);
  //   setLoadingAction((prev) => ({ ...prev, [id]: false })); // Individual row loading
  //   const updatedData = employeeBillingRates.find((item) => item.id === id);
  //   const fields = editEmployeeFields[id] || {};

  //   if (
  //     fields.startDate &&
  //     fields.endDate &&
  //     new Date(fields.startDate) > new Date(fields.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     await axios.put(`${backendUrl}/ProjEmplRt/${id}`, {
  //       projEmplRtKey: id,
  //       projId: selectedProjectId,
  //       emplId: fields.empId || updatedData.empId,
  //       employeeName: fields.employeeName || updatedData.employeeName,
  //       billLabCatCd: fields.plc || updatedData.plc,
  //       billRtAmt: parseFloat(editEmployeeBillRate[id] ?? updatedData.billRate),
  //       startDt: fields.startDate || updatedData.startDate,
  //       endDt: fields.endDate || updatedData.endDate || null,
  //       sBillRtTypeCd: fields.rateType || updatedData.rateType,
  //       type: fields.lookupType || updatedData.lookupType,
  //       isActive: true,
  //       modifiedBy: "admin",
  //     });
  //     // Update local state with the saved changes
  //     setEmployeeBillingRates((prev) =>
  //       prev.map((rate) =>
  //         rate.id === id
  //           ? {
  //               ...rate,
  //               lookupType: fields.lookupType || updatedData.lookupType,
  //               empId: fields.empId || updatedData.empId,
  //               employeeName: fields.employeeName || updatedData.employeeName,
  //               plc: fields.plc || updatedData.plc,
  //               plcDescription:
  //                 plcs.find(
  //                   (plc) =>
  //                     plc.laborCategoryCode === (fields.plc || updatedData.plc)
  //                 )?.description ||
  //                 fields.plcDescription ||
  //                 updatedData.plcDescription,
  //               billRate: parseFloat(
  //                 editEmployeeBillRate[id] ?? updatedData.billRate
  //               ),
  //               rateType: fields.rateType || updatedData.rateType,
  //               startDate: fields.startDate || updatedData.startDate,
  //               endDate: fields.endDate || updatedData.endDate || null,
  //             }
  //           : rate
  //       )
  //     );
  //     setEditingEmployeeRowId(null);
  //     toast.success("Employee billing rate updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating employee billing rate:", error);
  //     toast.error(
  //       `Failed to update employee billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleUpdateEmployee = async (id) => {
  if (!id) {
    console.error("Invalid ID for update");
    return;
  }
  
  setLoadingAction((prev) => ({ ...prev, [id]: true })); // ✅ Fixed
  
  const updatedData = employeeBillingRates.find((item) => item.id === id);
  const originalId = updatedData?.originalId || id; // ✅ Use original ID
  const fields = editEmployeeFields[id] || {};

  if (
    fields.startDate &&
    fields.endDate &&
    new Date(fields.startDate) > new Date(fields.endDate)
  ) {
    toast.error("End Date cannot be before Start Date.");
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
    return;
  }

  try {
    await axios.put(`${backendUrl}/ProjEmplRt/${originalId}`, { // ✅ Use original ID
      projEmplRtKey: originalId, // ✅ Use original ID
      projId: selectedProjectId,
      emplId: fields.empId || updatedData.empId,
      employeeName: fields.employeeName || updatedData.employeeName,
      billLabCatCd: fields.plc || updatedData.plc,
      billRtAmt: parseFloat(editEmployeeBillRate[id] ?? updatedData.billRate),
      startDt: fields.startDate || updatedData.startDate,
      endDt: fields.endDate || updatedData.endDate || null,
      sBillRtTypeCd: fields.rateType || updatedData.rateType,
      type: fields.lookupType || updatedData.lookupType,
      isActive: true,
      modifiedBy: "admin",
    });
    
    // Update local state with the saved changes
    setEmployeeBillingRates((prev) =>
      prev.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              lookupType: fields.lookupType || updatedData.lookupType,
              empId: fields.empId || updatedData.empId,
              employeeName: fields.employeeName || updatedData.employeeName,
              plc: fields.plc || updatedData.plc,
              plcDescription:
                plcs.find(
                  (plc) => plc.laborCategoryCode === (fields.plc || updatedData.plc)
                )?.description ||
                fields.plcDescription ||
                updatedData.plcDescription,
              billRate: parseFloat(editEmployeeBillRate[id] ?? updatedData.billRate),
              rateType: fields.rateType || updatedData.rateType,
              startDate: fields.startDate || updatedData.startDate,
              endDate: fields.endDate || updatedData.endDate || null,
            }
          : rate
      )
    );
    setEditingEmployeeRowId(null);
    toast.success("Employee billing rate updated successfully!");
  } catch (error) {
    console.error("Error updating employee billing rate:", error);
    toast.error(`Failed to update employee billing rate: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
  }
};

  const handleDeleteEmployee = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee billing rate?"
      )
    ) {
      return;
    }
    if (!id) {
      console.error("Invalid ID for deletion");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${backendUrl}/ProjEmplRt/${id}`);
      setEmployeeBillingRates((prev) => prev.filter((rate) => rate.id !== id));
      setEditEmployeeBillRate((prev) => {
        const newEditEmployeeBillRate = { ...prev };
        delete newEditEmployeeBillRate[id];
        return newEditEmployeeBillRate;
      });
      setEditEmployeeFields((prev) => {
        const newEditEmployeeFields = { ...prev };
        delete newEditEmployeeFields[id];
        return newEditEmployeeFields;
      });
      setEditingEmployeeRowId(null);
      toast.success("Employee billing rate deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee billing rate:", error);
      toast.error(
        `Failed to delete employee billing rate: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleNewEmployeeRateChange = (field, value, id = null) => {
  //   if (id) {
  //     if (field === "empId") {
  //       const selectedEmp = employees.find((emp) => emp.empId === value);
  //       setEditEmployeeFields((prev) => ({
  //         ...prev,
  //         [id]: {
  //           ...prev[id],
  //           empId: value,
  //           employeeName: selectedEmp
  //             ? selectedEmp.employeeName
  //             : prev[id]?.employeeName,
  //         },
  //       }));
  //     } else if (field === "plc") {
  //       const selectedPlc = plcs.find((plc) => plc.laborCategoryCode === value);
  //       setEditEmployeeFields((prev) => ({
  //         ...prev,
  //         [id]: {
  //           ...prev[id],
  //           plc: value,
  //           plcDescription: selectedPlc
  //             ? selectedPlc.description
  //             : prev[id]?.plcDescription,
  //         },
  //       }));
  //     } else {
  //       setEditEmployeeFields((prev) => ({
  //         ...prev,
  //         [id]: {
  //           ...prev[id],
  //           [field]: value,
  //         },
  //       }));
  //     }
  //   } else {
  //     const selectedEmp =
  //       field === "empId" ? employees.find((emp) => emp.empId === value) : null;
  //     const selectedPlc =
  //       field === "plc"
  //         ? plcs.find((plc) => plc.laborCategoryCode === value)
  //         : null;
  //     setNewEmployeeRate((prev) => ({
  //       ...prev,
  //       [field]: value,
  //       ...(field === "empId" && selectedEmp
  //         ? { employeeName: selectedEmp.employeeName }
  //         : {}),
  //       ...(field === "plc" && selectedPlc
  //         ? { plcDescription: selectedPlc.description }
  //         : {}),
  //     }));
  //   }
  // };

  // const handleNewEmployeeRateChange = (field, value, id = null) => {
  //   const updateState = (prev, selectedEmp = null, selectedPlc = null) => {
  //     const updated = {
  //       ...prev,
  //       [field]: value,
  //       ...(field === "empId" && selectedEmp
  //         ? { employeeName: selectedEmp.employeeName }
  //         : {}),
  //       ...(field === "plc" && selectedPlc
  //         ? { plcDescription: selectedPlc.description }
  //         : {}),
  //     };

  //     // ✅ Date validations
  //     if (updated.startDate && updated.endDate) {
  //       if (new Date(updated.startDate) > new Date(updated.endDate)) {
  //         toast.error("End Date cannot be before Start Date.");
  //         return prev; // ❌ reject update
  //       }
  //     }

  //     if (updated.startDate) {
  //       if (
  //         new Date(updated.startDate) < new Date(selectedPlan.projStartDt) ||
  //         new Date(updated.startDate) > new Date(selectedPlan.projEndDt)
  //       ) {
  //         toast.error("Start Date must be within project dates.");
  //         return prev;
  //       }
  //     }

  //     if (updated.endDate) {
  //       if (
  //         new Date(updated.endDate) < new Date(selectedPlan.projStartDt) ||
  //         new Date(updated.endDate) > new Date(selectedPlan.projEndDt)
  //       ) {
  //         toast.error("End Date must be within project dates.");
  //         return prev;
  //       }
  //     }

  //     return updated; // ✅ valid update
  //   };

  //   if (id) {
  //     // Editing existing row
  //     const selectedEmp =
  //       field === "empId" ? employees.find((emp) => emp.empId === value) : null;
  //     const selectedPlc =
  //       field === "plc"
  //         ? plcs.find((plc) => plc.laborCategoryCode === value)
  //         : null;

  //     setEditEmployeeFields((prev) => ({
  //       ...prev,
  //       [id]: updateState(prev[id] || {}, selectedEmp, selectedPlc),
  //     }));
  //   } else {
  //     // Adding new row
  //     const selectedEmp =
  //       field === "empId" ? employees.find((emp) => emp.empId === value) : null;
  //     const selectedPlc =
  //       field === "plc"
  //         ? plcs.find((plc) => plc.laborCategoryCode === value)
  //         : null;

  //     setNewEmployeeRate((prev) => updateState(prev, selectedEmp, selectedPlc));
  //   }
  // };

  const handleNewEmployeeRateChange = (field, value, id = null) => {
    const updateState = (prev, selectedEmp = null, selectedPlc = null) => {
      // ✅ Special handling for billRate
      if (field === "billRate") {
        // Only allow digits, commas, decimals
        if (!/^[0-9,]*\.?[0-9]*$/.test(value) && value !== "") {
          return prev; // ❌ invalid → don't update
        }
        // Clean commas for storage
        const cleanValue = value.replace(/,/g, "");
        return { ...prev, [field]: cleanValue };
      }
 
      const updated = {
        ...prev,
        [field]: value,
        ...(field === "empId" && selectedEmp
          ? { employeeName: selectedEmp.employeeName }
          : {}),
        ...(field === "plc" && selectedPlc
          ? { plcDescription: selectedPlc.description }
          : {}),
      };
 
      // ✅ Date validations
      if (updated.startDate && updated.endDate) {
        if (new Date(updated.startDate) > new Date(updated.endDate)) {
          toast.error("End Date cannot be before Start Date.");
          return prev;
        }
      }
 
      if (updated.startDate) {
        if (
          new Date(updated.startDate) < new Date(selectedPlan.projStartDt) ||
          new Date(updated.startDate) > new Date(selectedPlan.projEndDt)
        ) {
          toast.error("Start Date must be within project dates.");
          return prev;
        }
      }
 
      if (updated.endDate) {
        if (
          new Date(updated.endDate) < new Date(selectedPlan.projStartDt) ||
          new Date(updated.endDate) > new Date(selectedPlan.projEndDt)
        ) {
          toast.error("End Date must be within project dates.");
          return prev;
        }
      }
 
      return updated; // ✅ valid update
    };
 
    if (id) {
      // Editing existing row
      const selectedEmp =
        field === "empId" ? employees.find((emp) => emp.empId === value) : null;
      const selectedPlc =
        field === "plc"
          ? plcs.find((plc) => plc.laborCategoryCode === value)
          : null;
 
      setEditEmployeeFields((prev) => ({
        ...prev,
        [id]: updateState(prev[id] || {}, selectedEmp, selectedPlc),
      }));
    } else {
      // Adding new row
      const selectedEmp =
        field === "empId" ? employees.find((emp) => emp.empId === value) : null;
      const selectedPlc =
        field === "plc"
          ? plcs.find((plc) => plc.laborCategoryCode === value)
          : null;
 
      setNewEmployeeRate((prev) => updateState(prev, selectedEmp, selectedPlc));
    }
  };

  const handleEditEmployeeRow = (id) => {
    setEditingEmployeeRowId(id);
    const currentRow = employeeBillingRates.find((item) => item.id === id);
    if (currentRow) {
      setEditEmployeeFields((prev) => ({
        ...prev,
        [id]: {
          lookupType: currentRow.lookupType,
          empId: currentRow.empId,
          employeeName: currentRow.employeeName,
          plc: currentRow.plc,
          plcDescription: currentRow.plcDescription,
          rateType: currentRow.rateType,
          startDate: currentRow.startDate,
          endDate: currentRow.endDate,
        },
      }));
      setEditEmployeeBillRate((prev) => ({
        ...prev,
        [id]: currentRow.billRate,
      }));
    }
  };

  // Vendor Billing Rates Handlers
  const handleAddVendorRow = () => {
    setNewVendorRate({
      lookupType: "",
      vendorId: "",
      vendorName: "",
      vendorEmployee: "",
      vendorEmployeeName: "",
      plc: "",
      plcDescription: "",
      billRate: "",
      rateType: "",
      startDate: "",
      endDate: "",
    });
  };

  // const handleSaveNewVendorRate = async () => {
  //   if (
  //     !newVendorRate ||
  //     !newVendorRate.vendorId ||
  //     !newVendorRate.plc ||
  //     !newVendorRate.startDate ||
  //     !newVendorRate.billRate ||
  //     newVendorRate.lookupType === "Select" ||
  //     newVendorRate.rateType === "Select"
  //   ) {
  //     toast.error(
  //       "Please fill all required fields (Lookup Type, Vendor ID, PLC, Bill Rate, Rate Type, Start Date)."
  //     );
  //     return;
  //   }
  //   if (
  //     newVendorRate.startDate &&
  //     newVendorRate.endDate &&
  //     new Date(newVendorRate.startDate) > new Date(newVendorRate.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await axios.post(`${backendUrl}/ProjVendRt`, {
  //       id: 0,
  //       projId: selectedPlan?.projId || selectedProjectId,
  //       vendId: newVendorRate.vendorId,
  //       vendEmplId: newVendorRate.vendorEmployee,
  //       billLabCatCd: newVendorRate.plc,
  //       billDiscRt: 0,
  //       companyId: "1",
  //       billRtAmt: parseFloat(newVendorRate.billRate),
  //       startDt: new Date(newVendorRate.startDate).toISOString(),
  //       endDt: newVendorRate.endDate
  //         ? new Date(newVendorRate.endDate).toISOString()
  //         : null,
  //       sBillRtTypeCd: newVendorRate.rateType,
  //       type: newVendorRate.lookupType,
  //       modifiedBy: "admin",
  //       timeStamp: new Date().toISOString(),
  //     });
  //     setNewVendorRate(null);
  //     const fetchResponse = await axios.get(
  //       `${backendUrl}/ProjVendRt`
  //     );
  //     const filteredData = fetchResponse.data.filter((item) =>
  //       item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
  //     );
  //     setVendorBillingRates(
  //       filteredData.map((item) => ({
  //         id: item.projVendRtKey || item.id,
  //         projVendRtKey: item.projVendRtKey,
  //         lookupType: item.type || "Select",
  //         vendorId: item.vendId || "",
  //         vendorName: item.vendorName || item.vendEmplName || "", // Use item.vendorName first, then vendEmplName
  //         vendorEmployee: item.vendEmplId || "",
  //         vendorEmployeeName: item.vendEmplName || "",
  //         plc: item.billLabCatCd,
  //         plcDescription: item.plcDescription || "",
  //         billRate: item.billRtAmt,
  //         rateType: item.sBillRtTypeCd || "Select",
  //         startDate: formatDate(item.startDt),
  //         endDate: formatDate(item.endDt),
  //       }))
  //     );
  //     const newEditVendorBillRate = {};
  //     const newEditVendorFields = {};
  //     filteredData.forEach((item) => {
  //       const id = item.projVendRtKey || item.id;
  //       newEditVendorBillRate[id] = item.billRtAmt;
  //       newEditVendorFields[id] = {
  //         lookupType: item.type || "Select",
  //         rateType: item.sBillRtTypeCd || "Select",
  //         startDate: formatDate(item.startDt),
  //         endDate: formatDate(item.endDt),
  //         vendorId: item.vendId || "",
  //         vendorName: item.vendorName || item.vendEmplName || "",
  //         vendorEmployee: item.vendEmplId || "",
  //         vendorEmployeeName: item.vendEmplName || "",
  //         plc: item.billLabCatCd,
  //         plcDescription: item.plcDescription,
  //       };
  //     });
  //     setEditVendorBillRate(newEditVendorBillRate);
  //     setEditVendorFields(newEditVendorFields);
  //     toast.success("New vendor billing rate added successfully!");
  //   } catch (error) {
  //     console.error(
  //       "Error adding vendor billing rate:",
  //       error.response ? error.response.data : error.message
  //     );
  //     toast.error(
  //       `Failed to add vendor billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const handleSaveNewVendorRate = async () => {
  //   if (
  //     !newVendorRate ||
  //     !newVendorRate.vendorId ||
  //     !newVendorRate.vendorName ||
  //     !newVendorRate.plc ||
  //     !newVendorRate.startDate ||
  //     !newVendorRate.billRate
  //   ) {
  //     console.error(
  //       "Please fill all required fields (Vendor ID, Vendor Name, PLC, Bill Rate, Start Date)"
  //     );
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await axios.post(`${backendUrl}/ProjVendRt`, {
  //       id: 0,
  //       projId: selectedPlan?.projId || selectedProjectId,
  //       vendId: newVendorRate.vendorId,
  //       vendEmplId: newVendorRate.vendorEmployee,
  //       billLabCatCd: newVendorRate.plc,
  //       billDiscRt: 0,
  //       companyId: "1",
  //       billRtAmt: parseFloat(newVendorRate.billRate),
  //       startDt: new Date(newVendorRate.startDate).toISOString(),
  //       endDt: newVendorRate.endDate
  //         ? new Date(newVendorRate.endDate).toISOString()
  //         : null,
  //       sBillRtTypeCd: newVendorRate.rateType,
  //       type: newVendorRate.lookupType,
  //       modifiedBy: "admin",
  //       timeStamp: new Date().toISOString(),
  //     });
  //     setNewVendorRate(null);
  //     const fetchResponse = await axios.get(
  //       `${backendUrl}/ProjVendRt`
  //     );
  //     const filteredData = fetchResponse.data.filter((item) =>
  //       item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
  //     );
  //     setVendorBillingRates(
  //       filteredData.map((item) => ({
  //       id: item.projVendRtKey || item.id,
  //         lookupType: item.type || "Select",
  //         vendorId: item.vendId || "",
  //         vendorName: item.vendorName || "",
  //         vendorEmployee: item.vendEmplId || "",
  //         vendorEmployeeName: item.vendEmplName || "",
  //         plc: item.billLabCatCd,
  //         plcDescription: item.plcDescription || "",
  //         billRate: item.billRtAmt,
  //         rateType: item.sBillRtTypeCd || "Select",
  //         startDate: new Date(item.startDt).toISOString().split("T")[0],
  //         endDate: item.endDt
  //           ? new Date(item.endDt).toISOString().split("T")[0]
  //           : null,
  //       }))
  //     );
  //     const newEditVendorBillRate = {};
  //     const newEditVendorFields = {};
  //     filteredData.forEach((item) => {
  //       newEditVendorBillRate[item.id] = item.billRtAmt;
  //       newEditVendorFields[item.id] = {
  //         lookupType: item.type || "Select",
  //         rateType: item.sBillRtTypeCd || "Select",
  //         startDate: new Date(item.startDt).toISOString().split("T")[0],
  //         endDate: item.endDt
  //           ? new Date(item.endDt).toISOString().split("T")[0]
  //           : null,
  //       };
  //     });
  //     setEditVendorBillRate(newEditVendorBillRate);
  //     setEditVendorFields(newEditVendorFields);
  //   } catch (error) {
  //     console.error(
  //       "Error adding vendor billing rate:",
  //       error.response ? error.response.data : error.message
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Optimized handleSaveNewVendorRate
  // const handleSaveNewVendorRate = async () => {
  //   // Validate required fields
  //   if (
  //     !newVendorRate ||
  //     !newVendorRate.vendorId ||
  //     !newVendorRate.plc ||
  //     !newVendorRate.startDate ||
  //     !newVendorRate.billRate ||
  //     newVendorRate.lookupType === "Select" ||
  //     newVendorRate.rateType === "Select"
  //   ) {
  //     toast.error(
  //       "Please fill all required fields (Lookup Type, Vendor ID, PLC, Bill Rate, Rate Type, Start Date)."
  //     );
  //     return;
  //   }

  //   if (
  //     isNaN(parseFloat(newVendorRate.billRate)) ||
  //     parseFloat(newVendorRate.billRate) <= 0
  //   ) {
  //     toast.error("Bill Rate must be a valid positive number.");
  //     return;
  //   }

  //   if (
  //     newVendorRate.startDate &&
  //     newVendorRate.endDate &&
  //     new Date(newVendorRate.startDate) > new Date(newVendorRate.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     return;
  //   }

  //   const newId = newVendorRate.id || uuidv4(); // Ensure unique ID
  //   setLoadingAction((prev) => ({ ...prev, [newId]: true }));

  //   try {
  //     const payload = {
  //       id: 0,
  //       projId: selectedPlan?.projId || selectedProjectId,
  //       vendId: newVendorRate.vendorId,
  //       vendEmplId: newVendorRate.vendorEmployee || null,
  //       billLabCatCd: newVendorRate.plc,
  //       billDiscRt: 0,
  //       companyId: "1",
  //       billRtAmt: parseFloat(newVendorRate.billRate),
  //       startDt: new Date(newVendorRate.startDate).toISOString(),
  //       endDt: newVendorRate.endDate
  //         ? new Date(newVendorRate.endDate).toISOString()
  //         : null,
  //       sBillRtTypeCd: newVendorRate.rateType,
  //       type: newVendorRate.lookupType,
  //       modifiedBy: "admin",
  //       timeStamp: new Date().toISOString(),
  //     };

  //     const response = await axios.post(
  //       `${backendUrl}/ProjVendRt`,
  //       payload
  //     );

  //     // Construct new rate object
  //     const newRate = {
  //       id: newId,
  //       projVendRtKey: response.data.projVendRtKey || newId,
  //       lookupType: newVendorRate.lookupType,
  //       vendorId: newVendorRate.vendorId,
  //       vendorName:
  //         newVendorRate.vendorName ||
  //         vendorEmployees.find((v) => v.vendId === newVendorRate.vendorId)
  //           ?.employeeName ||
  //         "",
  //       vendorEmployee: newVendorRate.vendorEmployee || "",
  //       vendorEmployeeName: newVendorRate.vendorEmployeeName || "",
  //       plc: newVendorRate.plc,
  //       plcDescription:
  //         newVendorRate.plcDescription ||
  //         plcs.find((plc) => plc.laborCategoryCode === newVendorRate.plc)
  //           ?.description ||
  //         "",
  //       billRate: parseFloat(newVendorRate.billRate),
  //       rateType: newVendorRate.rateType,
  //       startDate: formatDate(newVendorRate.startDate),
  //       endDate: newVendorRate.endDate
  //         ? formatDate(newVendorRate.endDate)
  //         : null,
  //     };

  //     // Append to state
  //     setVendorBillingRates((prev) => [...prev, newRate]);
  //     setEditVendorBillRate((prev) => ({
  //       ...prev,
  //       [newId]: newRate.billRate,
  //     }));
  //     setEditVendorFields((prev) => ({
  //       ...prev,
  //       [newId]: {
  //         lookupType: newRate.lookupType,
  //         vendorId: newRate.vendorId,
  //         vendorName: newRate.vendorName,
  //         vendorEmployee: newRate.vendorEmployee,
  //         vendorEmployeeName: newRate.vendorEmployeeName,
  //         plc: newRate.plc,
  //         plcDescription: newRate.plcDescription,
  //         rateType: newRate.rateType,
  //         startDate: newRate.startDate,
  //         endDate: newRate.endDate,
  //       },
  //     }));

  //     setNewVendorRate(null);
  //     toast.success("Vendor billing rate added successfully!");
  //   } catch (error) {
  //     console.error("Error adding vendor billing rate:", error);
  //     toast.error(
  //       `Failed to add vendor billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoadingAction((prev) => ({ ...prev, [newId]: false }));
  //   }
  // };

  const handleSaveNewVendorRate = async () => {
    if (
      !newVendorRate ||
      !newVendorRate.vendorId ||
      !newVendorRate.vendorName ||
      !newVendorRate.plc ||
      !newVendorRate.startDate ||
      !newVendorRate.billRate
    ) {
      console.error(
        "Please fill all required fields (Vendor ID, Vendor Name, PLC, Bill Rate, Start Date)"
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/ProjVendRt`, {
        id: 0,
        projId: selectedPlan?.projId || selectedProjectId,
        vendId: newVendorRate.vendorId,
        vendEmplId: newVendorRate.vendorEmployee,
        billLabCatCd: newVendorRate.plc,
        billDiscRt: 0,
        companyId: "1",
        billRtAmt: parseFloat(newVendorRate.billRate),
        startDt: new Date(newVendorRate.startDate).toISOString(),
        endDt: newVendorRate.endDate
          ? new Date(newVendorRate.endDate).toISOString()
          : null,
        sBillRtTypeCd: newVendorRate.rateType,
        type: newVendorRate.lookupType,
        modifiedBy: "admin",
        timeStamp: new Date().toISOString(),
      });
      setNewVendorRate(null);
      const fetchResponse = await axios.get(
        `${backendUrl}/ProjVendRt`
      );
      const filteredData = fetchResponse.data.filter((item) =>
        item.projId.toLowerCase().startsWith(selectedProjectId.toLowerCase())
      );
      // setVendorBillingRates(
      //   filteredData.map((item) => ({
      //     id: item.id,
      //     lookupType: item.type || "Select",
      //     vendorId: item.vendId || "",
      //     // vendorName: item.vendorName || "",
      //     // vendorEmployee: item.vendEmplId || "",
      //     vendorName: item.vendEmplName || newVendorRate.vendorName || "", // Use vendEmplName or fallback to newVendorRate.vendorName
      //     vendorEmployee: item.vendEmplId || "",
      //     vendorEmployeeName: item.vendEmplName || "",
      //     plc: item.billLabCatCd,
      //     plcDescription: item.description || "",
      //     billRate: item.billRtAmt,
      //     rateType: item.sBillRtTypeCd || "Select",
      //     startDate: new Date(item.startDt).toISOString().split("T")[0],
      //     endDate: item.endDt
      //       ? new Date(item.endDt).toISOString().split("T")[0]
      //       : null,
      //   }))
      // );
      setVendorBillingRates(
        filteredData.map((item) => ({
          id: item.projVendRtKey || item.id,
          projVendRtKey: item.projVendRtKey,
          lookupType: item.type || "Select",
          vendorId: item.vendId || "",
          vendorName:
            item.vendEmplName || newVendorRate.vendorEmployeeName || "", // Use vendEmplName
          vendorEmployee: item.vendEmplId || "",
          vendorEmployeeName:
            item.vendEmplName || newVendorRate.vendorEmployeeName || "", // Use vendEmplName
          plc: item.billLabCatCd,
          plcDescription: item.plcDescription || "",
          billRate: item.billRtAmt,
          rateType: item.sBillRtTypeCd || "Select",
          // startDate: new Date(item.startDt).toISOString().split("T")[0],
          // endDate: item.endDt
          //   ? new Date(item.endDt).toISOString().split("T")[0]
          //   : null,
          startDate: formatDate(item.startDt),
          endDate: formatDate(item.endDt),
        }))
      );
      const newEditVendorBillRate = {};
      const newEditVendorFields = {};
      filteredData.forEach((item) => {
        newEditVendorBillRate[item.id] = item.billRtAmt;
        newEditVendorFields[item.id] = {
          lookupType: item.type || "Select",
          rateType: item.sBillRtTypeCd || "Select",
          startDate: new Date(item.startDt).toISOString().split("T")[0],
          endDate: item.endDt
            ? new Date(item.endDt).toISOString().split("T")[0]
            : null,
        };
      });
      setEditVendorBillRate(newEditVendorBillRate);
      setEditVendorFields(newEditVendorFields);
    } catch (error) {
      console.error(
        "Error adding vendor billing rate:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleVendorBillRateChange = (id, value) => {
  //   setEditVendorBillRate((prev) => ({
  //     ...prev,
  //     [id]: value === "" ? "" : parseFloat(value) || 0,
  //   }));
  // };
  
  const handleVendorBillRateChange = (id, value) => {
    // ✅ Allow only digits, commas, and decimals
    if (!/^[0-9,]*\.?[0-9]*$/.test(value) && value !== "") {
      return; // ignore invalid characters
    }
 
    // ✅ Clean commas
    const clean = value.replace(/,/g, "");
 
    // ✅ Reject 0 or negative values
    if (clean !== "" && parseFloat(clean) <= 0) {
      toast.error("Bill Rate must be greater than 0.");
      return;
    }
 
    setEditVendorBillRate((prev) => ({
      ...prev,
      [id]: clean, // keep numeric string (so "2.5" stays "2.5")
    }));
  };

  const handleUpdateVendor = async (id) => {
  setLoadingAction((prev) => ({ ...prev, [id]: true })); // ✅ Fixed
  
  const row = vendorBillingRates.find((r) => r.id === id);
  const originalId = row?.originalId || row?.projVendRtKey || id; // ✅ Use original ID
  const fields = editVendorFields[id] || {};

  if (
    fields.startDate &&
    fields.endDate &&
    new Date(fields.startDate) > new Date(fields.endDate)
  ) {
    toast.error("End Date cannot be before Start Date.");
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
    return;
  }

  try {
    await axios.put(
      `${backendUrl}/ProjVendRt/${originalId}`, // ✅ Use original ID
      {
        projVendRtKey: originalId, // ✅ Use original ID
        projId: selectedProjectId,
        vendId: fields.vendorId || row.vendorId,
        vendEmplId: fields.vendorEmployee || row.vendorEmployee,
        billLabCatCd: fields.plc || row.plc,
        billDiscRt: 0,
        companyId: "1",
        billRtAmt: parseFloat(editVendorBillRate[id] ?? row.billRate),
        startDt: new Date(fields.startDate || row.startDate).toISOString(),
        endDt: fields.endDate
          ? new Date(fields.endDate).toISOString()
          : row.endDate
          ? new Date(row.endDate).toISOString()
          : null,
        sBillRtTypeCd: fields.rateType || row.rateType,
        type: fields.lookupType || row.lookupType,
        modifiedBy: "admin",
        timeStamp: new Date().toISOString(),
      }
    );
    
    setVendorBillingRates((prev) =>
      prev.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              lookupType: fields.lookupType || rate.lookupType,
              vendorId: fields.vendorId || rate.vendorId,
              vendorName: fields.vendorName || rate.vendorName,
              vendorEmployee: fields.vendorEmployee || rate.vendorEmployee,
              vendorEmployeeName: fields.vendorEmployeeName || rate.vendorEmployeeName,
              plc: fields.plc || rate.plc,
              plcDescription:
                plcs.find((plc) => plc.laborCategoryCode === (fields.plc || rate.plc))?.description ||
                fields.plcDescription ||
                rate.plcDescription,
              billRate: parseFloat(editVendorBillRate[id] ?? rate.billRate),
              rateType: fields.rateType || rate.rateType,
              startDate: fields.startDate || rate.startDate,
              endDate: fields.endDate || rate.endDate || null,
            }
          : rate
      )
    );
    setEditingVendorRowId(null);
    toast.success("Vendor billing rate updated successfully!");
  } catch (error) {
    console.error("Error updating vendor billing rate:", error);
    toast.error(`Failed to update vendor billing rate: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoadingAction((prev) => ({ ...prev, [id]: false })); // ✅ Fixed
  }
};



  // const handleUpdateVendor = async (id) => {
  //   // setLoading(true);
  //   setLoadingAction((prev) => ({ ...prev, [id]: false })); // Individual row loading
  //   const row = vendorBillingRates.find((r) => r.id === id);
  //   const projVendRtKey = row?.projVendRtKey || id;
  //   const fields = editVendorFields[id] || {};

  //   if (
  //     fields.startDate &&
  //     fields.endDate &&
  //     new Date(fields.startDate) > new Date(fields.endDate)
  //   ) {
  //     toast.error("End Date cannot be before Start Date.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     await axios.put(
  //       `${backendUrl}/ProjVendRt/${projVendRtKey}`,
  //       {
  //         projVendRtKey: projVendRtKey,
  //         projId: selectedProjectId,
  //         vendId: fields.vendorId || row.vendorId,
  //         vendEmplId: fields.vendorEmployee || row.vendorEmployee,
  //         billLabCatCd: fields.plc || row.plc,
  //         billDiscRt: 0,
  //         companyId: "1",
  //         billRtAmt: parseFloat(editVendorBillRate[id] ?? row.billRate),
  //         startDt: new Date(fields.startDate || row.startDate).toISOString(),
  //         endDt: fields.endDate
  //           ? new Date(fields.endDate).toISOString()
  //           : row.endDate
  //           ? new Date(row.endDate).toISOString()
  //           : null,
  //         sBillRtTypeCd: fields.rateType || row.rateType,
  //         type: fields.lookupType || row.lookupType,
  //         modifiedBy: "admin",
  //         timeStamp: new Date().toISOString(),
  //       }
  //     );
  //     setVendorBillingRates((prev) =>
  //       prev.map((rate) =>
  //         rate.id === id
  //           ? {
  //               ...rate,
  //               lookupType: fields.lookupType || rate.lookupType,
  //               vendorId: fields.vendorId || rate.vendorId,
  //               vendorName: fields.vendorName || rate.vendorName,
  //               vendorEmployee: fields.vendorEmployee || rate.vendorEmployee,
  //               vendorEmployeeName:
  //                 fields.vendorEmployeeName || rate.vendorEmployeeName,
  //               plc: fields.plc || rate.plc,
  //               plcDescription:
  //                 plcs.find(
  //                   (plc) => plc.laborCategoryCode === (fields.plc || rate.plc)
  //                 )?.description ||
  //                 fields.plcDescription ||
  //                 rate.plcDescription,
  //               billRate: parseFloat(editVendorBillRate[id] ?? rate.billRate),
  //               rateType: fields.rateType || rate.rateType,
  //               startDate: fields.startDate || rate.startDate,
  //               endDate: fields.endDate || rate.endDate || null,
  //             }
  //           : rate
  //       )
  //     );
  //     setEditingVendorRowId(null);
  //     toast.success("Vendor billing rate updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating vendor billing rate:", error);
  //     toast.error(
  //       `Failed to update vendor billing rate: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDeleteVendor = async (id) => {
  //    setLoading(true);
  //    try {
  //      await axios.delete(`${backendUrl}/ProjVendRt/${id}`);
  //      setVendorBillingRates((prev) => prev.filter((rate) => rate.id !== id));
  //      setEditVendorBillRate((prev) => {
  //        const newEditVendorBillRate = { ...prev };
  //        delete newEditVendorBillRate[id];
  //        return newEditVendorBillRate;
  //      });
  //      setEditVendorFields((prev) => {
  //        const newEditVendorFields = { ...prev };
  //        delete newEditVendorFields[id];
  //        return newEditVendorFields;
  //      });
  //      setEditingVendorRowId(null);
  //    } catch (error) {
  //      console.error("Error deleting vendor billing rate:", error);
  //    } finally {
  //      setLoading(false);
  //    }
  //  };

  const handleDeleteVendor = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this vendor billing rate?"
      )
    ) {
      return;
    }
    const rate = vendorBillingRates.find((rate) => rate.id === id);
    const deleteId = rate?.projVendRtKey || id; // Use projVendRtKey if available
    setLoadingAction((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(
        `${backendUrl}/ProjVendRt/${deleteId}`
      );
      setVendorBillingRates((prev) => prev.filter((rate) => rate.id !== id));
      setEditVendorBillRate((prev) => {
        const newEditVendorBillRate = { ...prev };
        delete newEditVendorBillRate[id];
        return newEditVendorBillRate;
      });
      setEditVendorFields((prev) => {
        const newEditVendorFields = { ...prev };
        delete newEditVendorFields[id];
        return newEditVendorFields;
      });
      setEditingVendorRowId(null);
      toast.success("Vendor billing rate deleted successfully!");
    } catch (error) {
      console.error("Error deleting vendor billing rate:", error);
      toast.error(
        `Failed to delete vendor billing rate: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoadingAction((prev) => ({ ...prev, [id]: false }));
    }
  };

  // const handleNewVendorRateChange = (field, value) => {
  //   setNewVendorRate((prev) => ({ ...prev, [field]: value }));
  // };
  // const handleNewVendorRateChange = (field, value) => {
  //   setNewVendorRate((prev) => {
  //     const updated = { ...prev, [field]: value };

  //     // ✅ Check Start & End relation
  //     if (updated.startDate && updated.endDate) {
  //       if (new Date(updated.startDate) > new Date(updated.endDate)) {
  //         toast.error("End Date cannot be before Start Date.");
  //         return prev; // stop updating
  //       }
  //     }

  //     // ✅ Check Start Date within project dates
  //     if (updated.startDate) {
  //       if (
  //         new Date(updated.startDate) < new Date(selectedPlan.projStartDt) ||
  //         new Date(updated.startDate) > new Date(selectedPlan.projEndDt)
  //       ) {
  //         toast.error("Start Date must be within project dates.");
  //         return prev;
  //       }
  //     }

  //     // ✅ Check End Date within project dates
  //     if (updated.endDate) {
  //       if (
  //         new Date(updated.endDate) < new Date(selectedPlan.projStartDt) ||
  //         new Date(updated.endDate) > new Date(selectedPlan.projEndDt)
  //       ) {
  //         toast.error("End Date must be within project dates.");
  //         return prev;
  //       }
  //     }

  //     return updated; // ✅ only update if valid
  //   });
  // };
  const handleNewVendorRateChange = (field, value) => {
    setNewVendorRate((prev) => {
      let updated = { ...prev, [field]: value };
 
      // ✅ Bill Rate validation
      if (field === "billRate") {
        // Allow only digits, commas, and ONE decimal
        if (!/^[0-9,]*\.?[0-9]*$/.test(value) && value !== "") {
          toast.error("Bill Rate must contain only numbers and decimal.");
          return prev;
        }
 
        // Remove commas for clean numeric value
        const clean = value.replace(/,/g, "");
 
        // Prevent 0 or negative
        if (clean !== "" && parseFloat(clean) <= 0) {
          toast.error("Bill Rate must be greater than 0.");
          return prev;
        }
 
        updated = { ...prev, [field]: clean }; // store clean value
      }
 
      // ✅ Date validations
      if (updated.startDate && updated.endDate) {
        if (new Date(updated.startDate) > new Date(updated.endDate)) {
          toast.error("End Date cannot be before Start Date.");
          return prev;
        }
      }
 
      if (updated.startDate) {
        if (
          new Date(updated.startDate) < new Date(selectedPlan.projStartDt) ||
          new Date(updated.startDate) > new Date(selectedPlan.projEndDt)
        ) {
          toast.error("Start Date must be within project dates.");
          return prev;
        }
      }
 
      if (updated.endDate) {
        if (
          new Date(updated.endDate) < new Date(selectedPlan.projStartDt) ||
          new Date(updated.endDate) > new Date(selectedPlan.projEndDt)
        ) {
          toast.error("End Date must be within project dates.");
          return prev;
        }
      }
 
      return updated; // ✅ valid update
    });
  };

  const handleVendorFieldChange = (id, field, value) => {
    if (field === "billRate") {
      handleVendorBillRateChange(id, value);
      return;
    }
    if (field === "vendorId") {
      const selectedVend = vendorEmployees.find((v) => v.vendId === value);
      setEditVendorFields((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          vendorId: value,
          vendorName: selectedVend
            ? selectedVend.employeeName
            : prev[id]?.vendorName,
          vendorEmployee: selectedVend
            ? selectedVend.empId
            : prev[id]?.vendorEmployee,
          vendorEmployeeName: selectedVend
            ? selectedVend.employeeName
            : prev[id]?.vendorEmployeeName,
        },
      }));
      setVendorBillingRates((prev) =>
        prev.map((rate) =>
          rate.id === id
            ? {
                ...rate,
                vendorId: value,
                vendorName: selectedVend
                  ? selectedVend.employeeName
                  : rate.vendorName,
                vendorEmployee: selectedVend
                  ? selectedVend.empId
                  : rate.vendorEmployee,
                vendorEmployeeName: selectedVend
                  ? selectedVend.employeeName
                  : rate.vendorEmployeeName,
              }
            : rate
        )
      );
      return;
    }
    setEditVendorFields((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
    if (
      field !== "lookupType" &&
      field !== "rateType" &&
      field !== "startDate" &&
      field !== "endDate" &&
      field !== "billRate"
    ) {
      setVendorBillingRates((prev) =>
        prev.map((rate) =>
          rate.id === id ? { ...rate, [field]: value } : rate
        )
      );
    }
  };

  // const handleEditVendorRow = (id) => {
  //   setEditingVendorRowId(id);
  //   const currentRow = vendorBillingRates.find((item) => item.id === id);
  //   if (currentRow) {
  //     setEditVendorFields((prev) => ({
  //       ...prev,
  //       [id]: {
  //         lookupType: currentRow.lookupType,
  //         vendorId: currentRow.vendorId,
  //         vendorName: currentRow.vendorName,
  //         vendorEmployee: currentRow.vendorEmployee,
  //         vendorEmployeeName: currentRow.vendorEmployeeName,
  //         plc: currentRow.plc,
  //         plcDescription: currentRow.plcDescription,
  //         rateType: currentRow.rateType,
  //         startDate: currentRow.startDate,
  //         endDate: currentRow.endDate,
  //       },
  //     }));
  //     setEditVendorBillRate((prev) => ({
  //       ...prev,
  //       [id]: currentRow.billRate,
  //     }));
  //   }
  // };
  const handleEditVendorRow = (id) => {
    setEditingVendorRowId(id);
  };

  useEffect(() => {
    if (!showPLC || hasFetchedPLC || !selectedProjectId) return;
    fetchBillingRates();
    fetchEmployeeBillingRates();
    fetchVendorBillingRates();
    setHasFetchedPLC(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPLC, hasFetchedPLC, selectedProjectId]);

  const handlePlcInputChange = (value) => {
    setPlcSearch(value);
  };

  const handlePlcSelect = (value) => {
    handleNewRateChange("plc", value);
    setPlcSearch(value);
  };

  // return (
  //   <div className="border p-2 sm:p-4 bg-gray-50 rounded shadow min-h-[150px] scroll-mt-16 text-xs">
  //     {/* <ToastContainer
  //       position="top-right"
  //       autoClose={3000}
  //       hideProgressBar={false}
  //       newestOnTop={false}
  //       closeOnClick
  //       rtl={false}
  //       pauseOnFocusLoss
  //       draggable
  //       pauseOnHover
  //     /> */}
  //     {/* Project Labor Categories Billing Rates Schedule */}
  //     <div className="mb-4">
  //       <div className="flex justify-between items-center mb-2 ">
  //         <h3 className="text-sm font-semibold">
  //           Project Labor Categories Billing Rates Schedule
  //         </h3>
  //         <div className="w-1/5"></div>
  //         <button
  //           onClick={handleAddRow}
  //           className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
  //           disabled={loading || newRate}
  //         >
  //           Add
  //         </button>
  //       </div>
  //       <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
  //         <table className="w-full text-xs border-collapse">
  //           <thead className="sticky top-0 z-10 bg-gray-100">
  //             <tr className="bg-gray-100">
  //               <th className="border p-2 font-normal">Plc</th>
  //               <th className="border p-2 font-normal">Bill Rate</th>
  //               <th className="border p-2 font-normal">Rate Type</th>
  //               <th className="border p-2 font-normal">Start Date</th>
  //               <th className="border p-2 font-normal">End Date</th>
  //               <th className="border p-2 font-normal">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {loadingPLC ? (
  //               <tr key="loading">
  //                 <td colSpan="6" className="border p-2 text-center">
  //                   Loading...
  //                 </td>
  //               </tr>
  //             ) : billingRatesSchedule.length === 0 ? (
  //               <tr key="no-data">
  //                 <td colSpan="6" className="border p-2 text-center">
  //                   No data available
  //                 </td>
  //               </tr>
  //             ) : (
  //               billingRatesSchedule.map((item) => (
  //                 <tr
  //                   key={item.id}
  //                   className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
  //                 >
  //                   <td className="border p-2 sm:w-1/8">
  //                     <span>{item.plc}</span>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/5">
  //                     {editingProjectPlcRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={editBillRate[item.id] ?? item.billRate}
  //                         onChange={(e) =>
  //                           handleBillRateChange(item.id, e.target.value)
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.billRate}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/5">
  //                     {editingProjectPlcRowId === item.id ? (
  //                       <select
  //                         value={
  //                           editProjectPlcFields[item.id]?.rateType ??
  //                           item.rateType
  //                         }
  //                         onChange={(e) =>
  //                           handleProjectPlcFieldChange(
  //                             item.id,
  //                             "rateType",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       >
  //                         {rateTypeOptions.map((option) => (
  //                           <option key={option} value={option}>
  //                             {option}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     ) : (
  //                       <span>{item.rateType}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/5">
  //                     {editingProjectPlcRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editProjectPlcFields[item.id]?.startDate ??
  //                           item.startDate
  //                         }
  //                         onChange={(e) =>
  //                           handleProjectPlcFieldChange(
  //                             item.id,
  //                             "startDate",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.startDate}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/5">
  //                     {editingProjectPlcRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editProjectPlcFields[item.id]?.endDate ??
  //                           item.endDate ??
  //                           ""
  //                         }
  //                         onChange={(e) =>
  //                           handleProjectPlcFieldChange(
  //                             item.id,
  //                             "endDate",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.endDate || ""}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/5">
  //                     <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                       {editingProjectPlcRowId === item.id ? (
  //                         <>
  //                           <button
  //                             onClick={() => handleUpdate(item.id)}
  //                             className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loading}
  //                             title="Save"
  //                           >
  //                             <FaSave className="text-sm" />
  //                           </button>
  //                           <button
  //                             onClick={() => setEditingProjectPlcRowId(null)}
  //                             className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loading}
  //                             title="Cancel"
  //                           >
  //                             <FaTimes className="text-sm" />
  //                           </button>
  //                         </>
  //                       ) : (
  //                         <>
  //                           <button
  //                             onClick={() => handleEditProjectPlcRow(item.id)}
  //                             className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loading}
  //                             title="Edit"
  //                           >
  //                             <FaEdit className="text-sm" />
  //                           </button>
  //                           <button
  //                             onClick={() => handleDelete(item.id)}
  //                             className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loading}
  //                             title="Delete"
  //                           >
  //                             <FaTrash className="text-sm" />
  //                           </button>
  //                         </>
  //                       )}
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ))
  //             )}
  //             {newRate && (
  //               <tr
  //                 key="new-rate"
  //                 className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
  //               >
  //                 <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="text"
  //                     value={newRate.plc || ""}
  //                     onChange={(e) => {
  //                       handleNewRateChange("plc", e.target.value);
  //                       setPlcSearch(e.target.value);
  //                     }}
  //                     className="w-full p-1 border rounded text-xs"
  //                     list="plc-list"
  //                   />
  //                   <datalist
  //                     id="plc-list"
  //                     style={dropdownStyles.noBorderDropdown}
  //                   >
  //                     {plcs.map((plc) => (
  //                       <option
  //                         key={plc.laborCategoryCode}
  //                         value={plc.laborCategoryCode}
  //                         style={dropdownStyles.noBorderDropdown}
  //                       >
  //                         {plc.description}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="text"
  //                     value={newRate.billRate || ""}
  //                     onChange={(e) =>
  //                       handleNewRateChange("billRate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/5">
  //                   <select
  //                     value={newRate.rateType}
  //                     onChange={(e) =>
  //                       handleNewRateChange("rateType", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   >
  //                     {rateTypeOptions.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </td>
  //                 {/* <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="date"
  //                     value={newRate.startDate || ""}
  //                     onChange={(e) =>
  //                       handleNewRateChange("startDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="date"
  //                     value={newRate.endDate || ""}
  //                     onChange={(e) =>
  //                       handleNewRateChange("endDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td> */}
  //                 <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="date"
  //                     value={newRate.startDate || ""}
  //                     onChange={(e) =>
  //                       handleNewRateChange("startDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                     min={selectedPlan.projStartDt} // ✅ cannot pick before project start
  //                     max={selectedPlan.projEndDt} // ✅ cannot pick after project end
  //                   />
  //                 </td>

  //                 <td className="border p-2 sm:w-1/5">
  //                   <input
  //                     type="date"
  //                     value={newRate.endDate || ""}
  //                     onChange={(e) =>
  //                       handleNewRateChange("endDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                     min={newRate.startDate || selectedPlan.projStartDt} // ✅ end date cannot be before start date
  //                     max={selectedPlan.projEndDt} // ✅ cannot pick after project end
  //                   />
  //                 </td>

  //                 <td className="border p-2 sm:w-1/5">
  //                   <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                     <button
  //                       onClick={handleSaveNewRate}
  //                       className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                       disabled={loading}
  //                       title="Save"
  //                     >
  //                       <FaSave className="text-sm" />
  //                     </button>
  //                     <button
  //                       onClick={() => setNewRate(null)}
  //                       className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                       disabled={loading}
  //                       title="Cancel"
  //                     >
  //                       <FaTimes className="text-sm" />
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>

  //     {/* Employee Billing Rates Schedule */}
  //     {/* <div className="mb-4">
  //       <h3 className="text-sm font-semibold">Employee Billing Rates Schedule</h3>
  //       <div className="overflow-x-auto overflow-y-auto max-h-64"> */}
  //     <div className="mb-4">
  //       <div className="flex justify-between items-center mb-2">
  //         <h3 className="text-sm font-semibold">
  //           Employee Billing Rates Schedule
  //         </h3>
  //         <div className="w-1/5"></div>
  //         <button
  //           onClick={handleAddEmployeeRow}
  //           className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
  //           disabled={loading || newEmployeeRate}
  //         >
  //           Add
  //         </button>
  //       </div>
  //       <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
  //         <table className="w-full text-xs border-collapse">
  //           <thead className="sticky top-0 z-10 bg-gray-100">
  //             <tr className="bg-gray-100">
  //               <th className="border p-2 font-normal">Lookup Type</th>
  //               <th className="border p-2 font-normal">Employee</th>
  //               <th className="border p-2 font-normal">Employee Name</th>
  //               <th className="border p-2 font-normal">PLC</th>
  //               <th className="border p-2 font-normal">PLC Description</th>
  //               <th className="border p-2 font-normal">Bill Rate</th>
  //               <th className="border p-2 font-normal">Rate Type</th>
  //               <th className="border p-2 font-normal">Start Date</th>
  //               <th className="border p-2 font-normal">End Date</th>
  //               <th className="border p-2 font-normal">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {loadingEmployee ? (
  //               <tr>
  //                 <td colSpan="10" className="border p-2 text-center">
  //                   Loading...
  //                 </td>
  //               </tr>
  //             ) : employeeBillingRates.length === 0 && !newEmployeeRate ? (
  //               <tr>
  //                 <td colSpan="10" className="border p-2 text-center">
  //                   No data available
  //                 </td>
  //               </tr>
  //             ) : (
  //               employeeBillingRates.map((item) => (
  //                 <tr
  //                   key={item.id}
  //                   className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
  //                 >
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <select
  //                         value={
  //                           editEmployeeFields[item.id]?.lookupType ??
  //                           item.lookupType
  //                         }
  //                         onChange={(e) =>
  //                           handleNewEmployeeRateChange(
  //                             "lookupType",
  //                             e.target.value,
  //                             item.id
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       >
  //                         {lookupTypeOptions.map((option) => (
  //                           <option key={option} value={option}>
  //                             {option}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     ) : (
  //                       <span>{item.lookupType}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={item.empId}
  //                         onChange={(e) =>
  //                           handleNewEmployeeRateChange(
  //                             "empId",
  //                             e.target.value,
  //                             item.id
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                         list="employee-list"
  //                         disabled={employees.length === 0}
  //                       />
  //                     ) : (
  //                       <span>{item.empId}</span>
  //                     )}
  //                     <datalist id="employee-list">
  //                       {employees.map((emp) => (
  //                         <option key={emp.empId} value={emp.empId}>
  //                           {emp.employeeName}
  //                         </option>
  //                       ))}
  //                     </datalist>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     <span>{item.employeeName}</span>
  //                   </td>
  //                   {/* <td className="border p-2 sm:w-1/8">
  //                     <input
  //                       type="text"
  //                       value={item.plc}
  //                       onChange={(e) => {
  //                         handleNewEmployeeRateChange(
  //                           "plc",
  //                           e.target.value,
  //                           item.id
  //                         );
  //                         setPlcSearch(e.target.value);
  //                       }}
  //                       className="w-full p-1 border rounded text-xs"
  //                       list="plc-list"
  //                       disabled
  //                     />
  //                     <datalist id="plc-list">
  //                       {plcs.map((plc) => (
  //                         <option
  //                           key={plc.laborCategoryCode}
  //                           value={plc.laborCategoryCode}
  //                         >
  //                           {plc.description}
  //                         </option>
  //                       ))}
  //                     </datalist>
  //                   </td> */}
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={editEmployeeFields[item.id]?.plc || item.plc}
  //                         onChange={(e) => {
  //                           handleNewEmployeeRateChange(
  //                             "plc",
  //                             e.target.value,
  //                             item.id
  //                           );
  //                           setPlcSearch(e.target.value);
  //                         }}
  //                         className="w-full p-1 border rounded text-xs"
  //                         list="plc-list"
  //                       />
  //                     ) : (
  //                       <span>{item.plc}</span>
  //                     )}
  //                     <datalist id="plc-list">
  //                       {plcs.map((plc) => (
  //                         <option
  //                           key={plc.laborCategoryCode}
  //                           value={plc.laborCategoryCode}
  //                         >
  //                           {plc.description}
  //                         </option>
  //                       ))}
  //                     </datalist>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     <span>
  //                       {plcs.find((plc) => plc.laborCategoryCode === item.plc)
  //                         ?.description || item.plcDescription}
  //                     </span>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={editEmployeeBillRate[item.id] ?? item.billRate}
  //                         onChange={(e) =>
  //                           handleEmployeeBillRateChange(
  //                             item.id,
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.billRate}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <select
  //                         value={
  //                           editEmployeeFields[item.id]?.rateType ??
  //                           item.rateType
  //                         }
  //                         onChange={(e) =>
  //                           handleNewEmployeeRateChange(
  //                             "rateType",
  //                             e.target.value,
  //                             item.id
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       >
  //                         {rateTypeOptions.map((option) => (
  //                           <option key={option} value={option}>
  //                             {option}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     ) : (
  //                       <span>{item.rateType}</span>
  //                     )}
  //                   </td>
  //                   {/* <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editEmployeeFields[item.id]?.startDate ??
  //                           item.startDate
  //                         }
  //                         onChange={(e) =>
  //                           handleNewEmployeeRateChange(
  //                             "startDate",
  //                             e.target.value,
  //                             item.id
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.startDate}</span>
  //                     )}
  //                   </td> */}
  //                   <td className="border p-2 sm:w-1/8">
  //                     <input
  //                       type="date"
  //                       value={editEmployeeFields[item.id]?.startDate || ""}
  //                       onChange={(e) =>
  //                         handleNewEmployeeRateChange(
  //                           "startDate",
  //                           e.target.value,
  //                           item.id
  //                         )
  //                       }
  //                       className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       min={selectedPlan.projStartDt} // ✅ cannot go before project start
  //                       max={selectedPlan.projEndDt} // ✅ cannot go after project end
  //                     />
  //                   </td>

  //                   <td className="border p-2 sm:w-1/8">
  //                     <input
  //                       type="date"
  //                       value={editEmployeeFields[item.id]?.endDate || ""}
  //                       onChange={(e) =>
  //                         handleNewEmployeeRateChange(
  //                           "endDate",
  //                           e.target.value,
  //                           item.id
  //                         )
  //                       }
  //                       className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       min={
  //                         editEmployeeFields[item.id]?.startDate ||
  //                         selectedPlan.projStartDt
  //                       }
  //                       max={selectedPlan.projEndDt} // ✅ must be ≤ project end
  //                     />
  //                   </td>

  //                   {/* <td className="border p-2 sm:w-1/8">
  //                     {editingEmployeeRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editEmployeeFields[item.id]?.endDate ??
  //                           item.endDate ??
  //                           ""
  //                         }
  //                         onChange={(e) =>
  //                           handleNewEmployeeRateChange(
  //                             "endDate",
  //                             e.target.value,
  //                             item.id
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.endDate || ""}</span>
  //                     )}
  //                   </td> */}
  //                   {/* <td className="border p-2 sm:w-1/8">
  //                     <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                       <button
  //                         onClick={() =>
  //                           handleUpdateEmployee(item.id, {
  //                             ...item,
  //                             billRate:
  //                               editEmployeeBillRate[item.id] || item.billRate,
  //                           })
  //                         }
  //                         className="bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-normal hover:bg-blue-300 transition w-full sm:w-auto"
  //                         disabled={loading || !item.id}
  //                       >
  //                         {editingEmployeeRowId === item.id ? "Save" : "Edit"}
  //                       </button>
  //                       <button
  //                         onClick={() => handleDeleteEmployee(item.id)}
  //                         className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-normal hover:bg-gray-300 transition w-full sm:w-auto"
  //                         disabled={loading || !item.id}
  //                       >
  //                         Delete
  //                       </button>
  //                     </div>
  //                   </td> */}
  //                   <td className="border p-2 sm:w-1/8">
  //                     <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                       {editingEmployeeRowId === item.id ? (
  //                         <>
  //                           <button
  //                             onClick={() =>
  //                               handleUpdateEmployee(item.id, {
  //                                 ...item,
  //                                 billRate:
  //                                   editEmployeeBillRate[item.id] ||
  //                                   item.billRate,
  //                               })
  //                             }
  //                             className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Save"
  //                           >
  //                             {loadingAction[item.id] ? (
  //                               <span className="animate-spin">⌛</span>
  //                             ) : (
  //                               <FaSave className="text-sm" />
  //                             )}
  //                           </button>
  //                           <button
  //                             onClick={() => setEditingEmployeeRowId(null)}
  //                             className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Cancel"
  //                           >
  //                             <FaTimes className="text-sm" />
  //                           </button>
  //                         </>
  //                       ) : (
  //                         <>
  //                           <button
  //                             onClick={() => handleEditEmployeeRow(item.id)}
  //                             className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Edit"
  //                           >
  //                             {loadingAction[item.id] ? (
  //                               <span className="animate-spin">⌛</span>
  //                             ) : (
  //                               <FaEdit className="text-sm" />
  //                             )}
  //                           </button>
  //                           <button
  //                             onClick={() => handleDeleteEmployee(item.id)}
  //                             className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Delete"
  //                           >
  //                             {loadingAction[item.id] ? (
  //                               <span className="animate-spin">⌛</span>
  //                             ) : (
  //                               <FaTrash className="text-sm" />
  //                             )}
  //                           </button>
  //                         </>
  //                       )}
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ))
  //             )}
  //             {newEmployeeRate && (
  //               <tr className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0">
  //                 <td className="border p-2 sm:w-1/8">
  //                   <select
  //                     value={newEmployeeRate.lookupType}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange(
  //                         "lookupType",
  //                         e.target.value
  //                       )
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   >
  //                     {lookupTypeOptions.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newEmployeeRate.empId || ""}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange("empId", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                     list="employee-list"
  //                     disabled={employees.length === 0}
  //                   />
  //                   <datalist id="employee-list">
  //                     {employees.map((emp) => (
  //                       <option key={emp.empId} value={emp.empId}>
  //                         {emp.employeeName}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   {newEmployeeRate.employeeName || ""}
  //                 </td>
  //                 {/* <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newEmployeeRate.plc || ""}
  //                     onChange={(e) => {
  //                       handleNewEmployeeRateChange("plc", e.target.value);
  //                       setPlcSearch(e.target.value);
  //                     }}
  //                     className="w-full p-1 border rounded text-xs"
  //                     list="plc-list"
  //                   />
  //                   <datalist id="plc-list">
  //                     {plcs.map((plc) => (
  //                       <option
  //                         key={plc.laborCategoryCode}
  //                         value={plc.laborCategoryCode}
  //                       >
  //                         {plc.description}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td> */}
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newEmployeeRate.plc || ""}
  //                     onChange={(e) => {
  //                       handleNewEmployeeRateChange("plc", e.target.value);
  //                       setPlcSearch(e.target.value);
  //                     }}
  //                     className="w-full p-1 border rounded text-xs"
  //                     list="plc-list"
  //                   />
  //                   <datalist id="plc-list">
  //                     {plcs.map((plc) => (
  //                       <option
  //                         key={plc.laborCategoryCode}
  //                         value={plc.laborCategoryCode}
  //                       >
  //                         {plc.description}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   {plcs.find(
  //                     (plc) => plc.laborCategoryCode === newEmployeeRate.plc
  //                   )?.description || ""}
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="number"
  //                     value={newEmployeeRate.billRate || ""}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange("billRate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <select
  //                     value={newEmployeeRate.rateType}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange("rateType", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   >
  //                     {rateTypeOptions.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="date"
  //                     value={newEmployeeRate.startDate || ""}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange("startDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="date"
  //                     value={newEmployeeRate.endDate || ""}
  //                     onChange={(e) =>
  //                       handleNewEmployeeRateChange("endDate", e.target.value)
  //                     }
  //                     className="w-full p-1 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                     <button
  //                       onClick={handleSaveNewEmployeeRate}
  //                       className="bg-green-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-green-600 transition w-full sm:w-auto"
  //                       disabled={loading}
  //                     >
  //                       Save
  //                     </button>
  //                     <button
  //                       onClick={() => setNewEmployeeRate(null)}
  //                       className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-gray-600 transition w-full sm:w-auto"
  //                       disabled={loading}
  //                     >
  //                       Cancel
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //     {/* Vendor Billing Rates Schedule */}
  //     {/* <div className="mb-4">
  //       <h3 className="text-sm font-semibold">Vendor Billing Rates Schedule</h3>
  //       <div className="overflow-x-auto overflow-y-auto max-h-64"> */}
  //     <div className="mb-4">
  //       <div className="flex justify-between items-center mb-2">
  //         <h3 className="text-sm font-semibold">
  //           Vendor Billing Rates Schedule
  //         </h3>
  //         <div className="w-1/5"></div>
  //         <button
  //           onClick={handleAddVendorRow}
  //           className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
  //           disabled={loading || newVendorRate}
  //         >
  //           Add
  //         </button>
  //       </div>
  //       <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
  //         <table className="w-full text-xs border-collapse">
  //           <thead className="sticky top-0 z-10 bg-gray-100">
  //             <tr className="bg-gray-100">
  //               <th className="border p-2 font-normal sm:w-1/8">Lookup Type</th>
  //               <th className="border p-2 font-normal sm:w-1/8">Vendor</th>
  //               <th className="border p-2 font-normal sm:w-1/8">Vendor Name</th>
  //               <th className="border p-2 font-normal sm:w-1/8">
  //                 Vendor Employee ID
  //               </th>
  //               <th className="border p-2 font-normal sm:w-1/8">
  //                 Vendor Employee Name
  //               </th>
  //               <th className="border p-2 font-normal sm:w-1/8">PLC</th>
  //               <th className="border p-2 font-normal sm:w-1/8">
  //                 PLC Description
  //               </th>
  //               <th className="border p-2 font-normal sm:w-1/8">Bill Rate</th>
  //               <th className="border p-2 font-normal">Rate Type</th>
  //               <th className="border p-2 font-normal">Start Date</th>
  //               <th className="border p-2 font-normal">End Date</th>
  //               <th className="border p-2 font-normal sm:w-1/8">Actions</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {loadingVendor ? (
  //               <tr>
  //                 <td colSpan="12" className="border p-2 text-center">
  //                   Loading...
  //                 </td>
  //               </tr>
  //             ) : vendorBillingRates.length === 0 && !newVendorRate ? (
  //               <tr>
  //                 <td colSpan="12" className="border p-2 text-center">
  //                   No data available
  //                 </td>
  //               </tr>
  //             ) : (
  //               vendorBillingRates.map((item) => (
  //                 <tr
  //                   key={item.id}
  //                   className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
  //                 >
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <select
  //                         value={
  //                           editVendorFields[item.id]?.lookupType ??
  //                           item.lookupType
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "lookupType",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-1 border rounded text-xs"
  //                       >
  //                         {vendorLookupTypeOptions.map((option) => (
  //                           <option key={option} value={option}>
  //                             {option}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     ) : (
  //                       <span>{item.lookupType}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorFields[item.id]?.vendorId || item.vendorId
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "vendorId",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-2 border rounded text-xs"
  //                         list="vendor-list"
  //                       />
  //                     ) : (
  //                       <span>{item.vendorId}</span>
  //                     )}
  //                     <datalist id="vendor-list">
  //                       {vendorEmployees.map((v) => (
  //                         <option
  //                           key={`${v.vendId}-${v.empId}`}
  //                           value={v.vendId}
  //                         >
  //                           {v.employeeName}
  //                         </option>
  //                       ))}
  //                     </datalist>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorFields[item.id]?.vendorName ||
  //                           item.vendorName
  //                         }
  //                         readOnly
  //                         className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       />
  //                     ) : (
  //                       <span>{item.vendorName}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorFields[item.id]?.vendorEmployee ||
  //                           item.vendorEmployee
  //                         }
  //                         readOnly
  //                         className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       />
  //                     ) : (
  //                       <span>{item.vendorEmployee}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorFields[item.id]?.vendorEmployeeName ||
  //                           item.vendorEmployeeName
  //                         }
  //                         readOnly
  //                         className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       />
  //                     ) : (
  //                       <span>{item.vendorEmployeeName}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={editVendorFields[item.id]?.plc || item.plc}
  //                         onChange={(e) => {
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "plc",
  //                             e.target.value
  //                           );
  //                           setPlcSearch(e.target.value);
  //                         }}
  //                         className="w-full p-2 border rounded text-xs"
  //                         list="plc-list"
  //                       />
  //                     ) : (
  //                       <span>{item.plc}</span>
  //                     )}
  //                     <datalist id="plc-list">
  //                       {plcs.map((plc) => (
  //                         <option
  //                           key={plc.laborCategoryCode}
  //                           value={plc.laborCategoryCode}
  //                         >
  //                           {plc.description}
  //                         </option>
  //                       ))}
  //                     </datalist>
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorFields[item.id]?.plcDescription ||
  //                           item.plcDescription ||
  //                           plcs.find(
  //                             (plc) =>
  //                               plc.laborCategoryCode ===
  //                               (editVendorFields[item.id]?.plc || item.plc)
  //                           )?.description ||
  //                           ""
  //                         }
  //                         readOnly
  //                         className="w-full p-2 border rounded text-xs bg-gray-100"
  //                       />
  //                     ) : (
  //                       <span>{item.plcDescription}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2 sm:w-1/8">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="text"
  //                         value={
  //                           editVendorBillRate[item.id] ?? item.billRate ?? ""
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorBillRateChange(item.id, e.target.value)
  //                         }
  //                         className="w-full p-2 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.billRate}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2">
  //                     {editingVendorRowId === item.id ? (
  //                       <select
  //                         value={
  //                           editVendorFields[item.id]?.rateType ?? item.rateType
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "rateType",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-2 border rounded text-xs"
  //                       >
  //                         {rateTypeOptions.map((option) => (
  //                           <option key={option} value={option}>
  //                             {option}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     ) : (
  //                       <span>{item.rateType}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editVendorFields[item.id]?.startDate ??
  //                           item.startDate
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "startDate",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-2 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.startDate}</span>
  //                     )}
  //                   </td>
  //                   <td className="border p-2">
  //                     {editingVendorRowId === item.id ? (
  //                       <input
  //                         type="date"
  //                         value={
  //                           editVendorFields[item.id]?.endDate ??
  //                           item.endDate ??
  //                           ""
  //                         }
  //                         onChange={(e) =>
  //                           handleVendorFieldChange(
  //                             item.id,
  //                             "endDate",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full p-2 border rounded text-xs"
  //                       />
  //                     ) : (
  //                       <span>{item.endDate || ""}</span>
  //                     )}
  //                   </td>

  //                   <td className="border p-2 sm:w-1/8">
  //                     <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                       {editingVendorRowId === item.id ? (
  //                         <>
  //                           <button
  //                             onClick={() => handleUpdateVendor(item.id)}
  //                             className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loading}
  //                             title="Save"
  //                           >
  //                             <FaSave className="text-sm" />
  //                           </button>
  //                           <button
  //                             onClick={() => setEditingVendorRowId(null)}
  //                             className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Cancel"
  //                           >
  //                             <FaTimes className="text-sm" />
  //                           </button>
  //                         </>
  //                       ) : (
  //                         <>
  //                           <button
  //                             onClick={() => handleEditVendorRow(item.id)}
  //                             className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             disabled={loadingAction[item.id]}
  //                             title="Edit"
  //                           >
  //                             <FaEdit className="text-sm" />
  //                           </button>
  //                           <button
  //                             onClick={() => handleDeleteVendor(item.id)}
  //                             className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
  //                             // disabled={loadingAction[item.id]}
  //                             disabled={loading}
  //                             title="Delete"
  //                           >
  //                             {/* {loadingAction[item.id] ? (
  //                             <span className="animate-spin">⌛</span>
  //                           ) : (
  //                             <FaTrash className="text-sm" />
  //                           )} */}
  //                             <FaTrash className="text-sm" />
  //                           </button>
  //                         </>
  //                       )}
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ))
  //             )}
  //             {newVendorRate && (
  //               <tr className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0">
  //                 <td className="border p-2 sm:w-1/8">
  //                   <select
  //                     value={newVendorRate.lookupType}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("lookupType", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs"
  //                   >
  //                     {vendorLookupTypeOptions.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.vendorId || ""}
  //                     onChange={(e) => {
  //                       const selectedVend = vendorEmployees.find(
  //                         (v) => v.vendId === e.target.value
  //                       );
  //                       setNewVendorRate((prev) => ({
  //                         ...prev,
  //                         vendorId: e.target.value,
  //                         vendorName: selectedVend
  //                           ? selectedVend.employeeName
  //                           : prev.vendorName,
  //                         vendorEmployee: selectedVend
  //                           ? selectedVend.empId
  //                           : prev.vendorEmployee,
  //                         vendorEmployeeName: selectedVend
  //                           ? selectedVend.employeeName
  //                           : prev.vendorEmployeeName,
  //                       }));
  //                     }}
  //                     className="w-full p-1 border rounded text-xs"
  //                     list="vendor-list"
  //                   />
  //                   <datalist id="vendor-list">
  //                     {vendorEmployees.map((v, index) => (
  //                       // <option key={`${v.vendId}-${v.empId}`} value={v.vendId}>
  //                       <option
  //                         key={`${v.vendId}-${v.empId}-${index}`}
  //                         value={v.vendId}
  //                       >
  //                         {v.employeeName}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.vendorName || ""}
  //                     readOnly
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("vendorName", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.vendorEmployee || ""}
  //                     readOnly
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange(
  //                         "vendorEmployee",
  //                         e.target.value
  //                       )
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/80">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.vendorEmployeeName || ""}
  //                     readOnly
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange(
  //                         "vendorEmployeeName",
  //                         e.target.value
  //                       )
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/18">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.plc || ""}
  //                     onChange={(e) => {
  //                       handleNewVendorRateChange("plc", e.target.value);
  //                       setPlcSearch(e.target.value);
  //                     }}
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                     list="plc-list"
  //                   />
  //                   <datalist id="plc-list">
  //                     {plcs.map((plc) => (
  //                       <option
  //                         key={plc.laborCategoryCode}
  //                         value={plc.laborCategoryCode}
  //                       >
  //                         {plc.description}
  //                       </option>
  //                     ))}
  //                   </datalist>
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   {plcs.find(
  //                     (plc) => plc.laborCategoryCode === newVendorRate.plc
  //                   )?.description || ""}
  //                 </td>
  //                 {/* <td className="border p-2 sm:w-1/18">
  //                   <input
  //                     type="text"
  //                     value={newVendorRate.billRate || ""}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("billRate", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td> */}
  //                 <td>
  //                   <input
  //                     type="number"
  //                     value={newVendorRate.billRate || ""}
  //                     onChange={(e) => {
  //                       const val = e.target.value;
  //                       if (/^\d*\.?\d*$/.test(val)) {
  //                         // allows only numbers + decimal
  //                         handleNewVendorRateChange("billRate", val);
  //                       }
  //                     }}
  //                     className="w-full p-2 border rounded text-xs"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/18">
  //                   <select
  //                     value={newVendorRate.rateType}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("rateType", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   >
  //                     {rateTypeOptions.map((option) => (
  //                       <option key={option} value={option}>
  //                         {option}
  //                       </option>
  //                     ))}
  //                   </select>
  //                 </td>

  //                 {/* <td className="border p-2 sm:w-1/18">
  //                   <input
  //                     type="date"
  //                     value={newVendorRate.startDate || ""}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("startDate", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td>
  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="date"
  //                     value={newVendorRate.endDate || ""}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("endDate", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                   />
  //                 </td> */}

  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="date"
  //                     value={newVendorRate.startDate || ""}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("startDate", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                     min={selectedPlan.projStartDt} // cannot be before project start
  //                     max={selectedPlan.projEndDt} // cannot be after project end
  //                   />
  //                 </td>

  //                 <td className="border p-2 sm:w-1/8">
  //                   <input
  //                     type="date"
  //                     value={newVendorRate.endDate || ""}
  //                     onChange={(e) =>
  //                       handleNewVendorRateChange("endDate", e.target.value)
  //                     }
  //                     className="w-full p-2 border rounded text-xs bg-gray-100"
  //                     min={newVendorRate.startDate || selectedPlan.projStartDt} // must be >= startDate
  //                     max={selectedPlan.projEndDt} // cannot be after project end
  //                   />
  //                 </td>

  //                 <td className="border p-2 sm:w-1/10">
  //                   <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
  //                     <button
  //                       onClick={handleSaveNewVendorRate}
  //                       className="bg-green-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-green-600 transition w-full sm:w-auto"
  //                       disabled={loading}
  //                     >
  //                       Save
  //                     </button>
  //                     <button
  //                       onClick={() => setNewVendorRate(null)}
  //                       className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-gray-600 transition w-full sm:w-auto"
  //                       disabled={loading}
  //                     >
  //                       Cancel
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             )}
  //             {/* <tr>
  //               <td colSpan="12" className="border p-2">
  //                 <button
  //                   onClick={handleAddVendorRow}
  //                   className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition"
  //                   disabled={loading || newVendorRate}
  //                 >
  //                   Add
  //                 </button>
  //               </td>
  //             </tr> */}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="border p-2 sm:p-4 bg-gray-50 rounded shadow min-h-[150px] scroll-mt-16 text-xs">
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      {/* Project Labor Categories Billing Rates Schedule */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 ">
          <h3 className="text-sm font-semibold">
            Project Labor Categories Billing Rates Schedule
          </h3>
          <div className="w-1/5"></div>
          <button
            onClick={handleAddRow}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
            disabled={loading || newRate}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr className="bg-gray-100">
                <th className="border p-2 font-normal">Plc</th>
                <th className="border p-2 font-normal">Bill Rate</th>
                <th className="border p-2 font-normal">Rate Type</th>
                <th className="border p-2 font-normal">Start Date</th>
                <th className="border p-2 font-normal">End Date</th>
                <th className="border p-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newRate && (
                <tr
                  key="new-rate"
                  className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
                >
                  <td className="border p-2 sm:w-1/5">
                    <input
                      type="text"
                      value={newRate.plc || ""}
                      onChange={(e) => {
                        handleNewRateChange("plc", e.target.value);
                        setPlcSearch(e.target.value);
                      }}
                      className="w-full p-1 border rounded text-xs"
                      list="plc-list"
                    />
                    <datalist
                      id="plc-list"
                      style={dropdownStyles.noBorderDropdown}

                    >
                      {plcs.map((plc, index) => (
                        <option
                           key={`${plc.laborCategoryCode}-${index}`} // ✅ Make key unique
                          // key={plc.laborCategoryCode}
                          value={plc.laborCategoryCode}
                          style={dropdownStyles.noBorderDropdown}
                        >
                          {plc.description}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  {/* <td className="border p-2 sm:w-1/5">
                    <input
                      type="text"
                      value={newRate.billRate || ""}
                      onChange={(e) =>
                        handleNewRateChange("billRate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td> */}
                  {/* <td className="border p-2 sm:w-1/5">
                    <input
                      type="text"
                      value={newRate.billRate || ""}
                      onChange={(e) =>
                        handleNewRateChange("billRate", e.target.value)
                      }
                      onBlur={() => {
                        if (newRate.billRate) {
                          const num = parseFloat(
                            newRate.billRate.replace(/,/g, "")
                          );
                          if (!isNaN(num)) {
                            // format with US commas + 2 decimals
                            handleNewRateChange(
                              "billRate",
                              num.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            );
                          }
                        }
                      }}
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td> */}
                  <td className="border p-2 sm:w-1/5">
                    <input
                      type="text"
                      value={newRate.billRate || ""}
                      onChange={(e) =>
                        handleNewRateChange("billRate", e.target.value)
                      }
                      onBlur={() => {
                        if (newRate.billRate) {
                          const num = parseFloat(
                            newRate.billRate.replace(/,/g, "")
                          );
                          if (!isNaN(num)) {
                            handleNewRateChange(
                              "billRate",
                              num.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            );
                          }
                        }
                      }}
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td>
 
                  <td className="border p-2 sm:w-1/5">
                    <select
                      value={newRate.rateType}
                      onChange={(e) =>
                        handleNewRateChange("rateType", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    >
                      {rateTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* <td className="border p-2 sm:w-1/5">
                    <input
                      type="date"
                      value={newRate.startDate || ""}
                      onChange={(e) =>
                        handleNewRateChange("startDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/5">
                    <input
                      type="date"
                      value={newRate.endDate || ""}
                      onChange={(e) =>
                        handleNewRateChange("endDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td> */}
                  <td className="border p-2 sm:w-1/5">
                    <input
                      type="date"
                      value={newRate.startDate || ""}
                      onChange={(e) =>
                        handleNewRateChange("startDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                      min={selectedPlan.projStartDt} // ✅ cannot pick before project start
                      max={selectedPlan.projEndDt} // ✅ cannot pick after project end
                    />
                  </td>

                  <td className="border p-2 sm:w-1/5">
                    <input
                      type="date"
                      value={newRate.endDate || ""}
                      onChange={(e) =>
                        handleNewRateChange("endDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                      min={newRate.startDate || selectedPlan.projStartDt} // ✅ end date cannot be before start date
                      max={selectedPlan.projEndDt} // ✅ cannot pick after project end
                    />
                  </td>

                  <td className="border p-2 sm:w-1/5">
                    <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={handleSaveNewRate}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                        disabled={loading}
                        title="Save"
                      >
                        <FaSave className="text-sm" />
                      </button>
                      <button
                        onClick={() => setNewRate(null)}
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                        disabled={loading}
                        title="Cancel"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {loadingPLC ? (
                <tr key="loading">
                  <td colSpan="6" className="border p-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : billingRatesSchedule.length === 0 ? (
                <tr key="no-data">
                  <td colSpan="6" className="border p-2 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                billingRatesSchedule.map((item) => (
                  <tr
                    key={item.id}
                    className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
                  >
                    <td className="border p-2 sm:w-1/8">
                      <span>{item.plc}</span>
                    </td>
                    {/* <td className="border p-2 sm:w-1/5">
                      {editingProjectPlcRowId === item.id ? (
                        <input
                          type="text"
                          value={editBillRate[item.id] ?? item.billRate}
                          onChange={(e) =>
                            handleBillRateChange(item.id, e.target.value)
                          }
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td> */}
                    <td className="border p-2 sm:w-1/5">
                      {editingProjectPlcRowId === item.id ? (
                        <input
                          type="text"
                          value={editBillRate[item.id] ?? item.billRate}
                          onChange={(e) =>
                            handleBillRateChange(item.id, e.target.value)
                          }
                          onBlur={() => {
                            const raw = editBillRate[item.id] ?? item.billRate;
                            const num = parseFloat(
                              (raw || "").replace(/,/g, "")
                            );
                            if (!isNaN(num)) {
                              handleBillRateChange(
                                item.id,
                                num.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              );
                            }
                          }}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/5">
                      {editingProjectPlcRowId === item.id ? (
                        <select
                          value={
                            editProjectPlcFields[item.id]?.rateType ??
                            item.rateType
                          }
                          onChange={(e) =>
                            handleProjectPlcFieldChange(
                              item.id,
                              "rateType",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                        >
                          {rateTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{item.rateType}</span>
                      )}
                    </td>

                    <td className="border p-2 sm:w-1/5">
                      {editingProjectPlcRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editProjectPlcFields[item.id]?.startDate ??
                            item.startDate
                          }
                          onChange={(e) =>
                            handleProjectPlcFieldChange(
                              item.id,
                              "startDate",
                              e.target.value
                            )
                          }
                          min={selectedPlan.projStartDt} // ✅ cannot pick before project start
                          max={selectedPlan.projEndDt} // ✅ cannot pick after project end
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.startDate}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/5">
                      {editingProjectPlcRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editProjectPlcFields[item.id]?.endDate ??
                            item.endDate ??
                            ""
                          }
                          onChange={(e) =>
                            handleProjectPlcFieldChange(
                              item.id,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                          min={
                            editProjectPlcFields[item.id]?.startDate ??
                            item.startDate ??
                            selectedPlan.projStartDt
                          } // ✅ end date cannot be before start date
                          max={selectedPlan.projEndDt} // ✅ cannot pick after project end
                        />
                      ) : (
                        <span>{item.endDate || ""}</span>
                      )}
                    </td>

                    <td className="border p-2 sm:w-1/5">
                      <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        {editingProjectPlcRowId === item.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(item.id)}
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loading}
                              title="Save"
                            >
                              <FaSave className="text-sm" />
                            </button>
                            <button
                              onClick={() => setEditingProjectPlcRowId(null)}
                              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loading}
                              title="Cancel"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditProjectPlcRow(item.id)}
                              className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loading}
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loading}
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Billing Rates Schedule */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-semibold">Employee Billing Rates Schedule</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-64"> */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold">
            Employee Billing Rates Schedule
          </h3>
          <div className="w-1/5"></div>
          <button
            onClick={handleAddEmployeeRow}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
            disabled={loading || newEmployeeRate}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr className="bg-gray-100">
                <th className="border p-2 font-normal">Lookup Type</th>
                <th className="border p-2 font-normal">Employee</th>
                <th className="border p-2 font-normal">Employee Name</th>
                <th className="border p-2 font-normal">PLC</th>
                <th className="border p-2 font-normal">PLC Description</th>
                <th className="border p-2 font-normal">Bill Rate</th>
                <th className="border p-2 font-normal">Rate Type</th>
                <th className="border p-2 font-normal">Start Date</th>
                <th className="border p-2 font-normal">End Date</th>
                <th className="border p-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newEmployeeRate && (
                <tr className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0">
                  <td className="border p-2 sm:w-1/8">
                    <select
                      value={newEmployeeRate.lookupType}
                      onChange={(e) =>
                        handleNewEmployeeRateChange(
                          "lookupType",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded text-xs"
                    >
                      {lookupTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newEmployeeRate.empId || ""}
                      onChange={(e) =>
                        handleNewEmployeeRateChange("empId", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                      list="employee-list"
                      disabled={employees.length === 0}
                    />
                    <datalist id="employee-list">
                      {employees.map((emp, index) => (
                        <option key={`${emp.empId}-${index}`}  value={emp.empId}>
                          {emp.employeeName}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    {newEmployeeRate.employeeName || ""}
                  </td>
                  {/* <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newEmployeeRate.plc || ""}
                      onChange={(e) => {
                        handleNewEmployeeRateChange("plc", e.target.value);
                        setPlcSearch(e.target.value);
                      }}
                      className="w-full p-1 border rounded text-xs"
                      list="plc-list"
                    />
                    <datalist id="plc-list">
                      {plcs.map((plc) => (
                        <option
                          key={plc.laborCategoryCode}
                          value={plc.laborCategoryCode}
                        >
                          {plc.description}
                        </option>
                      ))}
                    </datalist>
                  </td> */}
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newEmployeeRate.plc || ""}
                      onChange={(e) => {
                        handleNewEmployeeRateChange("plc", e.target.value);
                        setPlcSearch(e.target.value);
                      }}
                      className="w-full p-1 border rounded text-xs"
                      list="plc-list"
                    />
                    <datalist id="plc-list">
                      {plcs.map((plc) => (
                        <option
                          key={plc.laborCategoryCode}
                          value={plc.laborCategoryCode}
                        >
                          {plc.description}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    {plcs.find(
                      (plc) => plc.laborCategoryCode === newEmployeeRate.plc
                    )?.description || ""}
                  </td>
                  {/* <td className="border p-2 sm:w-1/8">
                    <input
                      type="number"
                      value={newEmployeeRate.billRate || ""}
                      onChange={(e) =>
                        handleNewEmployeeRateChange("billRate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td> */}
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newEmployeeRate.billRate || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        // ✅ allow only digits, optional commas, optional decimal
                        if (/^[0-9,]*\.?[0-9]*$/.test(val) || val === "") {
                          handleNewEmployeeRateChange("billRate", val);
                        }
                      }}
                      onBlur={() => {
                        const raw = newEmployeeRate.billRate;
                        const num = parseFloat((raw || "").replace(/,/g, ""));
                        if (!isNaN(num)) {
                          handleNewEmployeeRateChange(
                            "billRate",
                            num.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          );
                        }
                      }}
                      className="w-full p-1 border rounded text-xs"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <select
                      value={newEmployeeRate.rateType}
                      onChange={(e) =>
                        handleNewEmployeeRateChange("rateType", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                    >
                      {rateTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="date"
                      value={newEmployeeRate.startDate || ""}
                      onChange={(e) =>
                        handleNewEmployeeRateChange("startDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                      min={selectedPlan.projStartDt}
                      max={selectedPlan.projEndDt}
                    />
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="date"
                      value={newEmployeeRate.endDate || ""}
                      onChange={(e) =>
                        handleNewEmployeeRateChange("endDate", e.target.value)
                      }
                      className="w-full p-1 border rounded text-xs"
                      min={
                        handleNewEmployeeRateChange.startDate ||
                        selectedPlan.projStartDt
                      }
                      max={selectedPlan.projEndDt}
                    />
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={handleSaveNewEmployeeRate}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-green-600 transition w-full sm:w-auto"
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setNewEmployeeRate(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-gray-600 transition w-full sm:w-auto"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {loadingEmployee ? (
                <tr>
                  <td colSpan="10" className="border p-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : employeeBillingRates.length === 0 && !newEmployeeRate ? (
                <tr>
                  <td colSpan="10" className="border p-2 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                employeeBillingRates.map((item) => (
                  <tr
                    key={item.id}
                    className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
                  >
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <select
                          value={
                            editEmployeeFields[item.id]?.lookupType ??
                            item.lookupType
                          }
                          onChange={(e) =>
                            handleNewEmployeeRateChange(
                              "lookupType",
                              e.target.value,
                              item.id
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                        >
                          {lookupTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{item.lookupType}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="text"
                          value={item.empId}
                          onChange={(e) =>
                            handleNewEmployeeRateChange(
                              "empId",
                              e.target.value,
                              item.id
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                          list="employee-list"
                          disabled={employees.length === 0}
                        />
                      ) : (
                        <span>{item.empId}</span>
                      )}
                      <datalist id="employee-list">
                        {employees.map((emp) => (
                          <option key={emp.empId} value={emp.empId}>
                            {emp.employeeName}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      <span>{item.employeeName}</span>
                    </td>
                    {/* <td className="border p-2 sm:w-1/8">
                      <input
                        type="text"
                        value={item.plc}
                        onChange={(e) => {
                          handleNewEmployeeRateChange(
                            "plc",
                            e.target.value,
                            item.id
                          );
                          setPlcSearch(e.target.value);
                        }}
                        className="w-full p-1 border rounded text-xs"
                        list="plc-list"
                        disabled
                      />
                      <datalist id="plc-list">
                        {plcs.map((plc) => (
                          <option
                            key={plc.laborCategoryCode}
                            value={plc.laborCategoryCode}
                          >
                            {plc.description}
                          </option>
                        ))}
                      </datalist>
                    </td> */}
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="text"
                          value={editEmployeeFields[item.id]?.plc || item.plc}
                          onChange={(e) => {
                            handleNewEmployeeRateChange(
                              "plc",
                              e.target.value,
                              item.id
                            );
                            setPlcSearch(e.target.value);
                          }}
                          className="w-full p-1 border rounded text-xs"
                          list="plc-list"
                        />
                      ) : (
                        <span>{item.plc}</span>
                      )}
                      <datalist id="plc-list">
                        {plcs.map((plc) => (
                          <option
                            key={plc.laborCategoryCode}
                            value={plc.laborCategoryCode}
                          >
                            {plc.description}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      <span>
                        {plcs.find((plc) => plc.laborCategoryCode === item.plc)
                          ?.description || item.plcDescription}
                      </span>
                    </td>
                    {/* <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="text"
                          value={editEmployeeBillRate[item.id] ?? item.billRate}
                          onChange={(e) =>
                            handleEmployeeBillRateChange(
                              item.id,
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td> */}
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="text"
                          value={editEmployeeBillRate[item.id] ?? item.billRate}
                          onChange={(e) => {
                            const val = e.target.value;
                            // ✅ allow only digits, optional commas, optional decimal
                            if (/^[0-9,]*\.?[0-9]*$/.test(val) || val === "") {
                              handleEmployeeBillRateChange(item.id, val);
                            }
                          }}
                          onBlur={() => {
                            const raw =
                              editEmployeeBillRate[item.id] ?? item.billRate;
                            const num = parseFloat(
                              (raw || "").replace(/,/g, "")
                            );
                            if (!isNaN(num)) {
                              handleEmployeeBillRateChange(
                                item.id,
                                num.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              );
                            }
                          }}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td>
 
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <select
                          value={
                            editEmployeeFields[item.id]?.rateType ??
                            item.rateType
                          }
                          onChange={(e) =>
                            handleNewEmployeeRateChange(
                              "rateType",
                              e.target.value,
                              item.id
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                        >
                          {rateTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{item.rateType}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editEmployeeFields[item.id]?.startDate ??
                            item.startDate
                          }
                          onChange={(e) =>
                            handleNewEmployeeRateChange(
                              "startDate",
                              e.target.value,
                              item.id
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                          min={selectedPlan.projStartDt}
                          max={selectedPlan.projEndDt}
                        />
                      ) : (
                        <span>{item.startDate}</span>
                      )}
                    </td>

                    <td className="border p-2 sm:w-1/8">
                      {editingEmployeeRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editEmployeeFields[item.id]?.endDate ??
                            item.endDate ??
                            ""
                          }
                          onChange={(e) =>
                            handleNewEmployeeRateChange(
                              "endDate",
                              e.target.value,
                              item.id
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                          min={
                            handleNewEmployeeRateChange.startDate ||
                            selectedPlan.projStartDt
                          }
                          max={selectedPlan.projEndDt}
                        />
                      ) : (
                        <span>{item.endDate || ""}</span>
                      )}
                    </td>
                    {/* <td className="border p-2 sm:w-1/8">
                      <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateEmployee(item.id, {
                              ...item,
                              billRate:
                                editEmployeeBillRate[item.id] || item.billRate,
                            })
                          }
                          className="bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-normal hover:bg-blue-300 transition w-full sm:w-auto"
                          disabled={loading || !item.id}
                        >
                          {editingEmployeeRowId === item.id ? "Save" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(item.id)}
                          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-normal hover:bg-gray-300 transition w-full sm:w-auto"
                          disabled={loading || !item.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td> */}
                    <td className="border p-2 sm:w-1/8">
                      <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        {editingEmployeeRowId === item.id ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateEmployee(item.id, {
                                  ...item,
                                  billRate:
                                    editEmployeeBillRate[item.id] ||
                                    item.billRate,
                                })
                              }
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Save"
                            >
                              {loadingAction[item.id] ? (
                                <span className="animate-spin">⌛</span>
                              ) : (
                                <FaSave className="text-sm" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingEmployeeRowId(null)}
                              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Cancel"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditEmployeeRow(item.id)}
                              className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Edit"
                            >
                              {loadingAction[item.id] ? (
                                <span className="animate-spin">⌛</span>
                              ) : (
                                <FaEdit className="text-sm" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(item.id)}
                              className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Delete"
                            >
                              {loadingAction[item.id] ? (
                                <span className="animate-spin">⌛</span>
                              ) : (
                                <FaTrash className="text-sm" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Billing Rates Schedule */}
      {/* <div className="mb-4">
        <h3 className="text-sm font-semibold">Vendor Billing Rates Schedule</h3>
        <div className="overflow-x-auto overflow-y-auto max-h-64"> */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold">
            Vendor Billing Rates Schedule
          </h3>
          <div className="w-1/5"></div>
          <button
            onClick={handleAddVendorRow}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition mr-4"
            disabled={loading || newVendorRate}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-64 border-b border-gray-300">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr className="bg-gray-100">
                <th className="border p-2 font-normal sm:w-1/8">Lookup Type</th>
                <th className="border p-2 font-normal sm:w-1/8">Vendor</th>
                <th className="border p-2 font-normal sm:w-1/8">Vendor Name</th>
                <th className="border p-2 font-normal sm:w-1/8">
                  Vendor Employee ID
                </th>
                <th className="border p-2 font-normal sm:w-1/8">
                  Vendor Employee Name
                </th>
                <th className="border p-2 font-normal sm:w-1/8">PLC</th>
                <th className="border p-2 font-normal sm:w-1/8">
                  PLC Description
                </th>
                <th className="border p-2 font-normal sm:w-1/8">Bill Rate</th>
                <th className="border p-2 font-normal">Rate Type</th>
                <th className="border p-2 font-normal">Start Date</th>
                <th className="border p-2 font-normal">End Date</th>
                <th className="border p-2 font-normal sm:w-1/8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newVendorRate && (
                <tr className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0">
                  <td className="border p-2 sm:w-1/8">
                    <select
                      value={newVendorRate.lookupType}
                      onChange={(e) =>
                        handleNewVendorRateChange("lookupType", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs"
                    >
                      {vendorLookupTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newVendorRate.vendorId || ""}
                      onChange={(e) => {
                        const selectedVend = vendorEmployees.find(
                          (v) => v.vendId === e.target.value
                        );
                        setNewVendorRate((prev) => ({
                          ...prev,
                          vendorId: e.target.value,
                          vendorName: selectedVend
                            ? selectedVend.employeeName
                            : prev.vendorName,
                          vendorEmployee: selectedVend
                            ? selectedVend.empId
                            : prev.vendorEmployee,
                          vendorEmployeeName: selectedVend
                            ? selectedVend.employeeName
                            : prev.vendorEmployeeName,
                        }));
                      }}
                      className="w-full p-1 border rounded text-xs"
                      list="vendor-list"
                    />
                    <datalist id="vendor-list">
                      {vendorEmployees.map((v, index) => (
                        // <option key={`${v.vendId}-${v.empId}`} value={v.vendId}>
                        <option
                          key={`${v.vendId}-${v.empId}-${index}`}
                          value={v.vendId}
                        >
                          {v.employeeName}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newVendorRate.vendorName || ""}
                      readOnly
                      onChange={(e) =>
                        handleNewVendorRateChange("vendorName", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="text"
                      value={newVendorRate.vendorEmployee || ""}
                      readOnly
                      onChange={(e) =>
                        handleNewVendorRateChange(
                          "vendorEmployee",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/80">
                    <input
                      type="text"
                      value={newVendorRate.vendorEmployeeName || ""}
                      readOnly
                      onChange={(e) =>
                        handleNewVendorRateChange(
                          "vendorEmployeeName",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/18">
                    <input
                      type="text"
                      value={newVendorRate.plc || ""}
                      onChange={(e) => {
                        handleNewVendorRateChange("plc", e.target.value);
                        setPlcSearch(e.target.value);
                      }}
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                      list="plc-list"
                    />
                    <datalist id="plc-list">
                      {plcs.map((plc) => (
                        <option
                          key={plc.laborCategoryCode}
                          value={plc.laborCategoryCode}
                        >
                          {plc.description}
                        </option>
                      ))}
                    </datalist>
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    {plcs.find(
                      (plc) => plc.laborCategoryCode === newVendorRate.plc
                    )?.description || ""}
                  </td>
                  {/* <td className="border p-2 sm:w-1/18">
                    <input
                      type="text"
                      value={newVendorRate.billRate || ""}
                      onChange={(e) =>
                        handleNewVendorRateChange("billRate", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td> */}
                  {/* <td>
                    <input
                      type="number"
                      value={newVendorRate.billRate || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          // allows only numbers + decimal
                          handleNewVendorRateChange("billRate", val);
                        }
                      }}
                      className="w-full p-2 border rounded text-xs"
                    />
                  </td> */}
                  <td>
                    <input
                      type="text" // switch to text so commas work
                      value={newVendorRate.billRate || ""}
                      onChange={(e) => {
                        const val = e.target.value;
 
                        // ✅ allow only numbers, commas, and decimal
                        if (!/^[0-9,]*\.?[0-9]*$/.test(val) && val !== "") {
                          return; // ignore invalid input
                        }
 
                        handleNewVendorRateChange("billRate", val);
                      }}
                      onBlur={() => {
                        if (newVendorRate.billRate) {
                          const num = parseFloat(
                            newVendorRate.billRate.replace(/,/g, "")
                          );
                          if (!isNaN(num) && num > 0) {
                            // ✅ format with commas and 2 decimals
                            handleNewVendorRateChange(
                              "billRate",
                              num.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            );
                          } else {
                            toast.error("Bill Rate must be greater than 0");
                            handleNewVendorRateChange("billRate", "");
                          }
                        }
                      }}
                      className="w-full p-2 border rounded text-xs"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/18">
                    <select
                      value={newVendorRate.rateType}
                      onChange={(e) =>
                        handleNewVendorRateChange("rateType", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    >
                      {rateTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* <td className="border p-2 sm:w-1/18">
                    <input
                      type="date"
                      value={newVendorRate.startDate || ""}
                      onChange={(e) =>
                        handleNewVendorRateChange("startDate", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td>
                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="date"
                      value={newVendorRate.endDate || ""}
                      onChange={(e) =>
                        handleNewVendorRateChange("endDate", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                    />
                  </td> */}

                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="date"
                      value={newVendorRate.startDate || ""}
                      onChange={(e) =>
                        handleNewVendorRateChange("startDate", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                      min={selectedPlan.projStartDt} // cannot be before project start
                      max={selectedPlan.projEndDt} // cannot be after project end
                    />
                  </td>

                  <td className="border p-2 sm:w-1/8">
                    <input
                      type="date"
                      value={newVendorRate.endDate || ""}
                      onChange={(e) =>
                        handleNewVendorRateChange("endDate", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xs bg-gray-100"
                      min={newVendorRate.startDate || selectedPlan.projStartDt} // must be >= startDate
                      max={selectedPlan.projEndDt} // cannot be after project end
                    />
                  </td>

                  <td className="border p-2 sm:w-1/10">
                    <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={handleSaveNewVendorRate}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-green-600 transition w-full sm:w-auto"
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setNewVendorRate(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-gray-600 transition w-full sm:w-auto"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {loadingVendor ? (
                <tr>
                  <td colSpan="12" className="border p-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : vendorBillingRates.length === 0 && !newVendorRate ? (
                <tr>
                  <td colSpan="12" className="border p-2 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                vendorBillingRates.map((item) => (
                  <tr
                    key={item.id}
                    className="sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0"
                  >
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <select
                          value={
                            editVendorFields[item.id]?.lookupType ??
                            item.lookupType
                          }
                          onChange={(e) =>
                            handleVendorFieldChange(
                              item.id,
                              "lookupType",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded text-xs"
                        >
                          {vendorLookupTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{item.lookupType}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorFields[item.id]?.vendorId || item.vendorId
                          }
                          onChange={(e) =>
                            handleVendorFieldChange(
                              item.id,
                              "vendorId",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded text-xs"
                          list="vendor-list"
                        />
                      ) : (
                        <span>{item.vendorId}</span>
                      )}
                      <datalist id="vendor-list">
                        {vendorEmployees.map((v) => (
                          <option
                            key={`${v.vendId}-${v.empId}`}
                            value={v.vendId}
                          >
                            {v.employeeName}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorFields[item.id]?.vendorName ||
                            item.vendorName
                          }
                          readOnly
                          className="w-full p-2 border rounded text-xs bg-gray-100"
                        />
                      ) : (
                        <span>{item.vendorName}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorFields[item.id]?.vendorEmployee ||
                            item.vendorEmployee
                          }
                          readOnly
                          className="w-full p-2 border rounded text-xs bg-gray-100"
                        />
                      ) : (
                        <span>{item.vendorEmployee}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorFields[item.id]?.vendorEmployeeName ||
                            item.vendorEmployeeName
                          }
                          readOnly
                          className="w-full p-2 border rounded text-xs bg-gray-100"
                        />
                      ) : (
                        <span>{item.vendorEmployeeName}</span>
                      )}
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={editVendorFields[item.id]?.plc || item.plc}
                          onChange={(e) => {
                            handleVendorFieldChange(
                              item.id,
                              "plc",
                              e.target.value
                            );
                            setPlcSearch(e.target.value);
                          }}
                          className="w-full p-2 border rounded text-xs"
                          list="plc-list"
                        />
                      ) : (
                        <span>{item.plc}</span>
                      )}
                      <datalist id="plc-list">
                        {plcs.map((plc) => (
                          <option
                            key={plc.laborCategoryCode}
                            value={plc.laborCategoryCode}
                          >
                            {plc.description}
                          </option>
                        ))}
                      </datalist>
                    </td>
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorFields[item.id]?.plcDescription ||
                            item.plcDescription ||
                            plcs.find(
                              (plc) =>
                                plc.laborCategoryCode ===
                                (editVendorFields[item.id]?.plc || item.plc)
                            )?.description ||
                            ""
                          }
                          readOnly
                          className="w-full p-2 border rounded text-xs bg-gray-100"
                        />
                      ) : (
                        <span>{item.plcDescription}</span>
                      )}
                    </td>
                    {/* <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorBillRate[item.id] ?? item.billRate ?? ""
                          }
                          onChange={(e) =>
                            handleVendorBillRateChange(item.id, e.target.value)
                          }
                          className="w-full p-2 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td> */}
                    <td className="border p-2 sm:w-1/8">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="text"
                          value={
                            editVendorBillRate[item.id] ?? item.billRate ?? ""
                          }
                          onChange={(e) =>
                            handleVendorBillRateChange(item.id, e.target.value)
                          }
                          onBlur={() => {
                            const raw =
                              editVendorBillRate[item.id] ?? item.billRate;
                            const num = parseFloat(
                              (raw || "").replace(/,/g, "")
                            );
                            if (!isNaN(num) && num > 0) {
                              handleVendorBillRateChange(
                                item.id,
                                num.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              );
                            } else if (raw) {
                              toast.error("Bill Rate must be greater than 0.");
                            }
                          }}
                          className="w-full p-2 border rounded text-xs"
                        />
                      ) : (
                        <span>{item.billRate}</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {editingVendorRowId === item.id ? (
                        <select
                          value={
                            editVendorFields[item.id]?.rateType ?? item.rateType
                          }
                          onChange={(e) =>
                            handleVendorFieldChange(
                              item.id,
                              "rateType",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded text-xs"
                        >
                          {rateTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{item.rateType}</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editVendorFields[item.id]?.startDate ??
                            item.startDate
                          }
                          onChange={(e) =>
                            handleVendorFieldChange(
                              item.id,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded text-xs"
                          min={selectedPlan.projStartDt} // cannot be before project start
                          max={selectedPlan.projEndDt} // cannot be after project end
                        />
                      ) : (
                        <span>{item.startDate}</span>
                      )}
                    </td>
                    <td className="border p-2">
                      {editingVendorRowId === item.id ? (
                        <input
                          type="date"
                          value={
                            editVendorFields[item.id]?.endDate ??
                            item.endDate ??
                            ""
                          }
                          onChange={(e) =>
                            handleVendorFieldChange(
                              item.id,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded text-xs"
                          min={
                            handleVendorFieldChange.startDate ||
                            selectedPlan.projStartDt
                          } // must be >= startDate
                          max={selectedPlan.projEndDt} // cannot be after project end
                        />
                      ) : (
                        <span>{item.endDate || ""}</span>
                      )}
                    </td>

                    <td className="border p-2 sm:w-1/8">
                      <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        {editingVendorRowId === item.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateVendor(item.id)}
                              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loading}
                              title="Save"
                            >
                              <FaSave className="text-sm" />
                            </button>
                            <button
                              onClick={() => setEditingVendorRowId(null)}
                              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Cancel"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditVendorRow(item.id)}
                              className="bg-blue-200 text-blue-800 p-2 rounded hover:bg-blue-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              disabled={loadingAction[item.id]}
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteVendor(item.id)}
                              className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition w-full sm:w-8 h-8 flex items-center justify-center"
                              // disabled={loadingAction[item.id]}
                              disabled={loading}
                              title="Delete"
                            >
                              {/* {loadingAction[item.id] ? (
                              <span className="animate-spin">⌛</span>
                            ) : (
                              <FaTrash className="text-sm" />
                            )} */}
                              <FaTrash className="text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {/* <tr>
                <td colSpan="12" className="border p-2">
                  <button
                    onClick={handleAddVendorRow}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-normal hover:bg-blue-600 transition"
                    disabled={loading || newVendorRate}
                  >
                    Add
                  </button>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};

export default PLCComponent;
