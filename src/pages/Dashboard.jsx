// import React, { useEffect, useState } from "react";
// import NavigationSidebar from "../components/NavigationSidebar";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import ProjectBudgetStatus from "../components/ProjectBudgetStatus";
// import NewBusiness from "../components/NewBusiness";
// import PoolRate from "../components/PoolRate";
// import PoolConfigurationTable from "../components/PoolConfigurationTable";
// import TemplatePoolMapping from "../components/TemplatePoolMapping";
// import Template from "../components/Template";
// import CeilingConfiguration from "../components/CeilingConfiguration";
// import GlobalConfiguration from "../components/GlobalConfiguration";
// import ProspectiveIdSetup from "../components/ProspectiveIdSetup";
// import DisplaySettings from "../components/DisplaySettings";
// import AnnualHolidays from "../components/HolidayCalendar";
// import MaintainFiscalYearPeriods from "../components/MaintainFiscalYearPeriods";
// import ChatBot from "../components/ChatBot";
// import TopBar from "../components/TopBar";
// import.meta.env.VITE_APP_VERSION;

// const Dashboard = () => {
//   const [currentUserRole, setCurrentUserRole] = useState(null);
//   const [userName, setUserName] = useState("User");
//   const navigate = useNavigate();

//   function capitalizeWords(str) {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   }

//   useEffect(() => {
//     const userString = localStorage.getItem("currentUser");
//     if (userString) {
//       try {
//         const userObj = JSON.parse(userString);
//         setUserName(userObj.name ? capitalizeWords(userObj.name) : "User");
//         setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
//       } catch {
//         setCurrentUserRole(null);
//         setUserName("User");
//       }
//     }
//   }, []);
//   const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
//   const handleLogout = () => {
//     try {
//       localStorage.removeItem("currentUser");
//       localStorage.removeItem("authToken");
//       // If you store any other session/user data, remove it here as well
//     } catch (e) {
//       // Optional: handle or log any storage errors
//     }
//     navigate("/login", { replace: true });
//   };

//   return (
//     <>
//       <style>
//         {`
//           @layer utilities {
//             .animate-fade-in {
//               animation: fadeIn 0.6s ease-in-out;
//             }
//             .font-classic {
//               font-family: Georgia, 'Times New Roman', Times, serif;
//             }
//           }
//           @keyframes fadeIn {
//             0% {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             100% {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>
//       <div className="flex">
//         <div className="sticky top-0 h-screen">
//           <NavigationSidebar />
//         </div>

//         <div className="flex flex-col flex-1 min-h-screen bg-gray-100">
//           <TopBar name={userName} onLogout={handleLogout} />

//           <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen overflow-auto">
//             <Routes>
//               <Route
//                 path="/"
//                 element={
//                   <div className="flex items-center justify-center min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)]">
//                     <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-xl shadow-lg transform transition-all hover:scale-105">
//                       <div className="mb-6">
//                         <span className="inline-block text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-transparent bg-clip-text">
//                           R-AI
//                         </span>
//                       </div>
//                       <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 animate-fade-in font-classic tracking-wide">
//                         Welcome to R-AI Planning
//                       </h1>
//                       <p className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer font-classic font-normal">
//                         Select an option from the sidebar to get started.
//                       </p>
//                     </div>
//                   </div>
//                 }
//               />
//               <Route
//                 path="/project-budget-status"
//                 element={<ProjectBudgetStatus />}
//               />
//               <Route path="/new-business" element={<NewBusiness />} />
//               <Route path="/pool-rate" element={<PoolRate />} />
//               <Route
//                 path="/pool-configuration"
//                 element={<PoolConfigurationTable />}
//               />
//               <Route
//                 path="/template-pool-mapping"
//                 element={<TemplatePoolMapping />}
//               />
//               <Route path="/template" element={<Template />} />
//               <Route
//                 path="/ceiling-configuration"
//                 element={<CeilingConfiguration />}
//               />
//               <Route
//                 path="/global-configuration"
//                 element={<GlobalConfiguration />}
//               />
//               <Route
//                 path="/prospective-id-setup"
//                 element={<ProspectiveIdSetup />}
//               />
//               <Route path="/display-settings" element={<DisplaySettings />} />
//               <Route path="/annual-holidays" element={<AnnualHolidays />} />
//               <Route
//                 path="/maintain-fiscal-year-periods"
//                 element={<MaintainFiscalYearPeriods />}
//               />
//             </Routes>
//           </div>
//         </div>
//         {/* Chatbot at corner */}
//         {currentUserRole === "admin" && (
//           <div>
//             <ChatBot />
//           </div>
//         )}
//       </div>
//       {/* Version number fixed at bottom right */}
//       {/* <div className="fixed bottom-2 right-2 text-xs text-gray-500 font-mono select-none pointer-events-none">
//         v{appVersion}
//       </div> */}
//     </>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import NavigationSidebar from "../components/NavigationSidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import ChatBot from "../components/ChatBot";
import TopBar from "../components/TopBar";

const Dashboard = () => {
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setUserName(userObj.name ? capitalizeWords(userObj.name) : "User");
        setCurrentUserRole(userObj.role ? userObj.role.toLowerCase() : null);
      } catch {
        setCurrentUserRole(null);
        setUserName("User");
      }
    }
  }, []);

  const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
    } catch (e) {}
    navigate("/login", { replace: true });
  };

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
      <div className="flex min-h-screen bg-gray-100">
        <div className="sticky top-0 h-screen">
          <NavigationSidebar />
        </div>
        <div className="flex flex-col flex-1 min-h-screen bg-gray-100 ">
          <TopBar name={userName} onLogout={handleLogout} />
          <div className="flex-1 p-4 sm:p-6 flex bg-gray-100 overflow-auto">
            <div className="w-full max-w-7xl">
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
                <Route
                  path="/project-budget-status"
                  element={<ProjectBudgetStatus />}
                />
                <Route path="/new-business" element={<NewBusiness />} />
                <Route path="/pool-rate" element={<PoolRate />} />
                <Route
                  path="/pool-configuration"
                  element={<PoolConfigurationTable />}
                />
                <Route
                  path="/template-pool-mapping"
                  element={<TemplatePoolMapping />}
                />
                <Route path="/template" element={<Template />} />
                <Route
                  path="/ceiling-configuration"
                  element={<CeilingConfiguration />}
                />
                <Route
                  path="/global-configuration"
                  element={<GlobalConfiguration />}
                />
                <Route
                  path="/prospective-id-setup"
                  element={<ProspectiveIdSetup />}
                />
                <Route path="/display-settings" element={<DisplaySettings />} />
                <Route path="/annual-holidays" element={<AnnualHolidays />} />
                <Route
                  path="/maintain-fiscal-year-periods"
                  element={<MaintainFiscalYearPeriods />}
                />
              </Routes>
            </div>
          </div>
          {/* <div className="fixed bottom-2 right-2 text-xs text-gray-500 font-mono select-none pointer-events-none">
            v{appVersion}
          </div> */}
        </div>
        {/* {currentUserRole === "admin" && (
          <div>
            <ChatBot />
          </div>
        )} */}
      </div>
    </>
  );
};

export default Dashboard;
