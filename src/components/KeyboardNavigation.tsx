import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';

const shortcuts = [
  { key: 'Space', description: 'Play/Pause video' },
  { key: '←', description: 'Rewind 5 seconds' },
  { key: '→', description: 'Forward 5 seconds' },
  { key: 'T', description: 'Toggle transcript' },
  { key: 'C', description: 'Toggle captions' },
  { key: 'S', description: 'Toggle sign language' },
  { key: 'V', description: 'Toggle visual cues' },
];

const KeyboardNavigation: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <KeyboardIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Keyboard Shortcuts
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {shortcuts.map((shortcut) => (
          <Grid item xs={12} sm={6} md={4} key={shortcut.key}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Paper
                variant="outlined"
                sx={{
                  px: 1,
                  py: 0.5,
                  mr: 1,
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 'bold',
                }}
              >
                {shortcut.key}
              </Paper>
              <Typography variant="body2">
                {shortcut.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default KeyboardNavigation; 