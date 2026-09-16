import {useState, useEffect} from 'react';
import axios from 'axios';

function Dashboard() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        async function fetchLocations(){
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:3000/api/locations", {headers : {Authorization : `Bearer ${token}`}});
                // console.log(response.data);
                setLocations(response.data); 
            }catch(err){
                console.log(err);
            }
        }
        fetchLocations();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {locations.map((location) => (
                    <li key={location._id}>{location.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;
