import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
  Snackbar,
} from '@mui/material';
import SourceSelector from './SourceSelector';
import UsernameInput from './UsernameInput';
import ColorSelector from './ColorSelector';
import SubmitButton from './SubmitButton';
import LichessLogin from './LichessLogin';
import { useGamesFetch } from '../../hooks/useGamesFetch';
import { validateForm, isFormValid } from '../../utils/validators';
import {
  PLATFORM_LICHESS,
  COLOR_BOTH,
  LICHESS_STATE_LOGGED_OUT,
  LICHESS_STATE_PENDING,
  LICHESS_STATE_LOGGED_IN,
  LICHESS_STATE_FAILED
} from '../../utils/constants';
import lichessOAuthManager from '../../services/oauth/LichessOAuthManager';

export default function FrontPage() {
  const [formData, setFormData] = useState({
    platform: PLATFORM_LICHESS,
    username: '',
    color: COLOR_BOTH,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // OAuth state
  const [lichessLoginState, setLichessLoginState] = useState(LICHESS_STATE_LOGGED_OUT);
  const [lichessUsername, setLichessUsername] = useState(null);

  const { loading, error, games, stats, fetchGames } = useGamesFetch();

  // Initialize OAuth on mount
  useEffect(() => {
    const initializeOAuth = async () => {
      setLichessLoginState(LICHESS_STATE_PENDING);
      try {
        const { isLoggedIn, username } = await lichessOAuthManager.initialize();
        if (isLoggedIn && username) {
          setLichessLoginState(LICHESS_STATE_LOGGED_IN);
          setLichessUsername(username);
          // Auto-fill username if it's empty and platform is Lichess
          setFormData((prevFormData) => {
            if (prevFormData.platform === PLATFORM_LICHESS && !prevFormData.username) {
              return { ...prevFormData, username };
            }
            return prevFormData;
          });
        } else {
          setLichessLoginState(LICHESS_STATE_LOGGED_OUT);
        }
      } catch (error) {
        console.error('OAuth initialization error:', error);
        setLichessLoginState(LICHESS_STATE_FAILED);
      }
    };

    initializeOAuth();
  }, []);

  const handlePlatformChange = (platform) => {
    setFormData({ ...formData, platform });
    setFormErrors({ ...formErrors, platform: null });
  };

  const handleUsernameChange = (username) => {
    setFormData({ ...formData, username });
    setFormErrors({ ...formErrors, username: null });
  };

  const handleColorChange = (color) => {
    setFormData({ ...formData, color });
    setFormErrors({ ...formErrors, color: null });
  };

  const handleLichessLogin = async () => {
    try {
      await lichessOAuthManager.login();
    } catch (error) {
      console.error('Login error:', error);
      setLichessLoginState(LICHESS_STATE_FAILED);
    }
  };

  const handleLichessLogout = () => {
    lichessOAuthManager.logout();
    setLichessLoginState(LICHESS_STATE_LOGGED_OUT);
    setLichessUsername(null);
  };

  const handleRetryLichessStatus = async () => {
    setLichessLoginState(LICHESS_STATE_PENDING);
    try {
      const { isLoggedIn, username } = await lichessOAuthManager.initialize();
      if (isLoggedIn && username) {
        setLichessLoginState(LICHESS_STATE_LOGGED_IN);
        setLichessUsername(username);
      } else {
        setLichessLoginState(LICHESS_STATE_LOGGED_OUT);
      }
    } catch (error) {
      console.error('Retry status error:', error);
      setLichessLoginState(LICHESS_STATE_FAILED);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm(formData);

    if (!isFormValid(errors)) {
      setFormErrors(errors);
      return;
    }

    try {
      // Get access token if logged in to Lichess
      const accessToken = formData.platform === PLATFORM_LICHESS && lichessLoginState === LICHESS_STATE_LOGGED_IN
        ? lichessOAuthManager.getAccessToken()
        : null;

      const fetchedGames = await fetchGames({ ...formData, accessToken });
      console.log('Successfully fetched games:', fetchedGames);
      console.log('Game statistics:', stats);
      setShowSuccess(true);
    } catch (err) {
      console.error('Error fetching games:', err);
      // Error is already set in the hook
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            RagsToRiches
          </Typography>
          <Typography variant="h6" color="text.secondary">
            AI Chess Coach - Load Your Games
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <SourceSelector
            value={formData.platform}
            onChange={handlePlatformChange}
            disabled={loading}
          />

          {formData.platform === PLATFORM_LICHESS && (
            <LichessLogin
              loginState={lichessLoginState}
              username={lichessUsername}
              onLogin={handleLichessLogin}
              onLogout={handleLichessLogout}
              onRetry={handleRetryLichessStatus}
            />
          )}

          <UsernameInput
            value={formData.username}
            onChange={handleUsernameChange}
            error={formErrors.username}
            disabled={loading}
            platform={formData.platform}
          />

          <ColorSelector
            value={formData.color}
            onChange={handleColorChange}
            disabled={loading}
          />

          <SubmitButton
            onClick={handleSubmit}
            loading={loading}
            disabled={!formData.platform || !formData.username || !formData.color}
          />
        </Box>

        {stats && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Games Loaded Successfully!
            </Typography>
            <Typography variant="body1">
              Total Games: {stats.total}
            </Typography>
            <Typography variant="body1">
              Wins: {stats.wins} | Losses: {stats.losses} | Draws: {stats.draws}
            </Typography>
            <Typography variant="body1">
              As White: {stats.asWhite} | As Black: {stats.asBlack}
            </Typography>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Successfully fetched {games?.length || 0} games!
        </Alert>
      </Snackbar>
    </Container>
  );
}
