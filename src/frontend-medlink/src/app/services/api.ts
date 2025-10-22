import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

if (!baseUrl) {
    throw new Error("A variável NEXT_PUBLIC_API_URL não está definida no .env.local")
}

export const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

api.interceptors.response.use((response) => response, (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)