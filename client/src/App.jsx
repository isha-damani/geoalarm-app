import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddLocation from './pages/AddLocation';
import AlarmHistory from './pages/AlarmHistory';
import SavedLocations from './pages/SavedLocations';
import SetAlarm from './pages/SetAlarm';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

function App() {

  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path = '/' element = {<SetAlarm />} />
          <Route path='/add-location' element={<AddLocation />} />
          <Route path='/history' element={<AlarmHistory />} />
          <Route path = '/saved-locations' element = {<SavedLocations />} />
      </Route>
    </Routes>
  )
}

export default App;

