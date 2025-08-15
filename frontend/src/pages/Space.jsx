import React , {createContext,useContext,useState,useEffect} from 'react'
import AddMusicUrl from '../components/AddMusicUrl'
import MusicQueue from '../components/MusicQueue'
import Player from '../components/Player'
import NavBar from '../components/NavBar'
import { Stack } from '@mui/material'
import {UserContext} from '../components/UserInfoProvider'
import { useParams } from 'react-router-dom'
import {connectSocket} from '../utils/socket'
import { fetchLocalStorage, getVote } from '../utils/localStorage';
import {useLoader} from '../components/LoaderContext'

export const MusicListContext = createContext()
export const MusicStatusContext = createContext()
const Space = () => {
  
  const params = useParams()
  const spaceName = params.space
  const { openLoader, closeLoader } = useLoader()
  
  useEffect(() => {
    const socket = connectSocket()
    socket.emit('join-room',spaceName)  
    socket.emit('fetch-musicList', spaceName)
    socket.on('music-queue', getMusicList)
    return () => {
      socket.off('music-queue', getMusicList)
      socket.emit('leave-room',spaceName)  
    }
  }, [spaceName])
  

  const {userInfo} = useContext(UserContext)
  const [musicList, setMusicList] = useState([])
  const [musicPaused, setMusicPaused] = useState(true)
  const [isMusicStarted,setIsMusicStarted] = useState(false)
  const [fetchMusicListLoading, setFetchMusicListLoading] = useState(true)

  function getMusicList({musicQueue,currentlyPlaying,currentMusicState}) {
      if(currentMusicState){
        setToPlay()
      }
      fetchLocalStorage(spaceName,musicQueue)
      musicQueue = musicQueue.map(music=>{
        const myVote = getVote(music.musicId,music.addedAt,spaceName)
        return {
          ...music,
          myVote  
        }
      })
      if(currentlyPlaying){
        const firstMusic = musicQueue.find(music=>music.musicId==currentlyPlaying)
        const restMusic = musicQueue.filter(music=>music.musicId!=currentlyPlaying)
        restMusic.sort(sortComparator)
        if(firstMusic){
          musicQueue = [firstMusic,...restMusic]
        }
        else{
          musicQueue = restMusic
        }
      }
      else{
        musicQueue.sort(sortComparator)
      }
      setMusicList(musicQueue)
      setFetchMusicListLoading(false)
  }

  function setToPlay() {
    setMusicPaused(false)
  }

  function sortComparator(a,b){
    //sorts based on score in descending order incase of tie sorts tehm in lastModified at in ascending order
    if(a.score==b.score){
      return new Date(a.lastModifiedAt)-new Date(b.lastModifiedAt)
    }
    return b.score-a.score
  }
  
  function canDisplayPlayer(){
    return userInfo.role=='admin' && musicList.length>0
  }

  useEffect(()=>{
    if(fetchMusicListLoading){
      openLoader()
    }
    else{
      closeLoader()
    }
  },[fetchMusicListLoading])

  if(fetchMusicListLoading){
    return (<></>)
  }

  return (
    <>
      <Stack spacing={1}>
        <NavBar/>
        <MusicListContext.Provider value={{musicList,setMusicList}}>
        <MusicStatusContext.Provider value={{musicPaused,setMusicPaused,isMusicStarted,setIsMusicStarted}}>
          <Stack direction="row" spacing={1}>
            <MusicQueue />
            <Stack spacing={1}>
              <AddMusicUrl />
              {canDisplayPlayer() && <Player />}
            </Stack>
          </Stack>
        </MusicStatusContext.Provider>
        </MusicListContext.Provider>
      </Stack>
    </>
  )
}

export default Space