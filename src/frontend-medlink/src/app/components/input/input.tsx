import { type ComponentProps, forwardRef } from "react";
import styles from "./input.module.css";

export interface InputProps extends ComponentProps<"input"> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${styles.input} ${className} ${error ? styles["input--error"] : ""}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
