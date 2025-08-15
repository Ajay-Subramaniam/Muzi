import React from 'react'
import { Box, Typography, Paper, Tab, Tabs } from '@mui/material'
import TabsLogin from '../components/TabsLogin';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const LandingPage = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
      
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 4, md: 8 }
        }}
      >
        <MusicNoteIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Muzi — Music Together
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, maxWidth: 500 }}>
          Share, queue, and enjoy music with friends in real-time. Create your own spaces and vibe together.
        </Typography>
        <img
          src='/music.jpg'
          style={{
            maxWidth: '90%',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        />
      </Box>

      <Box
        sx={{
          width:'100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: 300,
            p: 4,
            borderRadius: 3,
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
            backgroundColor: 'white'
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Get Started
          </Typography>
          <TabsLogin />
        </Paper>
      </Box>

    </Box>
  );
};

export default LandingPage;
