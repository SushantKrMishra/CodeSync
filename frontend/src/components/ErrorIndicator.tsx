import { Backdrop, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ErrorIndicator() {
  const navigate = useNavigate();

  return (
    <Backdrop
      open
      sx={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Box
        sx={{ backgroundColor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" color="error" mb={2}>
          Oops! Something Went Wrong
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          We encountered an unexpected issue. Please try again later.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    </Backdrop>
  );
}
