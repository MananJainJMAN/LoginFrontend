import './App.css';
import { BrowserRouter , Route,  Routes } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin/AdminPage';
import ResetPassword from './Admin/ResetPassword';
import User from './User/UserPage'
import ForgotPassword from './Admin/ForgotPassword'

function App() {
  return (
    <div className="App">

<BrowserRouter>
      <Routes>
        <Route path="/"  exact element={<Login />}/>
          <Route  path="/admin"  element={<Admin />} />
          <Route path = "/user/resetPassword/:token" element = {<ResetPassword/>}/>
          <Route path = "/user" element = {<User/>}/>
          <Route path = "/forgot-password" element = {<ForgotPassword/>}/>
      
      </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;
