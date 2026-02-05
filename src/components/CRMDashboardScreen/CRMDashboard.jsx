import React from "react";
import DashboardLayout from "../SidebarScreen/SidebarLayout";

const CRMDashboard = () => {
  return (
   <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">
        CRMDashboard Screen
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        This is CRMDashboard page content.
      </div>
    </DashboardLayout>
  );
};

export default CRMDashboard;
