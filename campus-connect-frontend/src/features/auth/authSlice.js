import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
loginUserApi,
registerUserApi,
getMe,
verifyEmailApi,
resendOtpApi
} from '../../services/api/authService'
import { connectSocket } from "../../services/socket";


export const registerUser = createAsyncThunk(
'auth/register',
async (userData, thunkAPI) => {
try {
const res = await registerUserApi(userData)
return res.data
} catch (err) {
return thunkAPI.rejectWithValue(
err.response?.data || 'Registration failed'
)
}
}
)



export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, thunkAPI) => {
    try {
      const res = await verifyEmailApi(data)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "OTP verification failed"
      )
    }
  }
)


export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (data, thunkAPI) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!result.success) throw new Error(result.message)

      const { accessToken, refreshToken, user } = result.data

localStorage.setItem("accessToken", accessToken)
localStorage.setItem("refreshToken", refreshToken)

return { user, accessToken, refreshToken }



    } catch (err) {
      return thunkAPI.rejectWithValue(err.message)
    }
  }
)





export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, thunkAPI) => {
    try {
      await resendOtpApi(email)
      return true
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to resend OTP"
      )
    }
  }
)


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const loginRes = await loginUserApi(credentials)

      const { accessToken, refreshToken, user } = loginRes.data.data

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)

      return { user,accessToken }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      )
    }
  }
)


export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    try {
      const res = await getMe()
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || null)
    }
  }
)


const authSlice = createSlice({
name: 'auth',

initialState: {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authChecked: false,
  error: null,
}
,

reducers: {
clearCredentials: (state) => {
state.user = null
state.isAuthenticated = false
localStorage.removeItem("accessToken")
localStorage.removeItem("refreshToken")
},
setAuthChecked: (state) => {
  state.authChecked = true
}
},

extraReducers: (builder) => {
builder



  .addCase(registerUser.pending, (state) => {
    state.isLoading = true
    state.error = null
  })
  .addCase(registerUser.fulfilled, (state) => {
    state.isLoading = false
  })
  .addCase(registerUser.rejected, (state, action) => {
    state.isLoading = false
    state.error = action.payload
  })


  .addCase(loginUser.pending, (state) => {
    state.isLoading = true
    state.error = null
  })


.addCase(loginUser.fulfilled, (state, action) => {
  state.isLoading = false
  state.user = action.payload.user
  state.isAuthenticated = true

  connectSocket(action.payload.accessToken)
})





  .addCase(loginUser.rejected, (state, action) => {
    state.isLoading = false
    state.error = action.payload
  })


  .addCase(fetchMe.fulfilled, (state, action) => {
    state.user = action.payload.user
    state.isAuthenticated = true
    state.authChecked = true
  })
  

.addCase(fetchMe.rejected, (state) => {
  state.isLoading = false
  state.authChecked = true
})


.addCase(googleLogin.fulfilled, (state, action) => {
  state.user = action.payload.user
  state.isAuthenticated = true

  connectSocket(action.payload.accessToken)
})


},
})


export const { clearCredentials,setAuthChecked } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user

export default authSlice.reducer
