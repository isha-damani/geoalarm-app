import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlarmHistory from './pages/AlarmHistory';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

function App() {

  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/history' element={<AlarmHistory />} />
      </Route>
    </Routes>
  )
}

export default App;

