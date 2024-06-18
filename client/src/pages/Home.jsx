import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import axiosHttp from "../interceptors/api-interceptor.js";

function Home() {
  const { authState } = useContext(AuthContext); 
  
  const [backendData, setBackendData] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('accessToken')) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const response = await axiosHttp.get("/posts");
          setBackendData(response.data);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
      fetchData();
    }
  }, [authState, navigate]); 

  return (
    <div>
      <div className='greetContainer'>
      <div className="greeting">
        <h1>Bine ai venit, {authState.username}</h1>
        <h2>Cu ce te putem ajuta astăzi?</h2>
      </div>
      </div>
      <ul>
        {backendData.map((post, index) => (
          <div className='post' key={index}>
            
            <div className='body' onClick={() => { navigate(`/post/${post.id}`) }}>{post.text}</div>
            <div className='title'>{post.title}</div>
            <div className='username'><Link to={`/profile/${post.UserId}`}> {post.username} </Link></div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Home;
