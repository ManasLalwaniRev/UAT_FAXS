import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "./config";
import EmployeeSchedule from "./EmployeeSchedule";

const Warning = ({ planId, projectId, templateId, planType, emplId }) => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmployeeSchedule, setShowEmployeeSchedule] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // const fetchWarnings = async () => {
  //   if (!planId) {
  //     setWarnings([]);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `${backendUrl}/Project/GetWarningsByPlId/${planId}`
  //     );

  //     setWarnings(response.data || []);
  //     setError(null);
  //   } catch (err) {
  //     setError("Failed to fetch warnings");
  //     // console.error("Error fetching warnings:", err);
  //     setWarnings([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchWarnings = async () => {
      setLoading(true);
      try {
        let url;
        if (emplId) {
          url = `${backendUrl}/Project/GetWarningsByEMployee/${planId}/${emplId}`;
        } else {
          url = `${backendUrl}/Project/GetWarningsByPlId/${planId}`; // example fallback endpoint
        }
        const response = await axios.get(url);
        setWarnings(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch warnings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchWarnings();
    }
  }, [planId, emplId]);

  const handleEmployeeRowClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowEmployeeSchedule(true);
  };

  const handleCloseEmployeeSchedule = () => {
    setShowEmployeeSchedule(false);
    setSelectedEmployeeId(null);
  };

  // useEffect(() => {
  //   fetchWarnings();
  // }, [planId,emplId]);

  if (loading) {
    return (
      // <div className="flex justify-center items-center py-4">
      //   <div className="text-gray-600 text-sm">Loading warnings...</div>
      // </div>
      <div className="p-4 font-inter flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-xs text-gray-600">Loading Warnings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {warnings.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No warnings found for this project.
        </div>
      ) : (
        <div
          className="overflow-x-auto overflow-y-auto border-line"
          style={{ maxHeight: "300px" }}
        >
          <table className="min-w-full table">
            <thead className="thead">
              <tr>
                <th className="th-thead">Warning</th>
                <th className="th-thead">ProjId</th>
                <th className="th-thead">EmplId</th>
                <th className="th-thead">Year</th>
                <th className="th-thead">Month</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {warnings.map((warning, index) => (
                <tr
                  key={index}
                  className={`${
                    index === 1
                      ? "hover:bg-blue-50 cursor-pointer bg-blue-25"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={
                    index === 1
                      ? () => handleEmployeeRowClick(warning.emplId)
                      : undefined
                  }
                  title={index === 1 ? "Click to view employee schedule" : ""}
                >
                  <td className="tbody-td text-left">
                    {warning.warning || ""}
                  </td>
                  <td className="tbody-td">{warning.projId || ""}</td>
                  <td className="tbody-td">{warning.emplId || ""}</td>
                  <td className="tbody-td">{warning.year || ""}</td>
                  <td className="tbody-td">
                    {warning.month === 0 ? "All Year" : warning.month || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Schedule Modal */}
      {showEmployeeSchedule && (
        <EmployeeSchedule
          employeeId={selectedEmployeeId}
          onClose={handleCloseEmployeeSchedule}
        />
      )}
    </div>
  );
};

export default Warning;
