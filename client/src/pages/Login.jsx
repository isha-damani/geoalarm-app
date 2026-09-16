import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/api/auth/login', {email, password});
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email'></input>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login;