import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import CustomerHome from './pages/customer/CustomerHome';
import ViewCars from './pages/customer/ViewCars';
import GivePurchaseOrder from './pages/customer/GivePurchaseOrder';
import ScheduleTestDrive from './pages/customer/ScheduleTestDrive';
import MakePayment from './pages/customer/MakePayment';

import StaffHome from './pages/staff/StaffHome';
import CarInventory from './pages/staff/CarInventory';
import UpdateCar from './pages/staff/UpdateCar';
import ScheduleServiceDashboard from './pages/staff/ScheduleServiceDashboard';
import ScheduleService from './pages/staff/ScheduleService';

import ManagerHome from './pages/manager/ManagerHome';
import CreateInvoice from './pages/manager/CreateInvoice';
import GenerateReport from './pages/manager/GenerateReport';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/cars" element={<ViewCars />} />
          <Route path="/customer/purchase/:vin" element={<GivePurchaseOrder />} />
          <Route path="/customer/test-drive/:vin" element={<ScheduleTestDrive />} />
          <Route path="/customer/payment/:vin" element={<MakePayment />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
          <Route path="/staff/home" element={<StaffHome />} />
          <Route path="/staff/inventory" element={<CarInventory />} />
          <Route path="/staff/inventory/update/:vin" element={<UpdateCar />} />
          <Route path="/staff/services" element={<ScheduleServiceDashboard />} />
          <Route path="/staff/services/new/:vin" element={<ScheduleService />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
          <Route path="/manager/home" element={<ManagerHome />} />
          <Route path="/manager/invoice" element={<CreateInvoice />} />
          <Route path="/manager/report" element={<GenerateReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
