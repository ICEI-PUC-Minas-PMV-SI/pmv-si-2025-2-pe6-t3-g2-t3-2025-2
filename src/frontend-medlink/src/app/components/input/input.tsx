import { ComponentProps } from "react";
import "./styles.css";

interface InputProps extends ComponentProps<'input'> {
    error?: string
}

export function Input({ id, className, error, ...props }: InputProps) {
    return (
        <input 
            {...props}
            aria-invalid={!!error}
            className={`${className ?? ""} ${error ? "input-error" : ""}`}
        />
    )
}