import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';

export default function SubmitButton({ onClick, loading, disabled }) {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onClick}
        disabled={disabled || loading}
        sx={{
          minWidth: 200,
          height: 48,
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Fetch Games'
        )}
      </Button>
    </Box>
  );
}
