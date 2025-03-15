import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const UserNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
        margin: "1rem 10rem",
        width: "50rem",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: "8rem",
            color: "#ff4444",
            mb: 2,
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#212121",
            textAlign: "center",
            mb: 2,
          }}
        >
          User Not Found
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            textAlign: "center",
            maxWidth: "500px",
            mb: 4,
          }}
        >
          Oops! It seems the user you're looking for doesn't exist or may have
          been removed.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#4f46e5",
            backgroundImage: "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "12px",
            px: 6,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
              transition: "all 0.3s ease",
            },
          }}
        >
          Go Back Home
        </Button>
      </motion.div>
    </Box>
  );
};
