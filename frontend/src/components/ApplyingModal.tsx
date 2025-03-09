import { Backdrop, CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";

type ApplyModalProps = {
  show: boolean;
  message: string;
};

export default function ApplyModal({ show, message }: ApplyModalProps) {
  return (
    <Backdrop
      open={show}
      sx={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        className="bg-white shadow-lg p-6 rounded-lg text-center"
        sx={{ minWidth: 300 }}
      >
        <CircularProgress sx={{ color: "#212121", mb: 2 }} />
        <Typography variant="h6" className="text-gray-800">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}
