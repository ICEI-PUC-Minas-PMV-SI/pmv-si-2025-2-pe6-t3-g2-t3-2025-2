import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

if (!baseUrl) {
    throw new Error("A variável NEXT_PUBLIC_API_URL não está definida no .env.local")
}

export const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)