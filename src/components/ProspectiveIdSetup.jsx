// ProspectiveIDSetup.jsx
'use client';

import React, { useState, useCallback } from 'react';
import { backendUrl } from "./config";

// Utility function for combining Tailwind CSS classes
const cn = (...args) => {
  return args.filter(Boolean).join(' ');
};

// Static Data for Employee Tab - ADDED MORE ENTRIES
const initialEmployeeData = [
  { id: 1, hourlyRate: '60.00', plc: 'DEV001', salary: '120000', homeOrg: 'IT_Dev', type: 'Employee' },
  { id: 2, hourlyRate: '75.00', plc: 'CONS01', salary: '150000', homeOrg: 'Consulting', type: 'Vendor Employee' },
  { id: 3, hourlyRate: '45.00', plc: 'SUPP01', salary: '90000', homeOrg: 'Support', type: 'Generic Staff' },
  { id: 4, hourlyRate: '80.00', plc: 'UXD02', salary: '160000', homeOrg: 'Design', type: 'Employee' },
  { id: 5, hourlyRate: '55.00', plc: 'QA003', salary: '110000', homeOrg: 'Testing', type: 'Employee' },
  { id: 6, hourlyRate: '90.00', plc: 'MKT001', salary: '180000', homeOrg: 'Marketing', type: 'Vendor Employee' },
  { id: 7, hourlyRate: '62.00', plc: 'FIN005', salary: '124000', homeOrg: 'Finance', type: 'Employee' },
  { id: 8, hourlyRate: '70.00', plc: 'HR002', salary: '140000', homeOrg: 'HR_Dept', type: 'Generic Staff' },
];

// Static Data for Vendor Tab - ADDED MORE ENTRIES
const initialVendorData = [
  { id: 101, vendID: 'V001', vendName: 'Tech Solutions Inc.' },
  { id: 102, vendID: 'V002', vendName: 'Global Services Ltd.' },
  { id: 103, vendID: 'V003', vendName: 'Creative Minds Agency' },
  { id: 104, vendID: 'V004', vendName: 'Innovate Systems' },
  { id: 105, vendID: 'V005', vendName: 'Precision Tools Co.' },
];

// Static Data for PLC Tab - ADDED MORE ENTRIES
const initialPLCData = [
  { id: 201, category: 'Software Development', hrlyRate: '85.00' },
  { id: 202, category: 'Project Management', hrlyRate: '95.00' },
  { id: 203, category: 'Quality Assurance', hrlyRate: '70.00' },
  { id: 204, category: 'UI/UX Design', hrlyRate: '90.00' },
  { id: 205, category: 'Database Administration', hrlyRate: '88.00' },
  { id: 206, category: 'Network Engineering', hrlyRate: '92.00' },
];

