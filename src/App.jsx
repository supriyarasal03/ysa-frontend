import { BrowserRouter, Routes, Route } from "react-router-dom";

// Dashboards
import AdminDashboar from "./Pages/dashboard/AdminDashboar";
import CoachDashboard from "./Pages/dashboard/CoachDashboard";
import PlayerDashboard from "./Pages/dashboard/PlayerDashboard";
import ParentDashboard from "./Pages/dashboard/ParentDashboard";

// Public Pages
import HomePage from "./Pages/public/HomePage";
import CoachRegistration from "./Pages/public/CoachRegistration";
import AllSports from "./Pages/public/AllSports";

// Auth Pages
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import VerifyOtp from "./Pages/auth/VerifyOtp";
import ResetPassword from "./Pages/auth/ResetPassword";

// Staff
import StaffManagement from "./Pages/staff/StaffManagement";
import StaffForm from "./Pages/staff/StaffForm";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import ReceptionistLayout from "./components/layout/ReceptionistLayout";

// Sport
import SportManagmnet from "./sport/SportManagmnet";
import SportForm from "./sport/SportForm";

// Coach
import CoachManagement from "./Pages/coach/CoachManagement";
import CoachForm from "./Pages/coach/CoachForm";

// Batch
import BatchManagment from "./Pages/batch/BatchManagment";
import BatchForm from "./Pages/batch/BatchForm";

// Other Dashboards
import InnventoryManagerDashboard from "./Pages/dashboard/InnventoryManagerDashboard";
import CleaningStaffDashboard from "./Pages/dashboard/CleaningStaffDashboard";
import ReceptionistDashboard from "./Pages/dashboard/ReceptionistDashboard";

// Player
import PlayerManagement from "./Pages/player/PlayerManagement";
import PlayerForm from "./Pages/player/PlayerForm";

// Coach Sport Assignment
import CoachSportManagment from "./Pages/coachSportAssignment/CoachSportManagment";
import CoachSportAssignmentForm from "./Pages/coachSportAssignment/CoachSportAssignmentForm";

// Fees
import FeesManagment from "./Pages/fees/FeeManagment";
import FeesForm from "./Pages/fees/FeeForm";

// Payment
import PaymentManagement from "./Pages/payment/PaymentManagement";
import PaymentForm from "./Pages/payment/PaymentForm";

import FeeDetails from "./Pages/fees/FeeDetails";
import InstallmentPayment from "./Pages/fees/InstallmentPayment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/coach-registration" element={<CoachRegistration />} />
        <Route path="/sports" element={<AllSports />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* OTHER DASHBOARDS */}
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/player-dashboard" element={<PlayerDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />





        {/* ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboar />} />

          <Route
            path="/admin/staff-management"
            element={<StaffManagement />}
          />
          <Route path="/staff-form" element={<StaffForm />} />
          <Route path="/staff-form/:id" element={<StaffForm />} />

          <Route
            path="/admin/sport-management"
            element={<SportManagmnet />}
          />
          <Route path="/sport-form" element={<SportForm />} />
          <Route path="/sport-form/:id" element={<SportForm />} />

          <Route
            path="/admin/coach-managmnet"
            element={<CoachManagement />}
          />
          <Route path="/coach-form" element={<CoachForm />} />
          <Route path="/coach-form/:id" element={<CoachForm />} />

          <Route
            path="/admin/coach-sport-assignment"
            element={<CoachSportManagment />}
          />
          <Route
            path="/coach-sport-assignment-form"
            element={<CoachSportAssignmentForm />}
          />

          <Route
            path="/admin/batch-managmnet"
            element={<BatchManagment />}
          />
          <Route path="/batch-form" element={<BatchForm />} />
          <Route path="/batch-form/:id" element={<BatchForm />} />

          <Route
            path="/admin/fees-managment"
            element={<FeesManagment />}
          />
          <Route path="/fees-form" element={<FeesForm />} />
        </Route>


        






        {/* OTHER STAFF DASHBOARDS */}
        <Route
          path="/innventory-manager"
          element={<InnventoryManagerDashboard />}
        />
        <Route
          path="/cleaningStaff"
          element={<CleaningStaffDashboard />}
        />





        {/* RECEPTIONIST */}
        <Route element={<ReceptionistLayout />}>
          <Route
            path="/receptionist"
            element={<ReceptionistDashboard />}
          />
          <Route
            path="/receptionist/dashboard"
            element={<ReceptionistDashboard />}
          />

          {/* Player registration + management */}
          <Route
            path="/receptionist/players"
            element={<PlayerManagement />}
          />
          <Route
            path="/receptionist/player-form"
            element={<PlayerForm />}
          />
          <Route
            path="/receptionist/player-form/:id"
            element={<PlayerForm />}
          />

          {/* Payment management */}
          <Route
            path="/receptionist/payment-management"
            element={<PaymentManagement />}
          />
          <Route
            path="/receptionist/payment-form"
            element={<PaymentForm />}
          />


         <Route
  path="/receptionist/fees"
  element={<FeeDetails />}
/>



<Route
  path="/receptionist/installment-payment"
  element={<InstallmentPayment />}
/>


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
