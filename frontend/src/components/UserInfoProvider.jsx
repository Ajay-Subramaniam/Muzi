import React,{ createContext, useState } from 'react'

export const UserContext = createContext({})

const UserInfoProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({id:'',name:'',role:''})
  return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
        {children}
    </UserContext.Provider>
  )
}

export default UserInfoProvider