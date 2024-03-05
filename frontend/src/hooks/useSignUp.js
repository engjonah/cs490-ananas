import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import ApiUrl from "../ApiUrl";

export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext();
    const signup = async(name, email, uid) =>{
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${ApiUrl}/api/register`,{
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