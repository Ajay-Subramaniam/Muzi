import React, { useContext ,useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import { UserContext } from './UserInfoProvider';
import { MusicListContext, MusicStatusContext } from '../pages/Space';
import { useParams } from 'react-router-dom';
import {updateVote} from '../utils/localStorage'
import {connectSocket} from '../utils/socket'

export default function MusicCard({ musicItem ,index,reorderList}) {
  const { userInfo } = useContext(UserContext)
  const { musicList ,setMusicList } = useContext(MusicListContext)
  const { musicPaused } = useContext(MusicStatusContext)
  const [upvoted, setUpvoted] = useState(false)
  const params = useParams()
  const spaceName = params.space
  const musicId = musicItem.musicId
  const socket = connectSocket()

  function deleteMusic(){
    setMusicList((musicList)=>musicList.filter((music)=>musicId != music.musicId))
    socket.emit('delete-music',{spaceName,musicId:musicId})
  }

  function voteChange(musicItem){
    let newScore=musicItem.score
    let musicId = musicItem.musicId
    if(musicItem.myVote == 1){
      //already upvoted - decrease the score
      newScore--;
      musicItem.myVote=-1
    }
    else{
      newScore++;
      musicItem.myVote=1
    }
    musicItem.score = newScore
    updateVote(musicId,musicItem.addedAt,spaceName,musicItem.myVote,userInfo.id)
    socket.emit('update-score',{spaceName,musicId,score:newScore})
  }
  return (
    <Card sx={{ display: 'flex', height: 70, width: 'inherit', alignItems: 'center', }}>
      <CardMedia
        component="img"
        image={musicItem.thumbnail}
        alt="Album cover"
        sx={{ height: '100%', width: 100, objectFit: 'fill', borderRadius: 1 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, ml: 1 }}>
        <Typography variant="body2"
          sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
          {musicItem.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <IconButton size="small" aria-label="vote" onClick={()=>voteChange(musicItem)}>
            {musicItem.myVote==1?<KeyboardArrowDownIcon fontSize="small"/>:<KeyboardArrowUpIcon fontSize="small" />}
          </IconButton>
          <Chip label={musicItem.score} variant="outlined" size="small" sx={{ mx: 1 }} />
          {(userInfo.role == 'admin' || musicItem.addedBy == userInfo.id) && <IconButton size="small" aria-label="delete" onClick={deleteMusic}>
            <DeleteIcon fontSize="small"/>
          </IconButton>}
          {index==0 && (musicPaused?<Typography variant="caption" sx={{ ml: 2 }}>Paused...</Typography>:<Typography variant="caption" sx={{ ml: 2 }}>Playing...</Typography>)}
        </Box>
      </Box>
    </Card>

  );

}