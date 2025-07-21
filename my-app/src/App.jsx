import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Home from "./Home";
import Recommend from "./Recommend";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
