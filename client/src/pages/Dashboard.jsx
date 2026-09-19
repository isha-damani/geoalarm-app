import {useState, useEffect} from 'react';
import axios from 'axios';
import LocationMap from '../components/LocationMap';

function Dashboard() {
    const [locations, setLocations] = useState([]);
    const [name, setName] = useState('');
    const [radius, setRadius] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [liveLocation, setLiveLocation] = useState(null);

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
        }catch(err){
            console.log(err);
        }
    }

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

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Selected location: {lat}, {lng}</p>
            <LocationMap onLocationSelect={(lat,lng) => {
                setLat(lat);
                setLng(lng);
            }}/>
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
