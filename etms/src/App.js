import './App.css';
import { BrowserRouter , Route,  Routes } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin/AdminPage';

function App() {
  return (
    <div className="App">

<BrowserRouter>
      <Routes>
        <Route path="/"  exact element={<Login />}/>
          <Route  path="/admin"  element={<Admin />} />
        
      
      </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;
