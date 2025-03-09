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
          paddingTop: "70px",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "70px",
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          <Header />
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#d8dada",
            overflowY: "auto",
            height: "calc(100vh - 70px)",
          }}
        >
          <Body />
        </Box>

        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
