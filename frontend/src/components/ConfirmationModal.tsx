import { Backdrop, Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";

type ConfirmationModalProps = {
  show: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmationModal({
  show,
  message,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
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
        <Typography className="text-gray-800">{message}</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="info">
            Confirm
          </Button>
        </Box>
      </Box>
    </Backdrop>
  );
}
