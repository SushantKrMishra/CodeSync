import { Box } from "@mui/material";
import "./App.css";
import Body from "./components/Body";
import ErrorIndicator from "./components/ErrorIndicator";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoadingIndicator from "./components/LoadingIndicator";
import { useSessionStatus } from "./domain/misc_hooks";

function App() {
  const { data, isError, isPending } = useSessionStatus();

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return (
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
        <Header isAuthenticated={data} />
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundColor: "#d8dada",
          overflowY: "auto",
          height: "calc(100vh - 70px)",
        }}
      >
        <Body isAuthenticated={data} />
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
