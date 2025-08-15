import React, { useContext } from 'react'
import YouTube from 'react-youtube';
import { MusicListContext, MusicStatusContext } from '../pages/Space';
import { useParams } from 'react-router-dom'
import {connectSocket} from '../utils/socket'

const Player = () => {
  const socket = connectSocket()
  
  const params = useParams()
  const spaceName = params.space
  const { musicList , setMusicList } = useContext(MusicListContext)
  const { setMusicPaused, isMusicStarted, setIsMusicStarted } = useContext(MusicStatusContext)
  const onPlayerReady = (event) => {
    event.target.pauseVideo();
  }

  const opts = {
    height: 'inherit',
    width:'full-width',
    playerVars: {
      autoplay: isMusicStarted?1:0,
    },
  };

  const pause = () =>{
    setMusicPaused(true)
    socket.emit('set-to-pause',spaceName)
  }
  
  const end = () =>{
    playNext()
  }
  
  const play = () =>{
    setMusicPaused(false)
    setIsMusicStarted(true)
    if(!isMusicStarted){
      socket.emit('music-started',{spaceName,currentlyPlaying:musicList[0].musicId})
    }
    socket.emit('set-to-play',spaceName)
  }
  
  const playNext = ()=>{
    socket.emit('delete-music',{spaceName,musicId:musicList[0].musicId,nextMusicId:musicList[1]?.musicId})
    musicList.shift()
    setMusicList([...musicList])
  }

  return (
    <>
        <YouTube videoId={musicList[0].musicId} onPlay={play} onPause={pause} onEnd={end} opts={opts} onReady={onPlayerReady} />
    </>
  )
}

export default Player