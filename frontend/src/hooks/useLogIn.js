import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import ApiUrl from "../ApiUrl";

export const useLogin = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext();
    const login = async(email, uid,remember) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${ApiUrl}/api/login`,{
            method: "POST",
            body: JSON.stringify({
                email,
                uid,
                remember,
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