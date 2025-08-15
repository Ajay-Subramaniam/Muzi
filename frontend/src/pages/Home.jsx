import React,{useState, useEffect} from 'react'
import NavBar from '../components/NavBar'
import SpaceCard from '../components/SpaceCard'
import SpaceDialog from '../components/SpaceDialog'
import { useSnackbar } from '../components/SnackbarProvider';
import { clearNonExistingSpaces } from '../utils/localStorage'
import {connectSocket} from '../utils/socket'
import { useLoader } from '../components/LoaderContext';

const Home = () => {
  const [open, setOpen] = React.useState(false);
  const { showMessage } = useSnackbar()
  const { openLoader, closeLoader}  = useLoader()
  const [isFetchingSpace, setIsFetchingSpace] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  
  useEffect(() => {
    const socket = connectSocket()
    setIsFetchingSpace(true);
    socket.emit('fetch-spaces')
    socket.on('spacelist',fetchSpace)
    socket.on('fetch-spaces-error',fetchSpacesError)
    socket.on('connect_error',connectionError)
    socket.on('update-space-add',updateSpaceListAdd)
    return ()=>{
      socket.off('update-space-add',updateSpaceListAdd)
      socket.off('connect_error',connectionError)
      socket.off('spacelist',fetchSpace)
      socket.off('fetch-spaces-error',fetchSpacesError)
    }

  }, []);

  function updateSpaceListAdd(newSpaceName){
    setSpaces((prevSpaceList)=>{
        return [...prevSpaceList,{name:newSpaceName}]
    })
  }

  function connectionError(msg){
    console.error("Connection failed:", msg);
  }

  function fetchSpacesError(){
    showMessage('Failed to load spaces')
  }

  function fetchSpace(spaces){
    setSpaces(spaces); 
    setIsFetchingSpace(false);
    clearNonExistingSpaces(spaces)
  }

  useEffect(() => {
    if(isFetchingSpace) {
      openLoader()
    }
    else{
      closeLoader()
    }
  }, [isFetchingSpace])

  if(isFetchingSpace) {
    return (<></>)
  }

  return (
    <>
        <NavBar setOpen={setOpen} setIsDeleteMode={setIsDeleteMode}  isDeleteMode={isDeleteMode}/>
        <SpaceCard spaces={spaces} isDeleteMode={isDeleteMode} setSpaces={setSpaces}/>
        <SpaceDialog open={open} setOpen={setOpen} spaces={spaces}/>
    </>
  )
}

export default Home