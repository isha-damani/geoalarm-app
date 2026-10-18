import {useState} from 'react';
import { useOutletContext } from 'react-router-dom';

function SetAlarm(){
    const {locations, setActiveAlarmLocationId} = useOutletContext();
    const [selectedLocationId, setSelectedLocationId] = useState('');

    //SET ALARM
    function handleSetAlarm(){
        setActiveAlarmLocationId(selectedLocationId);
    }

    return(
        <div>
            <h1>Set Alarm</h1>
            <select onChange={(e) => setSelectedLocationId(e.target.value)} value={selectedLocationId}>
                <option value=''>Select a location</option>
                {locations.map((location) => 
                <option key={location._id} value={location._id}>{location.name}</option>)}
            </select>
            <button disabled={!selectedLocationId} onClick={handleSetAlarm}>Set Alarm</button>
        </div>
    );
}

export default SetAlarm;