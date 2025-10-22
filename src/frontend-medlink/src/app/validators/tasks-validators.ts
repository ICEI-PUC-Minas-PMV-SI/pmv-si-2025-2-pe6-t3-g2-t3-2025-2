import z from "zod"

export const newTaskFormSchema = z.object({
    name: z.string().min(5, {message: "Campo obrigatório"}),
    email: z
        .string()
        .regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, { message: "E-mail inválido" })
        .min(5, {message: "Campo obrigatório"}),
    phone: z
        .string()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, { message: "Telefone inválido" })
        .min(5, {message: "Campo obrigatório"}),
    password: z.string().min(8, {message: "Senha deve ter no mínimo 8 caracteres"}),
    address: z.string().optional()
})

export type NewTaskFormData = z.infer<typeof newTaskFormSchema>