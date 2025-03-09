import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";

const Body = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* TODO: Add proper Page */}
      <Route path="*" element={<>Not Found!</>} />
    </Routes>
  );
};

export default Body;
