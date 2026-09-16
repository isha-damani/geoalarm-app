import {useState} from 'react';
import axios from 'axios';
function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/api/auth/signup', {email, password});
            console.log(response.data);
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type='email' value ={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type='submit'>Signup</button>
            </form >
        </div>
    )
}

export default Signup;