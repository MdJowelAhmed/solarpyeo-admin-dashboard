import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse below 992px on mount + resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex bg-baseBg overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 250 }}
      >
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-10 transition-all duration-300" 
             style={{ left: collapsed ? 80 : 250 }}>
          <Header toggleSidebar={() => setCollapsed(!collapsed)} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-16 mt-3">
          <div className=" rounded-md p-7 pt-0">
            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
