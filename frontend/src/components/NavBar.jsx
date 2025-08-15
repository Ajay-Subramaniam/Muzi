import React,{useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { API } from '../apiConfig';
import {UserContext} from './UserInfoProvider';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Tooltip from '@mui/material/Tooltip';
import AdminPanelSettingsSharpIcon from '@mui/icons-material/AdminPanelSettingsSharp';
import {disconnectSocket} from '../utils/socket'

export default function NavBar({setOpen,setIsDeleteMode,isDeleteMode}) {
  
  const {userInfo} = useContext(UserContext)
  const navigate = useNavigate()
  const params = useParams()
  const path=useLocation()
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  function isHomePage(){
    return path.pathname=='/'
  }

  function isAdmin(){
    return userInfo.role=='admin'
  }

  function isAddSpace(){
    return isHomePage() && isAdmin()
  }
  
  function isSpacePage(){
    return path.pathname.startsWith('/space')
  }

  function isChangeRoleCondition(){
    return (isSpacePage() || isHomePage()) && isAdmin()
  }

  async function logout(){
    const res = await fetch(API.LOGOUT,{
      method:"GET",
      credentials:"include"
    })
    disconnectSocket()
    navigate('/login')
  }
  
  function changeRole(){
    navigate('/roleChange')
  }
  
  return (
    <><Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
            disabled={isHomePage()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Muzi
          </Typography>
          {isAddSpace() && <Button color="inherit" onClick={()=>setIsDeleteMode((prev)=>!prev)} variant={isDeleteMode?'outlined':'text'}>{isDeleteMode?' Quit Delete Mode':'Delete Space'}</Button>}
          {isAddSpace() && <Button color="inherit" onClick={handleClickOpen}>Add Space</Button>}
          {isChangeRoleCondition() && <Button color="inherit" onClick={changeRole} sx={{ mr: 1 }}>change role</Button>}
          <Button color="inherit" onClick={logout}>Logout</Button>
          <Tooltip title={userInfo.name} size='medium'>
            <IconButton color='inherit' sx={{ ml: 1 }}>
              {isAdmin() ? <AdminPanelSettingsSharpIcon /> :
                <AccountCircleSharpIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box><Toolbar /></>
  );
}
