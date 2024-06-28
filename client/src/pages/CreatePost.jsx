import "../pages/CreatePost.css"
import React, { useContext, useEffect } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import axiosHttp from "../interceptors/api-interceptor.js";

function CreatePost() {
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext); 

    const initialValues ={
        title:"",
        text:"",
    };

    useEffect(()=>{
        if(!sessionStorage.getItem('accessToken')){
            navigate("/login");
        }
    }, [navigate]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        text: Yup.string()
            .required("Post text is required")
            .max(10000, "Post text cannot exceed 10000 characters"), // updated max length
    });

    const onSubmit = (data, { setSubmitting }) => {
        axiosHttp.post("/posts", data, {
            headers: { accessToken: sessionStorage.getItem('accessToken') }
        }).then((response) => {
            navigate("/");
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className='createPetSitterContainer'>
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label id='labelTitle'>Title: </label>
                        <ErrorMessage name="title" component="span" className="error-message" />
                        <Field 
                            id="petSitterTitle" 
                            name="title" 
                            placeholder="Write a title"
                        />
                        
                        <label id='labelText'>Post: </label>
                        <ErrorMessage name="text" component="span" className="error-message" />
                        <Field 
                            as="textarea"
                            id="petSitterText" 
                            name="text" 
                            placeholder="Write a post"
                        />
                        
                        <button type="submit" disabled={isSubmitting}> 
                            Submit Post
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default CreatePost;
