import "./App.css";
import { Route, Routes } from "react-router-dom";
import Conexiones from "./pages/Conexiones.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Conexiones />} />
      <Route path="/inicio" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
