import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext();
    const login = async(email, uid) =>{
        setIsLoading(true)
        setError(null)
        const API_BASE_URL = process.env.NODE_ENV === 'production' ?
        window.location.origin:
        'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/login`,{
            method: "POST",
            body: JSON.stringify({
                email,
                uid,
            }),
            headers:{
                "Content-type": "application/json"
            },
        })
        const json = await response.json()

        if (!response.ok){
            throw Error(json.error)
        }else{
            console.log(json.token);
            localStorage.setItem("user", JSON.stringify(json));
            dispatch({type:'LOGIN',payload: json})
            console.log("User logged in");
            setIsLoading(false)
        }
    }

    return {login, isLoading, error}
    
}