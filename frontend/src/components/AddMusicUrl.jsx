import React, { useState, useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useSnackbar } from './SnackbarProvider';
import { MusicListContext } from '../pages/Space';
import { useParams } from 'react-router-dom';
import {connectSocket} from '../utils/socket'

const AddMusicUrl = () => {
  const socket = connectSocket()
  const paramsSpace = useParams()
  let { musicList, setMusicList } = useContext(MusicListContext)
  const { showMessage } = useSnackbar()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [musicIdToFetch ,setMusicIdToFetch] = useState(null)

  function isPresent(musicId) {
    return musicList.some(music => music.musicId == musicId)
  }
  useEffect(() => {
    if(musicIdToFetch==null){
      return
    }
    setLoading(true)
    socket.emit('fetch-music', {
      spaceName: paramsSpace.space,
      musicId : musicIdToFetch
    })
  }, [musicIdToFetch])
  
  useEffect(() => {
    socket.on('error-fetch-music', errorMusic)
    socket.on('add-music', addMusic)
    return () => {
      socket.off('add-music', addMusic)
      socket.off('error-fetch-music', errorMusic)
    }
  }, [])
  

  function addMusic(musicInfo) {
    setMusicList((prevMusicList)=>[...prevMusicList, musicInfo])
    setMusicIdToFetch(null)
    setLoading(false)
  }

  function errorMusic(errorMessage) {
    showMessage(errorMessage)
  }


  const urlValidation = async () => {

    setLoading(true)
    const regex = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(&.*)?$/
    const isMatch = url.match(regex)
    if (isMatch) {
      const params = new URL(url).searchParams
      const musicId = params.get("v")
      if (isPresent(musicId)) {
        showMessage('Music already exists in queue')
      }
      else {
        setMusicIdToFetch(musicId)
      }
    }
    else {
      showMessage('invalid url')
    }
    setLoading(false)
    setUrl("")
  }

  return (
    <Card sx={{ minWidth: 275, width: 300, border: '1px solid black' }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 20, textAlign: 'center' }}>
          Add Music
        </Typography>
        <TextField fullWidth size="small" id="outlined-basic" value={url} onChange={(e) => setUrl(e.target.value)} label="paste youtube link" variant="outlined" />
      </CardContent>
      <CardActions>
        <Button fullWidth loading={loading} variant="contained" onClick={urlValidation} size="small">Add</Button>
      </CardActions>
    </Card>
  )
}

export default AddMusicUrl
