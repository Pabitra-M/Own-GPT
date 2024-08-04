import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'
import './dashbordLayout.css'

import ChatList from '../../component/chatlist/ChatList';
function DashbordLayout() {
  const navigate = useNavigate();
  const {userId, isLoaded} = useAuth();

  useEffect(() => {
    if(isLoaded && !userId){
      navigate("/sign-in");
    };

  }, [userId, isLoaded, navigate])

  if(!isLoaded) return <div>Loading...</div>
  return (
    <div className='dashbordLayout'>
    <div className='menu'><ChatList /></div>
    <div className='content'><Outlet /></div>
      
    </div>
  )
}

export default DashbordLayout
