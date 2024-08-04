import React from 'react'
import './homepage.css'
import { Link, useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';
function Homepage() {



  const [typingStatus, setTypingStatus] = useState("human1")
  return (
    <div className='homepage'>
    <img src="/orbital.png" alt="" className='orbital'/>

    <div className="left">
      <h1>OWN AI</h1>
      <h2>SuperChargae your creative and productive</h2>
      <h3>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis aliquid debitis quidem at nisi quaerat!</h3>

      <Link  to='/dashbord'>Get started</Link>

     
    </div>

  



    
    <div className="right">
      <div className="imageContainer">
        <div className="bgcontainer">
          <div className="bg"></div>
        </div>
        <img src="bot.png" alt="" className='bot' />
        <div className="chat">
        <img src= { typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot.png" }alt="" />
        <TypeAnimation
      sequence={[
        'Human : We produce food for Mice',
        2000, ()=>{
          setTypingStatus("bot")
        },
        'Bot : We produce food for Hamsters',
        2000,()=>{
          setTypingStatus("human1")
        },
        'Human : We produce food for Guinea Pigs',
        2000,()=>{
          setTypingStatus("human2")
        },
        ' Bot: We produce food for Chinchillas',
        2000,()=>{
          setTypingStatus("bot")
        },
      ]}
      wrapper="span"
      cursor={true}
      omitDeletionAnimation={true}

      repeat={Infinity}
    />
        </div>
      </div>
    </div>     
    </div>
  )
}

export default Homepage
