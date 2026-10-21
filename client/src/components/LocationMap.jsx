import {TileLayer, MapContainer, useMapEvents, Marker, useMap} from 'react-leaflet';
import {useState, useEffect} from 'react';
import L from 'leaflet';

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function LocationMap({onLocationSelect, liveLocation, resetKey, pickEnabled, large}){

    return(
        <div className={large ? 'map-frame large' : 'map-frame'}>
            <MapContainer
            center={[17.530322442319388, 78.48127728011036]}
            zoom={15}
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
                >
                </TileLayer>
                <LocationMarker key={resetKey} onLocationSelect={onLocationSelect} pickEnabled={pickEnabled}/>
                <MapResizer large={large}/>
                {liveLocation ? <Marker position={liveLocation} icon={redIcon}></Marker> : null}
            </MapContainer>
        </div>
    )
}

function LocationMarker({onLocationSelect, pickEnabled}){
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e){
            if(!pickEnabled) return;
            // console.log(e.latlng);
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
    })
    return position&&pickEnabled ? <Marker 
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

function MapResizer({large}){
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    },[large,map]);
    return null;
}

export default LocationMap;