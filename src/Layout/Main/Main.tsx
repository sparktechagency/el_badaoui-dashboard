import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="grid grid-cols-12 gap-4 pe-3 bg-[#f1f1f9]">
      {/* side bar */}
      <div className="col-span-2 border-e h-screen bg-white w-full overflow-y-auto">
        <Sidebar />
      </div>

      {/* main container with header */}
      <div className="col-span-10 space-y-4">
        <div className="h-[68px] border-black bg-white rounded-b-3xl flex items-center justify-end pr-5">
          <Header />
        </div>

        <div className="h-[calc(100vh-85px)] rounded-t-3xl overflow-y-auto">
          <div className="h-full overflow-y-auto rounded-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;