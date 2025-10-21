import { ComponentProps } from "react"
import { ArrowRight } from "lucide-react"
import "./styles.css"

interface ScheduleButtonProps extends ComponentProps<'button'> {}

export function ScheduleButton(props: ScheduleButtonProps) {
    return (
        <button {...props}>
            Agende sua consulta
            <ArrowRight size={20}/>
        </button>
    )
}