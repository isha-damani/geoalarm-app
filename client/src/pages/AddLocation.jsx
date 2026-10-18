//IMPORTS
import {useState} from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

function AddLocation() {
    const { locations, setLocations, liveLocation, lat, lng, setLat, setLng, formResetKey, setFormResetKey } = useOutletContext();
    const [name, setName] = useState('');
    const [radius, setRadius] = useState('');
    
    //ADD LOCATION
    async function handleAddLocation(e){
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(
                "http://localhost:3000/api/locations", 
                {
                    name,
                    radius,
                    coordinates: {
                        type: "Point",
                        coordinates:[Number(lng),Number(lat)]
                    }
                }, 
                {headers : {Authorization : `Bearer ${token}`}}
            );
            console.log(response.data);
            setLocations([...locations, response.data]);
            setName('');
            setRadius('');
            setLat('');
            setLng('');
            setFormResetKey(formResetKey + 1);
        }catch(err){
            console.log(err);
        }
    }
    
    //RENDER
    return (
        <div>
            <h2>Add Location</h2>
            <p>Selected location: {lat}, {lng}</p>

            <form onSubmit={handleAddLocation}>
                <input type='text' value={name} placeholder='name' onChange={(e) => setName(e.target.value)}></input>
                <input type='number' value={radius} placeholder='radius' onChange={(e) => setRadius(e.target.value)}></input>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default AddLocation;
