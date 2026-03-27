import React,{useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "../Context/RoleContext";
import { HostelProvider } from "../Context/HostelListContext";
import { SubscriptionProvider } from "../Context/SubscriptionContext";
import Home from "../components/dashboard/Home";
import Proprietors from "../components/ProprietorsScreen/Proprietors";
import Roles from "../components/RoleScreen/RoleList";
import IamAdminUser from "../components/AdminUser/AdminUserList";
import Properties from "../components/PropertiesScreen/Properties";
import Subscription from "../components/SubscriptionScreen/subscription";
import Manageplans from "../components/SubscriptionScreen/ManagePlans ";
import Billing from "../components/BillingScreen/Billing";
import SupportTicket from "../components/SupportTicketScreen/SupportTicket";
import CRMDashboard from "../components/CRMDashboardScreen/CRMDashboard";
import ManagePlans from "../components/SubscriptionScreen/ManagePlans ";
import { OwnersProvider } from "../Context/OwnersContext";
import PropertyOverview from "../components/PropertiesScreen/PropertyOverview"
import { useNavigate } from "react-router-dom";
import ProprietorsOverview from "../components/ProprietorsScreen/ProprietorsOverview";
import TenantsList from "../components/TenantsList/TenantAllLists";
import RecurringInvoice from "../components/RecurringMonitor/RecurringInvoice";
import { DashboardProvider } from "../Context/DashboardContext";
import DemoRequests from "../components/DemoRequestsScreen/DemoRequests";



const PrivateRoute = ({ children }) => {
const token =
  localStorage.getItem("access_token") ||
  localStorage.getItem("mock_token");
  return token ? children : <Navigate to="/" replace />;
};

const PrivateRoutesScreen = () => {
   const navigate = useNavigate();

  
  return (
    <PrivateRoute>
      <RoleProvider>
        <HostelProvider>
          <SubscriptionProvider>
            <OwnersProvider>
              <DashboardProvider>
          <Routes>
            <Route path="/home/:roleId" element={<Home />} />
            <Route path="/proprietors/:roleId" element={<Proprietors />} />
            <Route path="/iam-admin-user/:roleId" element={<IamAdminUser />} />
            <Route path="/roles/:roleId" element={<Roles />} />
            <Route path="/properties/:roleId" element={<Properties />} />
            <Route path="/subscription/:roleId" element={<Subscription />} />
             {/* <Route path="/subscription/:roleId" element={<Manageplans />} /> */}
            <Route path="/billing/:roleId" element={<Billing />} />
            <Route path="/supportTicket/:roleId" element={<SupportTicket />} />
            <Route path="/crmDashboard/:roleId" element={<CRMDashboard />} />
            <Route path="/manage-plans/:roleId" element={<ManagePlans />} />
             {/* <Route path="/property-overview" element={<PropertyOverview/>} /> */}
             <Route path="/property-overview/:hostelId" element={<PropertyOverview/>} />
              {/* <Route path="/ProprietorsOverview" element={<ProprietorsOverview/>} /> */}
              <Route path="/ProprietorsOverview/:ownerId" element={<ProprietorsOverview/>} />
              <Route path="/tenantList/:roleId" element={<TenantsList/>} />
                 <Route path="/Recurring-Bill/:roleId" element={<RecurringInvoice />} />
                {/* <Route path="/subscriptions" element={<Subscription />} /> */}
                <Route   path="/demo-requests/:roleId" element={<DemoRequests />}/>


          </Routes>
          </DashboardProvider>
          </OwnersProvider>
          </SubscriptionProvider>
        </HostelProvider>
      </RoleProvider>
    </PrivateRoute>
  );
};

export default PrivateRoutesScreen;
