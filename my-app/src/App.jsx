import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Recommend from "./Recommend";
import BeforeHome from "./beforehome";
import Home2 from "./Home2";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/beforehome" element={<BeforeHome />} />
        <Route path="/home" element={<Home />} />
       <Route path="/home2" element={<Home2 />} />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
