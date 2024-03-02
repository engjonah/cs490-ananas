import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext();
    const signup = async(name, email, uid) =>{
        setIsLoading(true)
        setError(null)
        const API_BASE_URL = process.env.NODE_ENV === 'production' ?
        window.location.origin:
        'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/register`,{
            method: "POST",
            body: JSON.stringify({
                name,
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
            console.log("User registered");
            setIsLoading(false)
        }
    }

    return {signup, isLoading, error}
    
}