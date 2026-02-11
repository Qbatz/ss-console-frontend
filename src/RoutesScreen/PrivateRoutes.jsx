import { Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "../Context/RoleContext";
import { HostelProvider } from "../Context/HostelListContext";

import Home from "../components/dashboard/Home";
import Proprietors from "../components/ProprietorsScreen/Proprietors";
import Roles from "../components/RoleScreen/RoleList";
import IamAdminUser from "../components/AdminUser/AdminUserList";
import Properties from "../components/PropertiesScreen/Properties";
import Subscription from "../components/SubscriptionScreen/subscription";
import Billing from "../components/BillingScreen/Billing";
import SupportTicket from "../components/SupportTicketScreen/SupportTicket";
import CRMDashboard from "../components/CRMDashboardScreen/CRMDashboard";
import ManagePlans from "../components/SubscriptionScreen/ManagePlans ";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/" replace />;
};

const PrivateRoutesScreen = () => {
  return (
    <PrivateRoute>
      <RoleProvider>
        <HostelProvider>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/proprietors" element={<Proprietors />} />
            <Route path="/iam-admin-user" element={<IamAdminUser />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/supportTicket" element={<SupportTicket />} />
            <Route path="/crmDashboard" element={<CRMDashboard />} />
            <Route path="/manage-plans" element={<ManagePlans />} />
          </Routes>
        </HostelProvider>
      </RoleProvider>
    </PrivateRoute>
  );
};

export default PrivateRoutesScreen;
