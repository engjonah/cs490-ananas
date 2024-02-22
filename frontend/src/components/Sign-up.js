import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, registerWithEmailAndPassword } from '../firebase';
 
const SignUp = () => {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
 
    const onSubmit = async (event) => {     
        event.preventDefault();
        try {
            await registerWithEmailAndPassword(name, email, password);
            console.log("done!")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
        }
      
    }
 
  return (
    <main >        
        <section>
            <div>
                <div>                  
                    <h1> SignUp </h1>                                                                            
                    <form>
                    <div>
                        <label htmlFor="Name">
                                Name
                            </label>
                            <input
                                type="text"
                                label="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}  
                                required                                    
                                placeholder="Name"                                
                            />
                        </div>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             
                        
                        <button
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Sign up                                
                        </button>
                                                                     
                    </form>
                                    
                </div>
            </div>
        </section>
    </main>
  )
}
 
export default SignUp