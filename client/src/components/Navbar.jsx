import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const {setIsLoggedIn,userData, setUserData,backendUrl} = useContext(AppContext)

  const navigate = useNavigate()

  const logout = async () =>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl+ "/api/auth/logout")

      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} className='w-28 sm:w-32' alt="" />
     {userData ? 
     <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
      {userData.name[0].toUpperCase()}
      <div className='absolute hidden group-hover:block top-0 ring-0 z-10 pt-10 rounded text-black'>
        <ul className='list-none p-2 m-0 bg-gray-100 text-sm rounded'>
          {!userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
          <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
        </ul>
      </div>
     </div>  : 
     <button onClick={()=>navigate("/login")} className='border rounded-md px-8 py-2 text-white bg-emerald-500 hover:scale-105 transition-all'>Login</button>}
    </div>
  )
}

export default Navbar
