import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function PetSitterOffers() {
    const { authState } = useContext(AuthContext); 
  
    const [backendData, setBackendData] = useState([]);
  
    let navigate = useNavigate();
  
    useEffect(() => {
      if (!sessionStorage.getItem('accessToken')) {
        navigate("/login");
      } else {
        const fetchData = async () => {
          const response = await fetch("/petsitteroffers", { mode: 'cors' });
          console.log(response);
          const data = await response.json();
          setBackendData(data);
        };
        fetchData();
      }
    }, [authState, navigate]); 
  
    return (
      <div>
        <ul>
          {backendData.map((petSitterObject, index) => (
            <div className='post' key={index} >
              <div className='title'>{petSitterObject.title}</div>
              <Link to={`/petsitter/${petSitterObject.id}`} className='body'>{petSitterObject.text}</Link>
              <div className='username'>{petSitterObject.username}</div>
            </div>
          ))}
        </ul>
      </div>
    )
  }
  

export default PetSitterOffers