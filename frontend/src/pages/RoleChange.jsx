import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import {connectSocket} from '../utils/socket'
import { useSnackbar } from '../components/SnackbarProvider';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  Box,
  Toolbar,
} from '@mui/material';
import { useLoader } from '../components/LoaderContext' 

const RoleChange = () => {
  const socket = connectSocket()
  
  const { showMessage } = useSnackbar()
  const { openLoader, closeLoader } = useLoader()
  const roles = ['user', 'admin'];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    socket.emit('fetch-users')
    socket.on('users-list',updateUserRoles)
    socket.on('ack-update-role',ackMessage)
    return ()=>{
        socket.off('ack-update-role',ackMessage)
        socket.off('users-list',updateUserRoles)
    }
  },[])

  function ackMessage(isSuccess){
    if(isSuccess){
        showMessage('successfully changed role!!','success')
    }
    else{
        showMessage('unable to change role!!','error')
    }
  }

  function updateUserRoles(usersList){
    setUsers(usersList)
    setLoading(false)
  }

  const handleRoleChange = (email, newRole) => {
    socket.emit('update-user',{email, newRole})
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.email === email ? { ...user, role: newRole } : user
      )
    );
  };

  useEffect(()=>{
    if(loading){
      openLoader()
    }
    else{
      closeLoader()
    }
  },[loading])

  if(loading){
    return <div></div>
  }

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Role Change
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.email}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select
                        value={user.role}
                        onChange={e => handleRoleChange(user.email, e.target.value)}
                      >
                        {roles.map(role => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};

export default RoleChange;
