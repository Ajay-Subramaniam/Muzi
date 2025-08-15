import React, { useEffect, useState, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { API } from '../apiConfig'
import { UserContext } from './UserInfoProvider'
import { useLoader } from './LoaderContext'

const PrivateRoute = () => {
  const [auth, setAuth] = useState(null)
  const {setUserInfo} = useContext(UserContext)
  const { openLoader,closeLoader} = useLoader()
  useEffect(() => {
    const checkAuth = async ()=>{
      const response = await fetch(API.AUTH_CHECK, {
        method: "GET",
        credentials: "include",
      })
      if (response.status == 401) {
        setAuth(false)
      }
      else {
        const data = await response.json()     
        setUserInfo(data)
        setAuth(true)
      }
    }
    checkAuth()
  }, [])

  useEffect(()=>{
    if(auth==null){
      openLoader('Please wait while we load the application.')
    }
    else{
      closeLoader()
    }
  },[auth])
  
  if (auth == null) {
    return (<></>)
  }
  return auth? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute

