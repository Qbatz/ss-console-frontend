import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "../Context/RoleContext";
import { HostelProvider } from "../Context/HostelListContext";
import { SubscriptionProvider } from "../Context/SubscriptionContext";

import Home from "../components/dashboard/Home";
import Proprietors from "../components/ProprietorsScreen/Proprietors";
import Roles from "../components/RoleScreen/RoleList";
import UserInfo from "../components/AdminUser/UserInfo";
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
import { PlanProvider } from "../Context/PlanContexts";
import AddEditPlan from "../components/SubscriptionScreen/AddPlan";
import CreateOffer from "../components/SubscriptionScreen/CreateOffer";
import IamAdminUser from "../components/AdminUser/AdminUserList";
import TransactionsPage from "../components/TransactionList/TransactionDetails";
import TrailPage from "../components/SubscriptionScreen/TrialUsers";
import TableCustomization from "../components/TableCustomizationScreen/TableCustomization";
import TenantRecurring from "../components/RecurringMonitor/TenantRecurring";
import InvoiceRedemption from "../components/InvoiceRedemption/InvoiceRedemption";
import { SupportTicketsProvider } from "../Context/SupportTicketsContext";
import TenantDeductions from "../components/PropertiesScreen/TenantDeductions";
import TenantOverview from "../components/PropertiesScreen/TenantOverview";
import InvoiceReceipt from "../components/PropertiesScreen/InvoiceReceiptPage";
import PlanFeatures from "../components/SubscriptionScreen/PlanFeaturesScreen";
import KycApproval from "../components/KYCApproval/KYCApprovalScreen";
import { KYCProvider } from "../Context/KYCContext";

const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("mock_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ token expiredனா reject
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      localStorage.removeItem("access_token");
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return children;
};
// const PrivateRoute = ({ children }) => {
//   const token =
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("mock_token");
//   return token ? children : <Navigate to="/" replace />;
// };

const PrivateRoutesScreen = () => {
  const navigate = useNavigate();


  return (
    <PrivateRoute>
      <PlanProvider>
       
          <HostelProvider>
            <SubscriptionProvider>
              <OwnersProvider>
                <DashboardProvider>
                  <SupportTicketsProvider>
                    <KYCProvider>
                    <Routes>
                      <Route path="/home/:roleId" element={<Home />} />
                      <Route path="/proprietors/:roleId" element={<Proprietors />} />
                      {/* <Route path="/iam-admin-user/:roleId" element={<IamAdminUser />} /> */}
                      <Route path="/iam-admin-user/:adminRoleId/:filterRoleId?" element={<IamAdminUser />} />
                      <Route path="/roles/:roleId" element={<Roles />} />
                      <Route path="/properties/:roleId" element={<Properties />} />
                      <Route path="/subscription/:roleId" element={<Subscription />} />
                      <Route path="/plan-features/:roleId" element={<PlanFeatures />} />
                      <Route path="/billing/:roleId" element={<Billing />} />
                      <Route path="/supportTicket/:roleId" element={<SupportTicket />} />
                      <Route path="/crmDashboard/:roleId" element={<CRMDashboard />} />
                      <Route path="/manage-plans/:roleId" element={<ManagePlans />} />
                      {/* <Route path="/property-overview" element={<PropertyOverview/>} /> */}
                      <Route path="/property-overview/:hostelId" element={<PropertyOverview />} />
                      {/* <Route path="/ProprietorsOverview" element={<ProprietorsOverview/>} /> */}
                      <Route path="/ProprietorsOverview/:ownerId" element={<ProprietorsOverview />} />
                      <Route path="/tenantList/:roleId" element={<TenantsList />} />
                      <Route path="/Recurring-Bill/:roleId" element={<RecurringInvoice />} />
                      {/* <Route path="/subscriptions" element={<Subscription />} /> */}
                      <Route path="/demo-requests/:roleId" element={<DemoRequests />} />
                      <Route path="/add-plan" element={<AddEditPlan />} />
                      <Route path="/create-offer" element={<CreateOffer />} />

                      <Route path="/transactions/:roleId" element={<TransactionsPage />} />
                      <Route path="/trial-users/:roleId" element={<TrailPage />} />

                      <Route path="/tenant-Bill/:roleId" element={< TenantRecurring />} />
                      <Route path="/iam-user/:agentId" element={<UserInfo />} />
                      <Route path="/tableCustomize/:agentId" element={<TableCustomization />} />
                      <Route path="/invoice-redemption/:agentId" element={<InvoiceRedemption />} />
                      <Route path="/tenant-deductions/:customerId"element={<TenantDeductions />}/>
<Route path="/tenant-overview/:customerId" element={<TenantOverview />}/>
<Route
  path="/invoice-receipt/:hostelId/:invoiceId"
  element={<InvoiceReceipt />}
/>
<Route path="/Kyc-approve/:agentId" element={<KycApproval />} />



                    </Routes>
                    </KYCProvider>
                  </SupportTicketsProvider>
                </DashboardProvider>
              </OwnersProvider>
            </SubscriptionProvider>
          </HostelProvider>
      
      </PlanProvider>
    </PrivateRoute>
  );
};

export default PrivateRoutesScreen;
