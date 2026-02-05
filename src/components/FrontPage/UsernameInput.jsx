import React from 'react';
import { TextField } from '@mui/material';
import { PLATFORM_CHESSCOM, PLATFORM_LICHESS } from '../../utils/constants';

export default function UsernameInput({ value, onChange, error, disabled, platform }) {
  const getLabel = () => {
    if (platform === PLATFORM_CHESSCOM) {
      return 'Chess.com Username';
    } else if (platform === PLATFORM_LICHESS) {
      return 'Lichess Username';
    }
    return 'Username';
  };

  const getHelperText = () => {
    if (error) {
      return error;
    }
    if (platform === PLATFORM_CHESSCOM) {
      return '3-25 characters, letters, numbers, dashes, underscores';
    } else if (platform === PLATFORM_LICHESS) {
      return '2-30 characters, letters, numbers, dashes, underscores';
    }
    return 'Enter your username';
  };

  return (
    <TextField
      fullWidth
      label={getLabel()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={getHelperText()}
      disabled={disabled}
      variant="outlined"
      placeholder={platform === PLATFORM_CHESSCOM ? 'e.g., Hikaru' : 'e.g., DrNykterstein'}
      sx={{ mt: 2 }}
    />
  );
}
