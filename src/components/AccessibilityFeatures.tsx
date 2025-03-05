import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import HearingIcon from '@mui/icons-material/Hearing';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

interface AccessibilityFeaturesProps {
  onToggleSignLanguage: () => void;
  onToggleCaptions: () => void;
  showSignLanguage: boolean;
  showCaptions: boolean;
  onTimeUpdate: (time: number) => void;
}

const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({
  onToggleSignLanguage,
  onToggleCaptions,
  showSignLanguage,
  showCaptions,
  onTimeUpdate,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <Tooltip title="Toggle Sign Language">
        <IconButton
          onClick={onToggleSignLanguage}
          color={showSignLanguage ? 'primary' : 'default'}
        >
          <HearingIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Captions">
        <IconButton
          onClick={onToggleCaptions}
          color={showCaptions ? 'primary' : 'default'}
        >
          <SubtitlesIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AccessibilityFeatures; 