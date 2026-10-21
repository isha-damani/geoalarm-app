import { useState, useEffect, use } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import {getDistanceInMeters} from '../utils/distance';
import {playAlarmSound} from '../utils/playAlarmSound';
import LocationMap from '../components/LocationMap';
import { useLocation , NavLink} from "react-router-dom";

function AppLayout() {
    const [theme,setTheme] = useState(() => document.documentElement.dataset.theme);
    const [locations, setLocations] = useState([]);
    const [liveLocation, setLiveLocation] = useState(null);
    const [alarmModal, setAlarmModal] = useState(false);
    const [activeAlarmLocationId, setActiveAlarmLocationId] = useState(null);
    const [currentAlarmLogId, setCurrentAlarmLogId] = useState(null);
    const [stopAlarmFn, setStopAlarmFn] = useState(null);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [formResetKey, setFormResetKey] = useState(0);
    const currentLocation = useLocation();

    //ON THEME CHANGE
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    },[theme]);

    //FETCH LOCATIONS
    useEffect(() => {
        async function fetchLocations() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                                "http://localhost:3000/api/locations", 
                                {headers : {Authorization : `Bearer ${token}`}});
                // console.log(response.data);
                setLocations(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchLocations();
    }, []);

     //LIVE LOCATION TRACKING
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
        const distance = getDistanceInMeters(liveLocation.lat, liveLocation.lng, 
                                location.coordinates.coordinates[1], 
                                location.coordinates.coordinates[0]);
        async function triggerAlarm(){
            try{
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    "http://localhost:3000/api/alarmLogs",
                    {location: activeAlarmLocationId},
                    {headers : {Authorization : `Bearer ${token}`}}
                );
                setCurrentAlarmLogId(response.data._id);
                setActiveAlarmLocationId(null);
                // console.log(response.data);
            }catch(err){
                console.log(err);
            }
        }
        if(distance <= location.radius){
            const stop = playAlarmSound();
            setStopAlarmFn(() => stop);
            setAlarmModal(true);
            triggerAlarm();
            console.log("ALARM!");
        }
    }, [liveLocation, activeAlarmLocationId]);

    //ACKNOWLEDGE ALARM
    async function handleAcknowledgeAlarm(){
        stopAlarmFn();
        try{
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:3000/api/alarmLogs/${currentAlarmLogId}`,
                {},
                {headers : {Authorization : `Bearer ${token}`}}
            )
            setAlarmModal(false);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            {alarmModal ? (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999
                }}>
                    <div style={{
                        backgroundColor: 'var(--surface)',
                        padding: '2rem 2.5rem',
                        borderRadius: 'var(--r-lg)',
                        boxShadow: 'var(--shadow)',
                        textAlign: 'center'
                    }}>
                        <h2>Reached!</h2>
                        <button onClick={handleAcknowledgeAlarm}>OK</button>
                    </div>
                </div>
            ) : null}
            <nav>
                <NavLink to='/' end>Set Alarm</NavLink>
                <NavLink to='/add-location'>Add Location</NavLink>
                <NavLink to='/saved-locations'>Saved Locations</NavLink>
                <NavLink to='/history'>Alarm History</NavLink>
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            </nav>
            <LocationMap 
                locations={locations} 
                liveLocation={liveLocation} 
                onLocationSelect={(lat, lng) => {setLat(lat); setLng(lng); }} 
                resetKey={formResetKey}
                pickEnabled={currentLocation.pathname === '/add-location'}
            />
            <Outlet 
                context={{ locations, setLocations, 
                        liveLocation, setActiveAlarmLocationId , 
                        lat, lng, setLat, setLng, 
                        formResetKey, setFormResetKey}} 
            />
        </>
    )
}

export default AppLayout;