import React, { useContext, useState, useEffect, useRef } from 'react'
import MusicCard from './MusicCard'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { MusicListContext, MusicStatusContext } from '../pages/Space'
import { useParams } from 'react-router-dom';
import {connectSocket} from '../utils/socket'
import Button from '@mui/material/Button';
import {UserContext} from './UserInfoProvider';

const MusicQueue = () => {
  const socket = connectSocket()
  
  const {userInfo} = useContext(UserContext)
  const { setMusicPaused, isMusicStarted, setIsMusicStarted } = useContext(MusicStatusContext)
  let { musicList, setMusicList } = useContext(MusicListContext)
  const params = useParams()
  const spaceName = params.space
  const isMusicStartedRef = useRef(isMusicStarted)

  useEffect(()=>{
    isMusicStartedRef.current = isMusicStarted
  },[isMusicStarted])

  useEffect(() => {
    socket.on('delete-music', deleteMusic)
    socket.on('set-to-play', setToPlay)
    socket.on('set-to-pause', setToPause)
    socket.on('update-score', reorderList)
    socket.on('music-started', musicStarted)
    socket.on('reset-space', resetMusicList)
    return () => {
      socket.off('reset-space', resetMusicList)
      socket.off('music-started', musicStarted)
      socket.off('update-score', reorderList)
      socket.off('set-to-play', setToPlay)
      socket.off('set-to-pause', setToPause)
      socket.off('delete-music', deleteMusic)
    }
  }, [])

  function resetMusicList(){
    setMusicList([])
  }

  function musicStarted(){
    setIsMusicStarted(true)
  }

  function setToPlay() {
    setMusicPaused(false)
  }

  function setToPause() {
    setMusicPaused(true)
  }

  function deleteMusic(musicId) {
    setMusicList((musicList) => musicList.filter((music) => musicId != music.musicId))
  }

  function reorderList(musicId,score){
    setMusicList((musicList)=>{

      let updateList = musicList.map((currMusic)=>{
        if(currMusic.musicId==musicId){
          return {
            ...currMusic,
            score,
            lastModifiedAt:Date.now()
          }
        }
        return currMusic
      })
      let sortedList=[]
      if(isMusicStartedRef.current){
        const firstIItem = updateList[0]
        const restItem = updateList.slice(1)
        restItem.sort(sortComparator)
        sortedList = [firstIItem, ...restItem]
      }
      else{
        sortedList  = updateList.sort(sortComparator)
      }
      return sortedList
    })
  }

  function sortComparator(a,b){
    //sorts based on score in descending order, incase of tie sorts them in lastModified at in ascending order
    if(a.score==b.score){
      return new Date(a.lastModifiedAt)-new Date(b.lastModifiedAt)
    }
    return b.score-a.score
  }

  function resetSpace(){
    socket.emit('reset-space',spaceName)
    socket.emit('set-to-pause',spaceName)
  }

  function canDisplayReset(){
    return musicList.length != 0 && userInfo.role=='admin'
  }

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        width: '65%',
      }}
    >
      <Stack spacing={2} direction="row" sx={{ alignItems: 'center', justifyContent: 'center', m:2, position:'relative' }}>
    <Typography variant="h6" textAlign='center'>Upcoming Music</Typography>
    { canDisplayReset() &&
        <Button onClick={resetSpace} variant='contained' size='small' sx={{position:'absolute' , right:0}}>Reset</Button>}
    
  </Stack>
 
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
          border: '1px solid #e0e0e0',
          maxHeight: '65vh',
          overflowY: 'auto',
        }}
      >
        <Stack spacing={1}>
          {
            musicList.length == 0 ?
              <Typography align='center'>
                No music in the queue — add your favorite song!
              </Typography>
              : musicList.map((musicItem, index) => (
                <MusicCard key={musicItem.musicId} musicItem={musicItem} index={index} reorderList={reorderList}/>
              ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default MusicQueue
