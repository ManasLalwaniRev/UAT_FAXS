import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeSchedule = ({ employeeId, onClose }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [monthlyHeaders, setMonthlyHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch monthly headers from mock API
  const fetchMonthlyHeaders = async () => {
    try {
      const response = await axios.get(
        "https://mocki.io/v1/33dc8e34-51a7-4212-8de4-d842345d49f9"
      );

      // Extract month headers from the API response
      if (response.data && Array.isArray(response.data)) {
        setMonthlyHeaders(response.data);
      } else {
        // Fallback headers if API fails
        setMonthlyHeaders([
          "Jan 2025",
          "Feb 2025",
          "Mar 2025",
          "Apr 2025",
          "May 2025",
          "Jun 2025",
          "Jul 2025",
          "Aug 2025",
          "Sep 2025",
          "Oct 2025",
          "Nov 2025",
          "Dec 2025",
        ]);
      }
    } catch (err) {
      // console.error('Error fetching headers:', err);
      // Fallback headers
      setMonthlyHeaders([
        "Jan 2025",
        "Feb 2025",
        "Mar 2025",
        "Apr 2025",
        "May 2025",
        "Jun 2025",
        "Jul 2025",
        "Aug 2025",
        "Sep 2025",
        "Oct 2025",
        "Nov 2025",
        "Dec 2025",
      ]);
    }
  };

  // Fetch employee schedule data
  const fetchScheduleData = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);

      // Mock schedule data - replace with your actual API endpoint
      const mockData = [
        {
          projectId: "PRJ-001",
          source: "Internal",
          version: "v1.2",
          manager: "John Smith",
          total: "1890 hrs",
          "Jan 2025": "160",
          "Feb 2025": "144",
          "Mar 2025": "152",
          "Apr 2025": "152",
          "May 2025": "160",
          "Jun 2025": "144",
          "Jul 2025": "168",
          "Aug 2025": "152",
          "Sep 2025": "144",
          "Oct 2025": "160",
          "Nov 2025": "152",
          "Dec 2025": "160",
        },
        {
          projectId: "PRJ-002",
          source: "External",
          version: "v2.1",
          manager: "Sarah Johnson",
          total: "2040 hrs",
          "Jan 2025": "168",
          "Feb 2025": "152",
          "Mar 2025": "160",
          "Apr 2025": "168",
          "May 2025": "176",
          "Jun 2025": "160",
          "Jul 2025": "184",
          "Aug 2025": "168",
          "Sep 2025": "152",
          "Oct 2025": "176",
          "Nov 2025": "168",
          "Dec 2025": "184",
        },
      ];

      setScheduleData(mockData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch schedule data");
      // console.error('Error fetching schedule:', err);
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyHeaders();
  }, []);

  useEffect(() => {
    fetchScheduleData();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading employee schedule...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Employee Schedule
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Employee Schedule
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Employee ID: {employeeId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {scheduleData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No schedule data found for this employee.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {/* Fixed columns */}
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-800 sticky left-0 bg-gray-100 z-10">
                    Project ID
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-800">
                    Source
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-800">
                    Version
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-800">
                    Manager
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-800">
                    Total
                  </th>

                  {/* Dynamic monthly columns */}
                  {monthlyHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-800 min-w-[80px]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {/* Fixed columns */}
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900 sticky left-0 bg-white font-medium">
                      {row.projectId || ""}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                      {row.source || ""}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                      {row.version || ""}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                      {row.manager || ""}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900 font-semibold">
                      {row.total || ""}
                    </td>

                    {/* Dynamic monthly columns */}
                    {monthlyHeaders.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-3 py-2 text-xs text-gray-900 text-center"
                      >
                        {row[header] || "0"}
                      </td>
                    ))}
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

export default EmployeeSchedule;
