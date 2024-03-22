import { AuthContext } from "../AuthContext"
import { useContext } from "react"
import { ErrorReport } from '../services/ErrorReport';

export const useAuthContext = () =>{
    const context = useContext(AuthContext)
    if (!context){
        ErrorReport("useAuthContext: no context");
        throw Error("no context");
    }
    return context
}