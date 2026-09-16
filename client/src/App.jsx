import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {

  return (
    <Routes>
      <Route path = '/' element={<Dashboard />}></Route>
      <Route path = '/signup' element={<Signup />}></Route>
      <Route path = '/login' element={<Login />}></Route>
    </Routes>
  )
}

export default App;
