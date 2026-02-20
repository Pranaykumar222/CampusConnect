import client from './client'

export const registerUserApi = (data) =>
  client.post('/auth/register', data)


export const verifyEmailApi = (data) =>
  client.post("/auth/verify-email", data)


export const resendOtpApi = (email) =>
  client.post("/auth/resend-otp", { email })


export const loginUserApi = (data) =>
  client.post('/auth/login', data)

export const refreshTokenApi = (refreshToken) =>
  client.post("/auth/refresh", { refreshToken })


export const getMe = () =>
  client.get('/users/me')

export const logoutApi = () =>
  client.post('/auth/logout')
