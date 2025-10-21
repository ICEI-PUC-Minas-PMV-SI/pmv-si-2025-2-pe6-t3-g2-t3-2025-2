import { ComponentProps } from "react";
import "./styles.css";

interface InputProps extends ComponentProps<'input'> {
    label?: string
    error?: string
}

export function Input({ label, id, ...props }: InputProps) {
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input {...props}/>
        </>
    )
}