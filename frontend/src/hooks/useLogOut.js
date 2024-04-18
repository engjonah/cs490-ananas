import { useAuthContext } from "./useAuthContext";

export const useLogout = () =>{

    const {dispatch} = useAuthContext();
    const logout = async(name, email, uid) =>{
        localStorage.removeItem('user')
        sessionStorage.removeItem('user');
        dispatch({type:'LOGOUT'})        
    }

    return {logout}
    
}