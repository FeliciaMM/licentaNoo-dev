import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosHttp from "../interceptors/api-interceptor.js";
import './Profile.css'; // Make sure to create this CSS file

export default function Profile() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails) {
            setUsername(userDetails.username);
            setProfileImage(userDetails.profileImage);
        } else {
            axiosHttp.get(`/auth/userDetails`).then((response) => {
                setUsername(response.data.username);
                setProfileImage(response.data.ProfileImage?.base64Image || null);
                sessionStorage.setItem("userDetails", JSON.stringify({
                    username: response.data.username,
                    profileImage: response.data.ProfileImage?.base64Image || null
                }));
            });
        }

        axiosHttp.get(`/posts/posts`).then((response) => {
            setListOfPosts(response.data);
        });
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosHttp.post('/auth/upload', {
                base64Image: selectedImage
            });
            setProfileImage(selectedImage);
            setSelectedImage(null);
            sessionStorage.setItem("userDetails", JSON.stringify({
                username,
                profileImage: selectedImage
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <div className='profilePictureFake'></div>
                <div>
                    
                    <div className='infoContainer'>
                    <h1 className='user'>M.Felicia</h1>
                    <h3>Lily & Oliver ❤️</h3>
                    <h3>“Such short little lives our pets have to spend with us, and they spend most of it waiting for us to come home each day”.- John Grogan</h3>

                    </div>
                </div>
            </div>
            <div className='profilePictureChange'>
                {/* <div className='profilePictureContainer' onClick={triggerFileInput}>
                    {profileImage && (
                        <img src={profileImage} alt="Profile" className='profilePicture' />
                    )}
                    <div className='overlay'>
                        <span className='changeText'>Change Picture</span>
                    </div>
                </div> */}
                <input type="file" accept="image/*" id="fileInput" onChange={handleImageChange} style={{ display: 'none' }} />
                {selectedImage && (
                    <button onClick={handleSubmit}>
                        Confirm Change
                    </button>
                )}
            </div>
            <div className='listOfPosts'>
                <ul>
                    {listOfPosts.map((post, index) => (
                        <div className='post' key={index} onClick={() => { navigate(`/post/${post.id}`) }}>
                            <div className='title'>{post.title}</div>
                            <div className='body'>{post.text}</div>
                            <div className='username'>{post.username}</div>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
