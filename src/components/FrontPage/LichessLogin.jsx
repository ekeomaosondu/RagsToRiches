import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import {
  LICHESS_STATE_LOGGED_OUT,
  LICHESS_STATE_PENDING,
  LICHESS_STATE_LOGGED_IN,
  LICHESS_STATE_FAILED
} from '../../utils/constants';

export default function LichessLogin({
  loginState,
  username,
  onLogin,
  onLogout,
  onRetry
}) {
  // Pending state - checking authentication
  if (loginState === LICHESS_STATE_PENDING) {
    return (
      <Card sx={{ mb: 2, bgcolor: 'grey.50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Checking authentication status...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Logged in state
  if (loginState === LICHESS_STATE_LOGGED_IN && username) {
    return (
      <Card sx={{ mb: 2, bgcolor: 'success.light', borderColor: 'success.main', borderWidth: 1, borderStyle: 'solid' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" color="success.dark">
              Logged in as <strong>{username}</strong>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You can now access your private games and faster download speeds.
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            size="small"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Failed state
  if (loginState === LICHESS_STATE_FAILED) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to authenticate with Lichess
          </Alert>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={onLogin}
              size="small"
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={onRetry}
              size="small"
            >
              Retry Status
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Logged out state (default)
  return (
    <Card sx={{ mb: 2, bgcolor: 'info.light' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <InfoIcon color="info" sx={{ mr: 1, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Speed up game loading (optional)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lichess allows much faster download of games when you log in. This is especially useful for:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 1, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Viewing your own private games
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Loading games from users with large game libraries
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Faster API rate limits (up to 8x faster)
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoginIcon />}
          onClick={onLogin}
          fullWidth
        >
          Login to Lichess
        </Button>
      </CardContent>
    </Card>
  );
}
