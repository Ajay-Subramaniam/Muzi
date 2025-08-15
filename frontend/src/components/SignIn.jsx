import React,{useState} from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { API } from '../apiConfig';
import {useSnackbar} from './SnackbarProvider'
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

const SignIn = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const {showMessage} = useSnackbar()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const minLenPassword = 5;
  async function handleSubmit(){
    if(emailIsValid(email)){
      if(password.length<minLenPassword){
        showMessage('Invalid password length less than 5 characters')
      }
      else{
        setLoading((loading)=>!loading)
        await signInBackend()
        setLoading((loading)=>!loading)
      }
    }
    else{
      showMessage('enter valid mail')
    }
  }

  async function signInBackend(){
    try{
      const response = await fetch(API.SIGN_IN, {
        method: "POST",
        body: JSON.stringify({ email,password }),
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      })
      if(response.status == 200){
        navigate("/")
      }
      else{
        showMessage('no records found')
      }
    }
    catch(err){
      showMessage('unable to connect with our servers.')
    }
  }

  function emailIsValid (email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function user1Credentials(){
    setEmail('user1@email.com')
    setPassword('12345')
  }

  function user2Credentials(){
    setEmail('user2@email.com')
    setPassword('12345')
  }

  function adminCredentials(){
    setEmail('admin@email.com')
    setPassword('12345')
  }

  async function sendTokenToBackend(credentialResponse){
    try{
      const response = await fetch(API.GOOGLE_AUTH, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
        headers:{
          "Content-Type":"application/json"
        }
      })
      if(response.status ==200){
        navigate('/')
      }
    }
    catch(err){
      showMessage('unable to connect to our servers!')
    }

  }

  return (
    <Box sx={{
      border: 'black',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <TextField value={email} label="Email" onChange={(e)=>setEmail(e.target.value)}variant="outlined" type='email' />
      <TextField value={password} label="password" onChange={(e)=>setPassword(e.target.value)} variant="outlined" type='password'/>
      <Button loadingPosition="start" fullWidth loading={loading} variant='contained' type='submit' onClick={handleSubmit}>Sign in</Button>
      <GoogleOAuthProvider clientId={clientId} >
        <Box sx={{ display: 'flex', justifyContent: 'center' ,width:'100%'}}>
        <GoogleLogin
          onSuccess={sendTokenToBackend}
          onError={() => {
          }}
          logo_alignment='left'
        />
        </Box>
      </GoogleOAuthProvider>
      <Divider/>
      <Typography sx={{textAlign:'center'}}>
          Test Credentials
      </Typography>
      <Stack direction="row" justifyContent={'space-around'}>
        <Button variant='contained' onClick={adminCredentials}>admin</Button>
        <Button variant='contained' onClick={user1Credentials}>user 1</Button>
        <Button variant='contained' onClick={user2Credentials}>user 2</Button>
      </Stack>
    </Box>
  )
}

export default SignIn