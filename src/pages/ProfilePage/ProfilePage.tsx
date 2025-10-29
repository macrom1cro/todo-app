// pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changePassword,
  fetchUserProfile,
  logout,
} from "../../store/slices/authSlice";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useAppSelector(state => state.auth);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfileLoading(true);
      dispatch(fetchUserProfile())
        .unwrap()
        .finally(() => setProfileLoading(false));
    }
  }, [dispatch, user]);

  const validatePasswordForm = () => {
    const errors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    const result = await dispatch(
      changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (changePassword.fulfilled.match(result)) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  function handleBackToTasks() {
    navigate("/");
  }

  if (profileLoading) {
    return (
      <Container>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='50vh'
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='50vh'
        >
          <Typography variant='h6' color='error'>
            Failed to load user profile
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='md'>
      <Box sx={{ marginTop: 4 }}>
        <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToTasks}
            sx={{ mb: 2 }}
          >
            Back to Tasks
          </Button>
          <Typography variant='h4' gutterBottom sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant='h6' gutterBottom>
                User Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body1'>
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body1'>
                  <strong>Age:</strong> {user.age || "Not specified"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body1'>
                  <strong>Member since:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Button
                variant='outlined'
                color='error'
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant='h6' gutterBottom>
                Change Password
              </Typography>

              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component='form' onSubmit={handlePasswordSubmit}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='oldPassword'
                  label='Current Password'
                  type='password'
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='newPassword'
                  label='New Password'
                  type='password'
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={!!validationErrors.newPassword}
                  helperText={validationErrors.newPassword}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='confirmPassword'
                  label='Confirm New Password'
                  type='password'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={!!validationErrors.confirmPassword}
                  helperText={validationErrors.confirmPassword}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3 }}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProfilePage;
