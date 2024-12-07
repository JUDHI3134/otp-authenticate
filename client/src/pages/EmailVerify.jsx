import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;  // used for send cookies

  const {isLoggedIn,userData, getUserData,backendUrl} = useContext(AppContext)
  const navigate = useNavigate();

  const inputRefs = React.useRef([])


  //function for fill otp and cursor go to next input
  const handleInput = (e, index) =>{
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();
    }
  }

  //function for using backspace otp input remove 
  const handleKeyDown = (e, index) =>{
    if(e.key === "Backspace" && e.target.value === '' && index > 0){
      inputRefs.current[index-1].focus();
    }
  }

  //functio fro paste feature
  const handlePaste = (e) =>{
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) =>{
      try {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value)
        const otp = otpArray.join('')

        const {data} = await axios.post(backendUrl + "/api/auth/verify-account", {otp})

        if(data.success){
          toast.success(data.message)
          getUserData();
          navigate("/")
        }else{
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.message)
      }
  }

  useEffect(()=>{
    isLoggedIn && userData &&userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to bg-purple-400'>
      <img onClick={()=>navigate("/")} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt="" />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-2xl text-white font-semibold text-center mb-4'>Email Verify Otp</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter 6 digit sent to your Email id.</p>

        <div onPaste={handlePaste} className='flex justify-between mb-8'>
          {Array(6).fill('').map((_,index)=>(
            <input type="text" maxLength="1" required key={index} 
            className='w-12 h-12 bg-white text-black text-center text-xl rounded-md'
            ref={e => inputRefs.current[index] = e} 
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e,index)}
            />
            
          ))}
        </div>
          <button className=' w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
      </form>
      
    </div>
  )
}

export default EmailVerify
