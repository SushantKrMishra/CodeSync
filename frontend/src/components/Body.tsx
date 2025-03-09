import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";

const Body = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
    </Routes>
  );
};

export default Body;
