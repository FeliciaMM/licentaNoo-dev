import './App.css';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import {AuthContext} from "./helpers/AuthContext";
import {useEffect, useState} from 'react';
import PageNotFound from "./pages/PageNotFound";
import Profile from './pages/Profile';
import CreatePetSitter from './pages/CreatePetSitter';
import PetSitter from './pages/PetSitter';
import PetSitterOffers from './pages/PetSitterOffers';
import axiosHttp, {setNotify403Error} from "./interceptors/api-interceptor.js";
import {NotificationProvider, useNotification} from "./helpers/NotificationContext.jsx";


//DELETE OR ADD PAGE

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axiosHttp.get('/auth/userDetails').then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });
  }, []);

  const logout = () => {
    sessionStorage.removeItem("Authorization");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };

  return (
      <div className='App'>
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            <NotificationProvider>
              <NotificationHandler />
              <div className='navbar'>
              <div className="profile"></div>
                <h1 className='usernameDisplay'><Link to={`/profile/${authState.UserId}`}>{authState.username}</Link></h1>
                {!authState.status ? (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/registration">Registration</Link>
                    </>
                ) : (
                    <>
                      <Link to="/">Home Page</Link>
                      <Link to="/createpost">Create a Post</Link>
                      <Link to="/petsitteroffers">PetSitters</Link>
                      <Link to="">PetWalkers</Link>
                      <Link to="">Veterinari</Link>
                      <Link to="">Conversatii</Link>
                      <Link className="logoutButton" onClick={logout} to="/login">Logout</Link>
                      <div className='navbar-small'>
                        
                      </div>
                    </>
                )}
              </div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/createpost" element={<CreatePost />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/createpetsitter" element={<CreatePetSitter />} />
                <Route path="/petsitter/:id" element={<PetSitter />} />
                <Route path="/petsitteroffers" element={<PetSitterOffers />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </NotificationProvider>
          </Router>
        </AuthContext.Provider>
      </div>
  );
}

const NotificationHandler = () => {
  const showNotification = useNotification();
  useEffect(() => {
    setNotify403Error(showNotification);
  }, [showNotification]);
  return null;
};

export default App;