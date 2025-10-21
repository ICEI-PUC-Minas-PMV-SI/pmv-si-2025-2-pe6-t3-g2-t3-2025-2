import { ArrowLeft } from "lucide-react"
import "./styles.css"

export function ArrowHome() {
    return (
        <div className="back">
            <ArrowLeft size={20}/>
            Voltar
        </div>
    )
}