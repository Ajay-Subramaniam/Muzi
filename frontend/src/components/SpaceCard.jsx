import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import {connectSocket} from '../utils/socket'

function SpaceCard({ spaces,isDeleteMode,setSpaces }) {
  const socket = connectSocket()
  
  const navigate = useNavigate()

  function handleDeleteSpace(spaceName){
    socket.emit('delete-space',spaceName)
  }

  function deleteSpace(toBeDeletedSpace){
    setSpaces(prevList =>{
      return prevList.filter(space=>space.name!=toBeDeletedSpace)
    })
  }

  useEffect(()=>{
    socket.on('delete-space',deleteSpace)
    return ()=>{
      socket.off('delete-space',deleteSpace)
    }
  },[])

  if (spaces.length == 0) {
    return (<Typography align='center' variant="h5" component="div" sx={{ m: 2 }}>
      Add Spaces to Enjoy Music!
    </Typography>)
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
        p: 2,
      }}
    >
      {spaces.map((space, index) => (
        <Card key={space.name}>
          <CardContent>
            <Typography align="center" variant="h5" component="div">
              {space.name}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            {isDeleteMode?
            <Button size="small" variant='outlined' onClick={()=>handleDeleteSpace(space.name)}>Delete</Button>
            :<Button size="small" variant='outlined' onClick={() => navigate(`/space/${space.name}`)}>Enter</Button>}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

export default SpaceCard;
