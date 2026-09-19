//IMPORTS
import {useState, useEffect, act} from 'react';
import axios from 'axios';
import LocationMap from '../components/LocationMap';
import { getDistanceInMeters } from '../utils/distance';

function Dashboard() {
    const [locations, setLocations] = useState([]);
    const [name, setName] = useState('');
    const [radius, setRadius] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [liveLocation, setLiveLocation] = useState(null);
    const [activeAlarmLocationId, setActiveAlarmLocationId] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [formResetKey, setFormResetKey] = useState(0);

    //FETCH LOCATIONS
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


    //LIVE LOCATION
    useEffect(() => {
        const successCallback =  (pos) => {
            // console.log(pos.coords.latitude, pos.coords.longitude);
            setLiveLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })
        }
        const errorCallback = (err) => {
            console.log(err);
        }
        navigator.geolocation.watchPosition(successCallback, errorCallback);
    },[]);


    //DISTANCE CHECK FOR ALARMS
    useEffect(() => {
        if(!liveLocation) return;
        if(!activeAlarmLocationId) return;
        const location = locations.find(location => location._id === activeAlarmLocationId);
        if(!location) return;
        const distance = getDistanceInMeters(liveLocation.lat, liveLocation.lng, location.coordinates.coordinates[1], location.coordinates.coordinates[0]);
        async function triggerAlarm(){
            try{
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    "http://localhost:3000/api/alarmLogs",
                    {location: activeAlarmLocationId},
                    {headers : {Authorization : `Bearer ${token}`}}
                );
                setActiveAlarmLocationId(null);
                // console.log(response.data);
            }catch(err){
                console.log(err);
            }
        }
        if(distance <= location.radius){
            triggerAlarm();
            console.log("ALARM!");
        }
    }, [liveLocation, activeAlarmLocationId]);
    
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
