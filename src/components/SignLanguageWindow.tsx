import React, { useState, useRef } from 'react';
import { Box, IconButton, Slider, Button, Typography } from '@mui/material';
import { VolumeUp, VolumeOff, Fullscreen, FullscreenExit, Close } from '@mui/icons-material';
import ReactPlayer from 'react-player';

interface SignLanguageWindowProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  transcript?: string[];
}

const signLanguageServices = [
  {
    name: "Sign Language Interpretation",
    videoUrl: "https://youtu.be/Q1IDH37I2KQ?si=xcqAQTwIj5rcuV9x"
  }
];

const SignLanguageWindow: React.FC<SignLanguageWindowProps> = ({
  isOpen,
  onClose,
  videoUrl = signLanguageServices[0].videoUrl,
}) => {
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 20 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isFullscreen) {
      setIsDragging(true);
      dragRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragRef.current) {
      setPosition({
        x: e.clientX - dragRef.current.x,
        y: e.clientY - dragRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onClose()}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        Open Sign Language
      </Button>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        left: isFullscreen ? 0 : position.x,
        top: isFullscreen ? 0 : position.y,
        width: isFullscreen ? '100%' : '320px',
        height: isFullscreen ? '100%' : '240px',
        backgroundColor: '#000',
        borderRadius: isFullscreen ? 0 : 2,
        overflow: 'hidden',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          zIndex: 1001,
        }}
      >
        <Close />
      </IconButton>

      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        playing
        volume={isMuted ? 0 : volume / 100}
        controls={true}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton onClick={toggleMute} size="small" sx={{ color: 'white' }}>
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
          sx={{
            width: 100,
            color: 'white',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
            },
          }}
        />
        <IconButton
          onClick={toggleFullscreen}
          size="small"
          sx={{ color: 'white', marginLeft: 'auto' }}
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default SignLanguageWindow; 