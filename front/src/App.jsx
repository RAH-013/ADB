import "./App.css";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
