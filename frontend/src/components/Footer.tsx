import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 1,
        mt: "auto",
        backgroundColor: "#212121",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          © {new Date().getFullYear()} Code Sync. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
