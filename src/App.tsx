import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ReactPlayer from 'react-player';
import AccessibilityFeatures from './components/AccessibilityFeatures';
import KeyboardNavigation from './components/KeyboardNavigation';
import SignLanguageWindow from './components/SignLanguageWindow';
import CaptionsWindow from './components/CaptionsWindow';

// Create a theme with high contrast colors for better accessibility
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const sampleVideo = {
  url: 'https://youtu.be/ifo76VyrBYo?si=2QXY5qsKTY94YJWX',
  title: 'Accessible Video Tutorial',
  transcript: `
    [00:00] Welcome to this accessible video tutorial
    [00:05] This video demonstrates various accessibility features
    [00:10] You can use keyboard shortcuts to control the video playback
    [00:15] The space bar to play and pause
    [00:20] Arrow keys to skip forward or backward
    [00:25] You can also enable captions, sign language interpretation, and visual cues
    [00:30] These features make the video more accessible to everyone
    [00:35] Let's explore each feature in detail
    [00:40] First, let's look at the captions feature
    [00:45] Press 'C' to toggle captions on and off
    [00:50] Next, we'll demonstrate sign language interpretation
    [00:55] Press 'S' to enable sign language interpretation
  `,
};

const App: React.FC = () => {
  const [showSignLanguage, setShowSignLanguage] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {sampleVideo.title}
          </Typography>

          <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 4 }}>
            <ReactPlayer
              url={sampleVideo.url}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls
              onProgress={handleProgress}
            />
          </Box>

          <AccessibilityFeatures
            onToggleSignLanguage={() => setShowSignLanguage(!showSignLanguage)}
            onToggleCaptions={() => setShowCaptions(!showCaptions)}
            showSignLanguage={showSignLanguage}
            showCaptions={showCaptions}
            onTimeUpdate={setCurrentTime}
          />

          <SignLanguageWindow
            isOpen={showSignLanguage}
            onClose={() => setShowSignLanguage(!showSignLanguage)}
            videoUrl={sampleVideo.url}
          />

          {showCaptions && (
            <CaptionsWindow
              isOpen={showCaptions}
              onClose={() => setShowCaptions(false)}
              currentTime={currentTime}
              transcript={sampleVideo.transcript}
            />
          )}

          <KeyboardNavigation />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 