import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";




import InputAdornment from "@mui/material/InputAdornment";

import { Alert } from "@mui/material";

import LockResetIcon from "@mui/icons-material/LockReset";
import EmailIcon from "@mui/icons-material/Email";

import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {

const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const response = await forgotPassword(formData);

    if (response.success) {
      setSuccessMessage(response.message);

      setTimeout(() => {

       navigate("/verify-otp", {
  state: {
    email: formData.email,
  },
});

      }, 1000);
    }
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Paper
          elevation={6}
          sx={{
            width: "100%",
            padding: 5,
            borderRadius: 4,
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockResetIcon color="primary" sx={{ fontSize: 50 }} />
          </Box>

          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            mb={4}
          >
            Enter your registered email address to receive an OTP.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
              }}
            />

<Button
  fullWidth
  variant="contained"
  type="submit"
  disabled={loading}
>
  {loading ? "Sending..." : "Send OTP"}
</Button>

{successMessage && (
  <Alert
    severity="success"
    sx={{
      mt: 2,
      justifyContent: "center",
    }}
  >
    {successMessage}
  </Alert>
)}

{errorMessage && (
  <Alert
    severity="error"
    sx={{
      mt: 2,
      justifyContent: "center",
    }}
  >
    {errorMessage}
  </Alert>
)}

          </Box>

        </Paper>

      </Box>

    </Container>
  );  
};

export default ForgotPassword;