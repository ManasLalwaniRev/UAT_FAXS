import React from "react";
import NavigationSidebar from "../components/NavigationSidebar";
import { Routes, Route } from "react-router-dom";
import ProjectBudgetStatus from "../components/ProjectBudgetStatus";
import NewBusiness from "../components/NewBusiness";
import PoolRate from "../components/PoolRate";
import PoolConfigurationTable from "../components/PoolConfigurationTable";
import TemplatePoolMapping from "../components/TemplatePoolMapping";
import Template from "../components/Template";
import CeilingConfiguration from "../components/CeilingConfiguration";
import GlobalConfiguration from "../components/GlobalConfiguration";
import ProspectiveIdSetup from "../components/ProspectiveIdSetup";
import DisplaySettings from "../components/DisplaySettings";
import AnnualHolidays from "../components/HolidayCalendar";
import MaintainFiscalYearPeriods from "../components/MaintainFiscalYearPeriods";

const Dashboard = () => {
  return (
    <>
      <style>
        {`
          @layer utilities {
            .animate-fade-in {
              animation: fadeIn 0.6s ease-in-out;
            }
            .font-classic {
              font-family: Georgia, 'Times New Roman', Times, serif;
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="flex">
        <NavigationSidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)]">
                  <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-xl shadow-lg transform transition-all hover:scale-105">
                    <div className="mb-6">
                      <span className="inline-block text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
                        R-AI
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 animate-fade-in font-classic tracking-wide">
                      Welcome to R-AI Planning
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer font-classic font-normal">
                      Select an option from the sidebar to get started.
                    </p>
                  </div>
                </div>
              }
            />
            <Route path="/project-budget-status" element={<ProjectBudgetStatus />} />
            <Route path="/new-business" element={<NewBusiness />} />
            <Route path="/pool-rate" element={<PoolRate />} />
            <Route path="/pool-configuration" element={<PoolConfigurationTable />} />
            <Route path="/template-pool-mapping" element={<TemplatePoolMapping />} />
            <Route path="/template" element={<Template />} />
            <Route path="/ceiling-configuration" element={<CeilingConfiguration />} />
            <Route path="/global-configuration" element={<GlobalConfiguration />} />
            <Route path="/prospective-id-setup" element={<ProspectiveIdSetup />} />
            <Route path="/display-settings" element={<DisplaySettings />} />
            <Route path="/annual-holidays" element={<AnnualHolidays />} />
            <Route path="/maintain-fiscal-year-periods" element={<MaintainFiscalYearPeriods />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;