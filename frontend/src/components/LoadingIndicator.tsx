import { Backdrop, CircularProgress } from "@mui/material";

export default function LoadingIndicator() {
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
      }}
    >
      <CircularProgress sx={{ color: "#212121", mb: 2, scale: 1.6 }} />
    </Backdrop>
  );
}
