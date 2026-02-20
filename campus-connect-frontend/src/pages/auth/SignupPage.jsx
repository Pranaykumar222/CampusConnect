import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"

import { useDispatch, useSelector } from "react-redux"
import { registerUser, googleLogin } from "../../features/auth/authSlice"

import { GoogleLogin } from "@react-oauth/google"


const universities = [
  { value: "IIT", label: "Indian Institute of Technology (IIT)" },
  { value: "NIT", label: "National Institute of Technology (NIT)" },
  { value: "IIIT", label: "Indian Institute of Information Technology (IIIT)" },
  { value: "BITS", label: "BITS Pilani" },
  { value: "VIT", label: "VIT University" },
  { value: "SRM", label: "SRM University" },
  { value: "Delhi University", label: "Delhi University" },
  { value: "JNTU", label: "JNTU" },
  { value: "Other", label: "Other" },
]


const majors = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Electrical Engineering", label: "Electrical Engineering" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering" },
  { value: "Civil Engineering", label: "Civil Engineering" },
  { value: "Electronics & Communication", label: "Electronics & Communication" },
  { value: "Data Science", label: "Data Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Other", label: "Other" },
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showOtherUniversity, setShowOtherUniversity] = useState(false)
  const [showOtherMajor, setShowOtherMajor] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

const onSubmit = async (data) => {
  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    university:
      data.university === "Other"
        ? data.otherUniversity
        : data.university,
    major:
      data.major === "Other"
        ? data.otherMajor
        : data.major,
    password: data.password,
    confirmPassword: data.confirmPassword,
    isPrivate: false,
    termsAccepted: data.termsAccepted,
  }

  try {
    console.log("Sending payload:", payload)

    const result = await dispatch(registerUser(payload)).unwrap()

    console.log("REGISTER SUCCESS:", result)

    navigate("/verify-email", { state: { email: data.email } })

  } catch (err) {
    console.log("REGISTER ERROR:", err)
  }
}



  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(
      googleLogin({ token: credentialResponse.credential })
    )

    if (googleLogin.fulfilled.match(result)) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Create your account</h2>
      <p className="mt-1 text-sm text-gray-500">Join CampusConnect</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">

       
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            error={errors.firstName?.message}
            {...register("firstName", { required: "Required" })}
          />

          <Input
            label="Last Name"
            error={errors.lastName?.message}
            {...register("lastName", { required: "Required" })}
          />
        </div>

       
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email", { required: "Email required" })}
        />

      
        <Select
          label="University"
          options={universities}
          error={errors.university?.message}
          {...register("university", { required: "Required" })}
          onChange={(e) => {
            setShowOtherUniversity(e.target.value === "Other")
          }}
        />

        {showOtherUniversity && (
          <Input
            label="Enter your University"
            error={errors.otherUniversity?.message}
            {...register("otherUniversity", { required: "Required" })}
          />
        )}

     
        <Select
          label="Major"
          options={majors}
          error={errors.major?.message}
          {...register("major", { required: "Required" })}
          onChange={(e) => {
            setShowOtherMajor(e.target.value === "Other")
          }}
        />

        {showOtherMajor && (
          <Input
            label="Enter your Major"
            error={errors.otherMajor?.message}
            {...register("otherMajor", { required: "Required" })}
          />
        )}

    
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            {...register("password", {
              required: "Password required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px]"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

   
        <Input
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Required",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />

        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("termsAccepted", {
              required: "You must accept Terms & Privacy Policy",
            })}
          />
          <span className="text-sm">
            I agree to Terms & Privacy Policy
          </span>
        </label>

        {errors.termsAccepted && (
          <p className="text-xs text-red-500">
            {errors.termsAccepted.message}
          </p>
        )}

       
        {error && (
          <p className="text-sm text-red-500">
            {error?.message || error}
          </p>
        )}

     
        <Button type="submit" isLoading={isLoading}>
          Create Account
        </Button>

        
        <div className="relative my-4 text-center">
          <span className="bg-white px-2 text-xs text-gray-400">
            Or continue with
          </span>
        </div>

     
        <div className="flex justify-center">
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
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
