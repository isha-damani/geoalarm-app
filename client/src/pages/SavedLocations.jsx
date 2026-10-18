import axios from "axios";
import { useOutletContext } from "react-router-dom";

function SavedLocations() {
    const {locations, setLocations} = useOutletContext();

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

    return (
        <div>
            <h2>Saved Locations</h2>
            <ul>
                {locations.map((location) => (
                    <li key={location._id}> 
                    {location.name} 
                    <button onClick={() => handleDelete(location._id)}> Delete </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavedLocations;