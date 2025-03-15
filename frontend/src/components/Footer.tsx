import { GitHub, LinkedIn, Twitter } from "@mui/icons-material";
import { Box, Container, IconButton, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#212121",
        color: "white",
        zIndex: 1000,
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            textAlign: "center",
            position: "relative",
            left: "175px",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Code Sync. All rights reserved.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            placeItems: "end",
            placeContent: "end",
            placeSelf: "end",
          }}
        >
          <IconButton
            size="small"
            color="inherit"
            href="https://twitter.com"
            target="_blank"
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}
          >
            <Twitter fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            href="https://github.com"
            target="_blank"
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}
          >
            <GitHub fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            href="https://linkedin.com"
            target="_blank"
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" } }}
          >
            <LinkedIn fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
