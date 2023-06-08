import { APIUrl } from "../app/App"

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken },
      } = store.getState()

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`
      }
      axios.defaults.baseURL = `${APIUrl}`

      return config
    },
    (err) => Promise.reject(err)
  )
}
