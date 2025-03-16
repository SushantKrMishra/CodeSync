import { Navigate, Route, Routes } from "react-router-dom";
import { AddPostPage } from "../pages/AddPost/AddPost";
import EditPost from "../pages/EditPost/EditPost";
import { Home } from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import { EditProfilePage } from "../pages/Profile/EditProfile";
import MyProfile from "../pages/Profile/Profile";
import SignUp from "../pages/SignUp/SignUp";
import UserDetails from "../pages/UserDetails/UserDetails";
import ProtectedRoute from "./Protected";

const Body: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
      />

      <Route
        path="/"
        element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
      >
        <Route index element={<Home />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/create-post" element={<AddPostPage />} />
        <Route path="/user-profile/:id" element={<UserDetails />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="*" element={<>Hello World! 😠</>} />
      </Route>
    </Routes>
  );
};

export default Body;
