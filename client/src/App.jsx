import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';
import './App.css';

function App() {

  return (
    <Routes>
      <Route path = '/'></Route>
      <Route path = '/signup' element={<Signup />}></Route>
      <Route path = '/login'></Route>
    </Routes>
  )
}

export default App;
