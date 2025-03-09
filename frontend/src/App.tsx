import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box sx={{ flex: 1, backgroundColor: "#d8dada" }}>
          <Body />
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
