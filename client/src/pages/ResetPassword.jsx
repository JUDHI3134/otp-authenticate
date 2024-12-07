import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

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

  const onSubmitEmail = async (e) =>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl +"/api/auth/send-reset-otp",{email})

      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) =>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) =>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/reset-password",{email,otp, newPassword})
      
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate("/login")

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to bg-purple-400'>
      <img onClick={()=>navigate("/")} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt="" />

      {/* enter Email id  */}
      {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className='bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-2xl text-white font-semibold text-center mb-4'>Reset Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter your registered Email id.</p>

      <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded bg-white'>
        <img src={assets.mail_icon} className='w-3 h-3' alt="" />
        <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Enter Email' className='bg-transparent outline-none text-black' required />
      </div>
      <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded mt-3'>Submit</button>
      </form>
}

      {/* otp input form  */}
      {!isOtpSubmitted && isEmailSent &&
      <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-2xl text-white font-semibold text-center mb-4'>Reset Password Otp</h1>
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
          <button className=' w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
      </form>
}

      {/* enter new password  */}
    {isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubmitNewPassword} className='bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-2xl text-white font-semibold text-center mb-4'>New Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>

      <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded bg-white'>
        <img src={assets.lock_icon} className='w-3 h-3' alt="" />
        <input onChange={e => setNewPassword(e.target.value)} value={newPassword} type="password" placeholder='Enter New password' className='bg-transparent outline-none text-black' required />
      </div>
      <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded mt-3'>Submit</button>
      </form>
}
    </div>
  )
}

export default ResetPassword;
