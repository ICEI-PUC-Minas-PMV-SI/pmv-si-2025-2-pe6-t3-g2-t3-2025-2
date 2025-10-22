"use client"

import { api } from "./api"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface RegisterData {
    name: string
    email: string
    phone: string
    password: string
    address?: string
}

interface LoginData {
    email: string
    password: string
}

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await api.post("/medlink/register", data)
            return response.data
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token)
            console.log(data)
        }
    })
}

export const useLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: async (data: LoginData) => {
            const response = await api.post("/medlink/login", data)
            return response.data         
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token)
            router.push("/scheduling")
        }
    })
}