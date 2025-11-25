import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Recommend from "./Recommend";
import Recommend2 from "./Recommend2";
import BeforeHome from "./beforehome";
import Home2 from "./Home2";
import Admin from "./Admin";
import AdminTable from "./AdminTable";
import SAW from "./SAW";
import SAWResult from "./SAWResult";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/beforehome" element={<BeforeHome />} />
        <Route path="/home" element={<Home />} />
       <Route path="/home2" element={<Home2 />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/recommend2" element={<Recommend2 />} />
          <Route path="/admin" element={<Admin />} />
        <Route path="/admin/table" element={<AdminTable />} />
        <Route path="/SAW" element={<SAW />} />
         <Route path="/SAWResult" element={<SAWResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
