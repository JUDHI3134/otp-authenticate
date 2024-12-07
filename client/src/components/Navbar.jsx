import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate()

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} className='w-28 sm:w-32' alt="" />
      <button onClick={()=>navigate("/login")} className='border rounded-md px-8 py-2 text-white bg-emerald-500 hover:scale-105 transition-all'>Login</button>
    </div>
  )
}

export default Navbar
