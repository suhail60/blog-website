import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './component/Layout';
import Login from './component/Login';
import Navbar from './component/Navbar';
import SingleBlogPage from './component/SingleBlogPage';
import SignUp from './component/SignUp';
import Dashboard from './component/Dashboard';
import Profile from './component/Profile';
// import PrivateRoute from './component/auth/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/blog/:id' element={<SingleBlogPage />} />
        <Route
          path='/dashboard'
          element={<Dashboard />}/>
        <Route
          path='/profile'
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
