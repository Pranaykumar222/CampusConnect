import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { verifyEmail, resendOtp } from "../../features/auth/authSlice"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"

export default function VerifyOtpPage() {
const [otp, setOtp] = useState("")
const [timer, setTimer] = useState(30)
const [loading, setLoading] = useState(false)
const [message, setMessage] = useState("")

const navigate = useNavigate()
const dispatch = useDispatch()

const location = useLocation()
const email = location.state?.email

useEffect(() => {
if (!email) {
navigate("/register")
}
}, [email, navigate])

useEffect(() => {
if (timer === 0) return


const interval = setInterval(() => {
  setTimer((prev) => prev - 1)
}, 1000)

return () => clearInterval(interval)


}, [timer])

useEffect(() => {
if (!message) return


const timeout = setTimeout(() => {
  setMessage("")
}, 3000)

return () => clearTimeout(timeout)


}, [message])

const handleVerify = async (e) => {
e.preventDefault()
setLoading(true)


const result = await dispatch(
  verifyEmail({ email, otp })
)

setLoading(false)

if (verifyEmail.fulfilled.match(result)) {
  navigate("/login")
} else {
  setMessage("Invalid OTP. Try again.")
}


}

const handleResend = async () => {
setLoading(true)


const result = await dispatch(resendOtp(email))

setLoading(false)

if (resendOtp.fulfilled.match(result)) {
  setTimer(30)
  setMessage("OTP resent successfully!")
} else {
  setMessage("Failed to resend OTP")
}


}

return ( <div className="max-w-md mx-auto"> <h2 className="text-2xl font-bold">
Verify your email </h2>

  <p className="mt-2 text-sm text-gray-500">
    Enter the OTP sent to {email}
  </p>

  <form onSubmit={handleVerify} className="mt-6 space-y-4">
    <Input
      label="OTP Code"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter OTP"
    />

    <Button
      type="submit"
      isLoading={loading}
      className="w-full"
    >
      Verify OTP
    </Button>
  </form>

  <div className="mt-4 text-center">
    <button
      onClick={handleResend}
      disabled={timer > 0}
      className={`text-sm font-medium ${
        timer > 0
          ? "text-gray-400 cursor-not-allowed"
          : "text-blue-600 hover:underline"
      }`}
    >
      {timer > 0
        ? `Resend OTP in ${timer}s`
        : "Resend OTP"}
    </button>
  </div>

  {message && (
    <p className="mt-3 text-center text-sm text-green-600">
      {message}
    </p>
  )}
</div>
)
}
