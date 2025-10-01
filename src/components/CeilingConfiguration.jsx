import React, { useState, useEffect } from "react";
import BurdenCostCeilingDetails from "./BurdenCostCeilingDetails";
import EmployeeHoursCeilings from "./EmployeeHoursCeilings";
import DirectCostCeilings from "./DirectCostCeilings";
import HoursCeilings from "./HoursCeilings";
import CostFeeOverrideDetails from "./CostFeeOverrideDetails";
import { backendUrl } from "./config";

const userName = "yourUserName"; // <-- Replace with actual user logic or prop

const CeilingConfiguration = () => {
  const [projectInput, setProjectInput] = useState("");
  const [activeTab, setActiveTab] = useState("Burden Cost Ceiling Details");
  const [isSearched, setIsSearched] = useState(false);

  const tabs = [
    "Burden Cost Ceiling Details",
    "Employee Hours Ceilings",
    "Direct Cost Ceilings",
    "Hours Ceilings",
    "Cost Fee Override Details",
  ];

  useEffect(() => {
    setIsSearched(!!projectInput);
  }, [projectInput]);

  const handleSearch = () => {
    if (projectInput) setIsSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTabClick = (tab) => {
    if (activeTab === tab) {
      setActiveTab("");
      setIsSearched(false);
      setProjectInput("");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2 bg-blue-50 py-2 px-4 rounded-lg">
        Ceiling Configuration
      </h1>

      <div className="mb-8">
        <label
          htmlFor="project"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Project
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="text"
            id="project"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Enter project name or ID"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex flex-wrap gap-2 sm:gap-3" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "Burden Cost Ceiling Details" && (
          <BurdenCostCeilingDetails
            projectId={projectInput}
            isSearched={isSearched}
            updatedBy={userName}
          />
        )}
        {activeTab === "Employee Hours Ceilings" && (
          <EmployeeHoursCeilings
            projectId={projectInput}
            isSearched={isSearched}
          />
        )}
        {activeTab === "Direct Cost Ceilings" && (
          <DirectCostCeilings
            projectId={projectInput}
            isSearched={isSearched}
            updatedBy={userName}
          />
        )}
        {activeTab === "Hours Ceilings" && (
          <HoursCeilings
            projectId={projectInput}
            isSearched={isSearched}
            updatedBy={userName}
          />
        )}
        {activeTab === "Cost Fee Override Details" && (
          <CostFeeOverrideDetails
            projectId={projectInput}
            isSearched={isSearched}
            updatedBy={userName}
          />
        )}
      </div>
    </div>
  );
};

export default CeilingConfiguration;