import {TileLayer, MapContainer} from 'react-leaflet';
function LocationMap(){
    return(
        <MapContainer
        center={[19.0760,72.8777]}
        zoom={13}
        style={{height:'400px',width:'100%'}}
        >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            >
            </TileLayer>
        </MapContainer>
    )
}
export default LocationMap;