import {useState, useEffect} from 'react';
import axios from 'axios';
function AlarmHistory() {
    const [alarmLogs, setAlarmLogs] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        async function fetchAlarmLogs() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/alarmLogs', 
                    { headers: { Authorization: `Bearer ${token}` } });
                setAlarmLogs(response.data);
                const locationResponse = await axios.get('http://localhost:3000/api/locations',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLocations(locationResponse.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAlarmLogs();
    }, []);

    return (
        <div>
            <h2>Alarm History</h2>
            <ul>
            {alarmLogs.map((alarmLog) => (
                    <li key={alarmLog._id}>{locations.find((location) => location._id === alarmLog.location)?.name || 'Unknown Location'} : {alarmLog.acknowledged ? 'Acknowledged' : 'Unacknowledged'}</li>
                ))}
            </ul>
        </div>
    )
}

export default AlarmHistory;