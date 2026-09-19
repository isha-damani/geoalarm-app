import {TileLayer, MapContainer, useMapEvents, Marker} from 'react-leaflet';
import {useState} from 'react';
import L from 'leaflet';

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function LocationMap({onLocationSelect, liveLocation}){
    return(
        <MapContainer
        center={[17.530322442319388, 78.48127728011036]}
        zoom={15}
        style={{height:'400px',width:'100%'}}
        >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            >
            </TileLayer>
            <LocationMarker onLocationSelect={onLocationSelect} />
            {liveLocation ? <Marker position={liveLocation} icon={redIcon}></Marker> : null}
        </MapContainer>
    )
}

function LocationMarker({onLocationSelect}){
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e){
            console.log(e.latlng);
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
    })
    return position ? <Marker 
    position={position} 
    eventHandlers={
        {
            click(e){
                setPosition(null);
                onLocationSelect(null, null);
            }
        }
    }></Marker> : null;
}

export default LocationMap;