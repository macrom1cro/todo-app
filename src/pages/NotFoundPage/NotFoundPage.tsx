import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

function NotFoundPage() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <Typography variant='h1' color='primary' gutterBottom>
          404
        </Typography>
        <Typography variant='h4' gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant='body1' color='text.secondary' gutterBottom>
          The page you are looking for doesn't exist.
        </Typography>
        <Button variant='contained' component={Link} to='/' sx={{ mt: 3 }}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}

export default NotFoundPage;
