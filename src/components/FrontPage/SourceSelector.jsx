import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography
} from '@mui/material';
import { PLATFORM_CHESSCOM, PLATFORM_LICHESS } from '../../utils/constants';

export default function SourceSelector({ value, onChange, disabled }) {
  return (
    <FormControl component="fieldset" fullWidth disabled={disabled}>
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Select Chess Platform
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ gap: 1 }}
      >
        <FormControlLabel
          value={PLATFORM_LICHESS}
          control={<Radio color="primary" />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">Lichess.org</Typography>
              <Typography variant="caption" color="text.secondary">
                (Recommended)
              </Typography>
            </Box>
          }
          sx={{
            border: '1px solid',
            borderColor: value === PLATFORM_LICHESS ? 'primary.main' : 'divider',
            borderRadius: 2,
            padding: 1.5,
            margin: 0,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
        <FormControlLabel
          value={PLATFORM_CHESSCOM}
          control={<Radio color="primary" />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">Chess.com</Typography>
            </Box>
          }
          sx={{
            border: '1px solid',
            borderColor: value === PLATFORM_CHESSCOM ? 'primary.main' : 'divider',
            borderRadius: 2,
            padding: 1.5,
            margin: 0,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </RadioGroup>
    </FormControl>
  );
}
