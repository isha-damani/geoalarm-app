import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlarmHistory from './pages/AlarmHistory';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Routes>
      <Route path = '/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
      <Route path = '/signup' element={<Signup />}></Route>
      <Route path = '/login' element={<Login />}></Route>
      <Route path='/history' element={<ProtectedRoute><AlarmHistory /></ProtectedRoute>}></Route>
    </Routes>
  )
}

export default App;

