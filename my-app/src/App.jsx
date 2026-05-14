import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Home from "./Home";
import Recommend from "./Recommend";
import Recommend2 from "./Recommend2";
import BeforeHome from "./BeforeHome";
import Home2 from "./Home2";
import Admin from "./Admin";
import AdminTable from "./AdminTable";
import SAW from "./SAW";
import SAWResult from "./SAWResult";
<<<<<<< HEAD
import ProtectedRoute from "./ProtectedRoute"; // ✅ แก้ตรงนี้
=======
import ProtectedRoute from "./ProtectedRoute";
>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
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
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/table"
          element={
            <ProtectedRoute>
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
=======

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Pages */}
        <Route path="/beforehome" element={
          <ProtectedRoute>
            <BeforeHome />
          </ProtectedRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/home2" element={
          <ProtectedRoute>
            <Home2 />
          </ProtectedRoute>
        } />

        <Route path="/recommend" element={
          <ProtectedRoute>
            <Recommend />
          </ProtectedRoute>
        } />

        <Route path="/recommend2" element={
          <ProtectedRoute>
            <Recommend2 />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />

        <Route path="/admin/table" element={
          <ProtectedRoute>
            <AdminTable />
          </ProtectedRoute>
        } />

        <Route path="/SAW" element={
          <ProtectedRoute>
            <SAW />
          </ProtectedRoute>
        } />

        <Route path="/SAWResult" element={
          <ProtectedRoute>
            <SAWResult />
          </ProtectedRoute>
        } />

>>>>>>> 300bafd8fffe67ea814c655abbfd8acf26ab51e3
      </Routes>
    </BrowserRouter>
  );
}

export default App;