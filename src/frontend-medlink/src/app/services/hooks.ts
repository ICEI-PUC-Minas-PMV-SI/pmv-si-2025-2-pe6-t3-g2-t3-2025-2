import { useMutation } from "@tanstack/react-query"
import { registerUser, RegisterData, RegisterResponse } from "./auth"

export function useRegister() {
    return useMutation<RegisterResponse, Error, RegisterData>({
        mutationFn: registerUser,
        onSuccess: (data) => { console.log("Cadastro realizado com sucesso!", data) },
        onError: (error) => { console.error(error) },
        onSettled: () => { console.log("Mutation finalizada") }
    })
}