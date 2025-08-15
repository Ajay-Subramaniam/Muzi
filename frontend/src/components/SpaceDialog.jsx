import React,{useRef, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import {connectSocket} from '../utils/socket'

export default function SpaceDialog({ open, setOpen, spaces}) {
  const socket = connectSocket()
  const [spaceExists, setspaceExists] = useState(false)
  const spaceRef = useRef()
  const handleClose = () => {
    setspaceExists(false)
    setOpen(false);
  };

  const handleAdd = () => {
    const newSpaceName = spaceRef.current.value
    const doExists = spaces.find((space)=>space.name.toLowerCase()==newSpaceName.toLowerCase())
    setspaceExists(doExists)
    if(!doExists){
      socket.emit('add-space',newSpaceName)
      handleClose()
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>Add Space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Space name should be unique
          </DialogContentText>
          <TextField
            inputRef={spaceRef}
            autoFocus
            required
            margin="dense"
            id="name"
            name="space"
            label="Space"
            type="text"
            fullWidth
            variant="standard"
          />
          {spaceExists && <Typography variant='subtitle2' sx={{color:'red'}}>* Already exists</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
