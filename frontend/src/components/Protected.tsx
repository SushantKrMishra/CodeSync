import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { ScrollRestoration } from "./ScrollRestoration";
import { Sidebar } from "./Sidebar";

const ProtectedRoute: React.FC<{ isAuthenticated: boolean }> = ({
  isAuthenticated,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <ScrollRestoration />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: "72px", md: "280px" },
          p: 3,
          width: { md: "calc(100% - 280px)" },
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedRoute;
