import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { transcriptService } from '../services/transcriptService';

interface CaptionStyle {
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  position: 'top' | 'middle' | 'bottom';
}

interface CaptionsWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: number;
  transcript: string;
}

const CaptionsWindow: React.FC<CaptionsWindowProps> = ({
  isOpen,
  onClose,
  currentTime,
  transcript,
}) => {
  const [style, setStyle] = useState<CaptionStyle>({
    fontSize: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#ffffff',
    position: 'bottom',
  });

  const [position, setPosition] = useState({ x: 0, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<string | null>(null);

  useEffect(() => {
    transcriptService.setTranscript(transcript);
    const removeListener = transcriptService.addListener((segment) => {
      setCurrentSegment(segment?.text || null);
    });

    return () => {
      removeListener();
    };
  }, [transcript]);

  useEffect(() => {
    transcriptService.updateTime(currentTime);
  }, [currentTime]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  const positionStyles = {
    top: { top: style.position === 'top' ? position.y : 'auto' },
    middle: { top: '50%', transform: 'translateY(-50%)' },
    bottom: { bottom: style.position === 'bottom' ? '100px' : 'auto' },
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        left: position.x,
        ...positionStyles[style.position],
        zIndex: 1000,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <IconButton
          onMouseDown={handleMouseDown}
          sx={{ cursor: 'move', color: 'white' }}
          size="small"
        >
          <DragIndicatorIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Position</InputLabel>
            <Select
              value={style.position}
              onChange={(e) =>
                setStyle({ ...style, position: e.target.value as 'top' | 'middle' | 'bottom' })
              }
              label="Position"
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="top">Top</MenuItem>
              <MenuItem value="middle">Middle</MenuItem>
              <MenuItem value="bottom">Bottom</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ width: 120 }}>
            <Typography variant="caption" gutterBottom sx={{ color: 'white' }}>
              Font Size
            </Typography>
            <Slider
              value={style.fontSize}
              onChange={(_, value) => setStyle({ ...style, fontSize: value as number })}
              min={16}
              max={36}
              step={2}
              aria-label="Font Size"
              sx={{ color: 'white' }}
            />
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      {currentSegment && (
        <Typography
          variant="body1"
          sx={{
            fontSize: style.fontSize,
            backgroundColor: style.backgroundColor,
            color: style.textColor,
            padding: 2,
            borderRadius: 1,
            textAlign: 'center',
            maxWidth: '100%',
            margin: '0 auto',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          {currentSegment}
        </Typography>
      )}
    </Paper>
  );
};

export default CaptionsWindow; 