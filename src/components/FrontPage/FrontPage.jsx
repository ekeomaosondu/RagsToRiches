import React, { useState } from 'react';
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
import { useGamesFetch } from '../../hooks/useGamesFetch';
import { validateForm, isFormValid } from '../../utils/validators';
import { PLATFORM_LICHESS, COLOR_BOTH } from '../../utils/constants';

export default function FrontPage() {
  const [formData, setFormData] = useState({
    platform: PLATFORM_LICHESS,
    username: '',
    color: COLOR_BOTH,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { loading, error, games, stats, fetchGames } = useGamesFetch();

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

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm(formData);

    if (!isFormValid(errors)) {
      setFormErrors(errors);
      return;
    }

    try {
      const fetchedGames = await fetchGames(formData);
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
