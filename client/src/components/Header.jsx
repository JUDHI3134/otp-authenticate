import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6' alt="" />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer <img src={assets.hand_wave} className='w-8 aspect-square' alt="" /> </h1>
      <h3 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h3>
      <p className='mb-8 max-w-md'>Let's start with a quick product store and we will  have you up and running in no time!</p>
      <button onClick={()=>navigate("/login")} className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header
