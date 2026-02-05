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
import { COLOR_WHITE, COLOR_BLACK, COLOR_BOTH } from '../../utils/constants';

export default function ColorSelector({ value, onChange, disabled }) {
  return (
    <FormControl component="fieldset" fullWidth disabled={disabled} sx={{ mt: 3 }}>
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Select Color
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ gap: 1 }}
      >
        <FormControlLabel
          value={COLOR_WHITE}
          control={<Radio color="primary" />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="span">♔</Typography>
              <Typography variant="body1">White Pieces</Typography>
            </Box>
          }
          sx={{
            border: '1px solid',
            borderColor: value === COLOR_WHITE ? 'primary.main' : 'divider',
            borderRadius: 2,
            padding: 1.5,
            margin: 0,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
        <FormControlLabel
          value={COLOR_BLACK}
          control={<Radio color="primary" />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="span">♚</Typography>
              <Typography variant="body1">Black Pieces</Typography>
            </Box>
          }
          sx={{
            border: '1px solid',
            borderColor: value === COLOR_BLACK ? 'primary.main' : 'divider',
            borderRadius: 2,
            padding: 1.5,
            margin: 0,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
        <FormControlLabel
          value={COLOR_BOTH}
          control={<Radio color="primary" />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="span">♔♚</Typography>
              <Typography variant="body1">Both Colors</Typography>
              <Typography variant="caption" color="text.secondary">
                (Recommended)
              </Typography>
            </Box>
          }
          sx={{
            border: '1px solid',
            borderColor: value === COLOR_BOTH ? 'primary.main' : 'divider',
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
