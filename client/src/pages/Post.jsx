import React, {useContext, useEffect, useState} from 'react'
import { useParams} from 'react-router-dom'
import {AuthContext} from '../helpers/AuthContext';
import axiosHttp from "../interceptors/api-interceptor.js";
import './Post.css';

function Post() {
    const { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);


    useEffect(()=>{
        axiosHttp.get(`/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axiosHttp.get(`/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    },[]);

    const addComment = ()=>{
        axiosHttp.post("/comments", {
                commentText: newComment, PostId: id,
  },
  )
      .then((response)=>{
          if(response.data.error){
          console.log(response.data.error);
             
          }else{
          const commentToAdd={commentText:newComment, username: response.data.username, userId: response.data.userId}
          setComments([...comments, commentToAdd ]);
          setNewComment("");
          console.log(response.data.userId);
      }
      });
      window.location.reload();
  };

    

    const deleteComment = (id) => {
        axiosHttp
      .delete(`/comments/${id}`, {
          headers: {accessToken: sessionStorage.getItem("accessToken")},
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
              return val.id !== id;
          })
        );
      });
  };


   
  return (
    <div className='pageOfPosts'>
        <div className='upSide'>
            <div className='postTitle'>{postObject.title}</div>
            <div className='postText'>{postObject.text}</div>
            <div className='postUsername'>{postObject.username} {authState.username === postObject.username && (
              <button>
                {" "}
                Delete Post
              </button>
            )}
            </div>
        </div>
        <div className='downSide'>
            <div className='writeComment'> <input  id="commentInput" type="text" placeholder='Write a comment' value={newComment} onChange={(event)=>{setNewComment(event.target.value)}}/></div>
            <button id="commentButton" onClick={addComment}>Add Comment</button>
            <div className='Comments'>
                {comments.map((comment,key)=>{
                    return <div key={key} className='comment'>
                    {comment.commentText}
                    <label >Username: {comment.username}</label>
                    {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      
                      deleteComment(comment.id);
                      
                    }}
                  >
                    delete comment
                  </button>
                )}
                    </div>
                })}
            </div>
        </div>
        </div>
  )
}

export default Post