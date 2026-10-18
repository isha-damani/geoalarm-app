//IMPORTS
import {useState} from 'react';
import axios from 'axios';
import LocationMap from '../components/LocationMap';
import { useOutletContext } from 'react-router-dom';

function Dashboard() {
    const {locations, setLocations, liveLocation, setActiveAlarmLocationId} = useOutletContext();
    const [name, setName] = useState('');
    const [radius, setRadius] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [formResetKey, setFormResetKey] = useState(0);
    
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

    //DELETE LOCATION
    async function handleDelete(id){
        try{
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:3000/api/locations/${id}`,
                {headers : {Authorization : `Bearer ${token}`}}
            );
            console.log(response.data);
            setLocations(locations.filter((location) => location._id !== id));
        }catch(err){
            console.log(err);
        }
    }

    //SET ALARM
    function handleSetAlarm(){
        setActiveAlarmLocationId(selectedLocationId);
    }

    
    //RENDER
    return (
        <div>
            <h1>GEO-ALARM</h1>
            <h2>Dashboard</h2>
            <p>Selected location: {lat}, {lng}</p>
            <LocationMap onLocationSelect={(lat,lng) => {
                setLat(lat);
                setLng(lng);
            }} 
            liveLocation={liveLocation} 
            resetKey={formResetKey}/>

            <h2>Set an alarm</h2>
            <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            >
                <option value="">Select a location</option>
                {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                        {location.name}
                    </option>
                ))}
            </select>
            <button 
            disabled={!selectedLocationId}
            onClick={handleSetAlarm}> 
            Set Alarm
            </button>

            <h2>Saved Locations</h2>
            <ul>
                {locations.map((location) => (
                    <li key={location._id}>
                        {location.name} 
                        <button onClick={() => handleDelete(location._id)}>Delete</button></li>
    
                ))}
            </ul>
        
            <h2>Add Location</h2>
            <form onSubmit={handleAddLocation}>
                <input type='text' value={name} placeholder='name' onChange={(e) => setName(e.target.value)}></input>
                <input type='number' value={radius} placeholder='radius' onChange={(e) => setRadius(e.target.value)}></input>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Dashboard;