const ProspectiveIDSetup = () => {
  const [activeTab, setActiveTab] = useState('employee'); // 'employee', 'vendor', 'plc'

  // --- Employee Tab States ---
  const [employeeHourlyRate, setEmployeeHourlyRate] = useState('');
  const [employeePLC, setEmployeePLC, ] = useState('');
  const [employeeSalary, setEmployeeSalary] = useState('');
  const [employeeHomeOrg, setEmployeeHomeOrg] = useState('');
  const [employeeType, setEmployeeType] = useState(''); // Employee, Vendor Employee, Generic Staff
  const [employeeData, setEmployeeData] = useState(initialEmployeeData); // Initialized with static data

  const employeeTypeOptions = [
    { label: 'Select Type', value: '' },
    { label: 'Employee', value: 'Employee' },
    { label: 'Vendor Employee', value: 'Vendor Employee' },
    { label: 'Generic Staff', value: 'Generic Staff' },
  ];

  const handleAddEmployee = useCallback(() => {
    if (!employeeHourlyRate || !employeePLC || !employeeSalary || !employeeHomeOrg || !employeeType) {
      alert('Please fill all fields for Employee data.');
      return;
    }
    const newEmployee = {
      id: Date.now(), // Simple unique ID
      hourlyRate: employeeHourlyRate,
      plc: employeePLC,
      salary: employeeSalary,
      homeOrg: employeeHomeOrg,
      type: employeeType,
    };
    setEmployeeData(prevData => [...prevData, newEmployee]);
    // Clear fields after adding
    setEmployeeHourlyRate('');
    setEmployeePLC('');
    setEmployeeSalary('');
    setEmployeeHomeOrg('');
    setEmployeeType('');
  }, [employeeHourlyRate, employeePLC, employeeSalary, employeeHomeOrg, employeeType]);

  // --- Vendor Tab States ---
  const [vendorID, setVendorID] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorData, setVendorData] = useState(initialVendorData); // Initialized with static data

  const handleAddVendor = useCallback(() => {
    if (!vendorID || !vendorName) {
      alert('Please fill all fields for Vendor data.');
      return;
    }
    const newVendor = {
      id: Date.now(), // Simple unique ID
      vendID: vendorID,
      vendName: vendorName,
    };
    setVendorData(prevData => [...prevData, newVendor]);
    // Clear fields after adding
    setVendorID('');
    setVendorName('');
  }, [vendorID, vendorName]);

  // --- PLC Tab States ---
  const [plcCategory, setPlcCategory] = useState('');
  const [plcHrlyRate, setPlcHrlyRate] = useState('');
  const [plcData, setPlcData] = useState(initialPLCData); // Initialized with static data

  const handleAddPLC = useCallback(() => {
    if (!plcCategory || !plcHrlyRate) {
      alert('Please fill all fields for PLC data.');
      return;
    }
    const newPLC = {
      id: Date.now(), // Simple unique ID
      category: plcCategory,
      hrlyRate: plcHrlyRate,
    };
    setPlcData(prevData => [...prevData, newPLC]);
    // Clear fields after adding
    setPlcCategory('');
    setPlcHrlyRate('');
  }, [plcCategory, plcHrlyRate]);

  // Generic numeric input handler
  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*(\.[0-9]*)?$/; // Allows empty, integers, or decimals
    if (value === '' || regex.test(value)) {
      setter(value);
    }
  };

  // --- Save All Data (Console Log for now) ---
  const handleSaveAll = useCallback(() => {
    console.log('Saving all Prospective ID Setup Data:');
    console.log('Employee Data:', employeeData);
    console.log('Vendor Data:', vendorData);
    console.log('PLC Data:', plcData);
    alert('All Prospective ID Setup data saved (console logged)!');
    // In a real application, you would send this data to your backend API endpoints.
  }, [employeeData, vendorData, plcData]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center p-4">
      {/* Adjusted max-w-7xl to w-full px-8 for wider display within its parent */}
      <div className="w-full px-8 bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-300">
        {/* Header with Save Button */}
        <div className="flex justify-between items-center gap-2 mb-6">
          <h2 className="w-full  bg-green-50 border-l-4 border-green-400 p-3 rounded-lg shadow-sm mb-4">Prospective ID Setup</h2>
          <button
            onClick={handleSaveAll}
            className="bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs py-1.5 px-3 -mt-4 shadow-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save All
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={cn(
              "py-2 px-4 text-lg font-medium focus:outline-none",
              activeTab === 'employee'
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            )}
            onClick={() => setActiveTab('employee')}
          >
            Employee
          </button>
          <button
            className={cn(
              "py-2 px-4 text-lg font-medium focus:outline-none",
              activeTab === 'vendor'
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            )}
            onClick={() => setActiveTab('vendor')}
          >
            Vendor
          </button>
          <button
            className={cn(
              "py-2 px-4 text-lg font-medium focus:outline-none",
              activeTab === 'plc'
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            )}
            onClick={() => setActiveTab('plc')}
          >
            PLC
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          {activeTab === 'employee' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Employee Data Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input
                    id="hourlyRate"
                    type="text"
                    value={employeeHourlyRate}
                    onChange={handleNumericInput(setEmployeeHourlyRate)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div>
                  <label htmlFor="plc" className="block text-sm font-medium text-gray-700">PLC</label>
                  <input
                    id="plc"
                    type="text"
                    value={employeePLC}
                    onChange={(e) => setEmployeePLC(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., PL001"
                  />
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary </label>
                  <input
                    id="salary"
                    type="text"
                    value={employeeSalary}
                    onChange={handleNumericInput(setEmployeeSalary)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100000"
                  />
                </div>
                <div>
                  <label htmlFor="homeOrg" className="block text-sm font-medium text-gray-700">Home Org</label>
                  <input
                    id="homeOrg"
                    type="text"
                    value={employeeHomeOrg}
                    onChange={(e) => setEmployeeHomeOrg(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., HRDept"
                  />
                </div>
                <div>
                  <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    id="employeeType"
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {employeeTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddEmployee}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Add Employee
                </button>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">All Employees</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hourly Rate ($)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">PLC</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Salary ($)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Home Org</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeeData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No employee data added yet.</td>
                      </tr>
                    ) : (
                      employeeData.map(employee => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.hourlyRate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.plc}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.salary}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.homeOrg}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.type}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vendor' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Vendor Data Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendID" className="block text-sm font-medium text-gray-700">Vend ID</label>
                  <input
                    id="vendID"
                    type="text"
                    value={vendorID}
                    onChange={(e) => setVendorID(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., V001"
                  />
                </div>
                <div>
                  <label htmlFor="vendName" className="block text-sm font-medium text-gray-700">Vend Name</label>
                  <input
                    id="vendName"
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Supplier XYZ"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddVendor}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Add Vendor
                </button>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">All Vendors</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vend ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vend Name</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendorData.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No vendor data added yet.</td>
                      </tr>
                    ) : (
                      vendorData.map(vendor => (
                        <tr key={vendor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.vendID}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{vendor.vendName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'plc' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">PLC Data Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plcCategory" className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    id="plcCategory"
                    type="text"
                    value={plcCategory}
                    onChange={(e) => setPlcCategory(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Dev"
                  />
                </div>
                <div>
                  <label htmlFor="plcHrlyRate" className="block text-sm font-medium text-gray-700">Hrly Rate</label>
                  <input
                    id="plcHrlyRate"
                    type="text"
                    value={plcHrlyRate}
                    onChange={handleNumericInput(setPlcHrlyRate)}
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 75.00"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddPLC}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Add PLC
                </button>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">All PLCs</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hrly Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plcData.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No PLC data added yet.</td>
                      </tr>
                    ) : (
                      plcData.map(plc => (
                        <tr key={plc.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plc.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{plc.hrlyRate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProspectiveIDSetup;
