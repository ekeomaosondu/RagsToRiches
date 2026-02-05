import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import FrontPage from './components/FrontPage/FrontPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FrontPage />
    </ThemeProvider>
  );
}

export default App;
