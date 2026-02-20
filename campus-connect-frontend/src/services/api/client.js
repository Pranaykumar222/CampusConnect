import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token && !config.url.includes("/auth")) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.startsWith("/auth")
    ) {
      original._retry = true

      const refreshToken = localStorage.getItem("refreshToken")

      if (!refreshToken) {
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const res = await client.post('/auth/refresh', { refreshToken })

        const newAccessToken = res.data.accessToken

        localStorage.setItem("accessToken", newAccessToken)

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
        

        return client(original)
      } catch (err) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      
        window.location.href = "/login"
        return Promise.reject(err)
      }
      
    }

    return Promise.reject(error)
  }
)



export default client
