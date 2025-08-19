import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material'

const GoogleSignInButton = ({ onSuccess, onError }) => {
    const googleLogin = useGoogleLogin({
      onSuccess: onSuccess,
      onError: onError,
    });
  
    return (
      <Button
        fullWidth
        variant='contained'
        onClick={googleLogin}
        sx={{
          textTransform : 'none',
          gap:1
        }}
      >
        <GoogleIcon/>
        Sign in with Google
      </Button>
    );
  };
  

export default GoogleSignInButton