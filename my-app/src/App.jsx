import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login.jsx";
import Home from "./Home";
import Recommend from "./Recommend";
import Recommend2 from "./Recommend2";
import Payment from "./Payment";
import BeforeHome from "./beforehome.jsx";
import Home2 from "./Home2";
import Admin from "./Admin";
import AdminTable from "./AdminTable";
import SAW from "./SAW";
import SAWResult from "./SAWResult";
import ProtectedRoute from "./ProtectedRoute";
import SiteControls from "./SiteControls";
import LoadingOverlay from "./LoadingOverlay";

function App() {
  return (
    <BrowserRouter>
      <SiteControls />
      <LoadingOverlay />
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/beforehome"
          element={
            <ProtectedRoute>
              <BeforeHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home2"
          element={
            <ProtectedRoute>
              <Home2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommend"
          element={
            <ProtectedRoute>
              <Recommend />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommend2"
          element={
            <ProtectedRoute>
              <Recommend2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/table"
          element={
            <ProtectedRoute adminOnly>
              <AdminTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SAW"
          element={
            <ProtectedRoute>
              <SAW />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SAWResult"
          element={
            <ProtectedRoute>
              <SAWResult />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
