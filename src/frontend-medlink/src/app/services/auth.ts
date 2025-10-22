import { api } from "./api";

export interface RegisterData {
    name: string
    email: string
    phone: string
    password: string
}

export interface RegisterResponse {
    token?: string
    message?: string
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post("/medlink/register", data)

    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
    }

    return response.data
}