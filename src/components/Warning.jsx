import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from "./config";

const Warning = ({ planId, projectId, templateId, planType }) => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarnings = async () => {
    if (!planId) {
      setWarnings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/Project/GetWarningsByPlId/${planId}`
      );
      
      setWarnings(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch warnings');
      console.error('Error fetching warnings:', err);
      setWarnings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, [planId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-gray-600 text-sm">Loading warnings...</div>
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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className=" text-black">
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                  Warning
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                  ProjId
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                  EmplId
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                  Year
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">
                  Month
                </th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((warning, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                    {warning.warning || ''}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                    {warning.projId || ''}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                    {warning.emplId || ''}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                    {warning.year || ''}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs text-gray-900">
                    {warning.month === 0 ? 'All Year' : warning.month || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Warning;
