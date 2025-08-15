import React, { useState } from 'react'
import { TextField, Button, Typography, Paper, Box } from '@mui/material'
import { useSnackbar } from './SnackbarProvider'
import { API } from '../apiConfig';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { showMessage } = useSnackbar()
    const navigate = useNavigate()
    const minLenPassword = 5

    function isValidName() {
        if (name == '') {
            showMessage('Name can\'t be empty','warning')
            return false
        }
        return true
    }

    function isValidEmail() {
        if (email == '') {
            showMessage('Email can\'t be empty','warning')
            return false
        }
        const regex = /\S+@\S+\.\S+/
        if (!(regex.test(email))) {
            showMessage('invalid email','warning')
            return false
        }
        return true
    }

    function isValidPassword() {
        if (password == '') {
            showMessage('Password can\'t be empty','warning')
            return false
        }
        if (password.length < minLenPassword) {
            showMessage('Invalid password, length less than 5 characters','warning')
            return false
        }
        return true
    }

    async function validateCredentials() {
        if (isValidName() && isValidEmail() && isValidPassword()) {
            try{
                const response = await fetch(API.SIGN_UP, {
                    method: "POST",
                    body: JSON.stringify({ name, email, password }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if(response.status==200){
                    showMessage('User Successfully created! Login Again !','success')
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                }
                else{
                    const errorMessage = await response.json()
                    showMessage(errorMessage.message)
                }
            }
            catch(err){
                showMessage('unable to connect with our servers.')
            }
        }
    }

    return (
        <Box sx={{
            border: 'black',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" variant="outlined" type='text' />
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="outlined" type='email' />
            <TextField value={password} onChange={(e) => setPassword(e.target.value)} label="password" variant="outlined" type='password' />
            <Button variant='contained' onClick={validateCredentials}>Sign up</Button>
        </Box>
    )
}

export default SignUp