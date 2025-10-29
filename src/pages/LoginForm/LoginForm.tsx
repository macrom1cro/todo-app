import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";


function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error, token, user } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token && user) {
      navigate("/", { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setValidationErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }
    dispatch(loginUser(formData));
  };

  const hasErrors =
    Object.values(validationErrors).some(error => error) ||
    !formData.email ||
    !formData.password;

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            Sign In
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={status === "loading"}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={status === "loading"}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={status === "loading" || hasErrors}
            >
              {status === "loading" ? (
                <CircularProgress size={24} />
              ) : (
                "Sign In"
              )}
            </Button>
            <Box textAlign='center'>
              <Link to='/register' style={{ textDecoration: "none" }}>
                <Typography variant='body2' color='primary'>
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginForm;
