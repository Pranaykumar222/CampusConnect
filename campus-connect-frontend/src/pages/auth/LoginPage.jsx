import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

import { useDispatch, useSelector } from 'react-redux'
import { loginUser, googleLogin } from '../../features/auth/authSlice'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))

    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  
  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(
      googleLogin({ token: credentialResponse.credential })
    )

    if (googleLogin.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome back</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email required' })}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            {...register('password', { required: 'Password required' })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px]"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {error && (
  <p className="text-red-500">
    {typeof error === "string" ? error : error?.message}
  </p>
)}


        <Button type="submit" isLoading={isLoading}>
          Sign In
        </Button>


        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              dispatch(addToast({
                type: "error",
                message: "Google login failed"
              }))
            }
          />
        </div>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
