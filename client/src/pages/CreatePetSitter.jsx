import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import axiosHttp from "../interceptors/api-interceptor.js";
import "../pages/CreatePetSitter.css"

function CreatePetSitter() {
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);

    const initialValues = {
        title: "",
        text: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        text: Yup.string().required().max(5000),
    });

    const onSubmit = (data) => {
        axiosHttp.post("/petsitteroffers", data, {
            headers: { accessToken: sessionStorage.getItem('accessToken') }
        }).then((response) => {
            navigate("/");
        }).catch(error => {
            console.error("Error creating pet sitter offer:", error);
        });
    };

    return (
        <div className='createPetSitterContainer'>
            <div><h1>Creaza o oferta de PetSitting</h1></div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <label htmlFor="title" >Title:</label>
                    <ErrorMessage name="title" component="span" />
                    <Field type="text" id="Pettitle" name="Pettitle" placeholder="Scrie un titlu" />

                    <label htmlFor="text" >Description:</label>
                    <ErrorMessage name="text" component="span" />
                    <Field as="textarea" id="PetText" name="PetText" placeholder="Scrie o scurtă descriere despre tine" />

                    <button type="submit" className='SubmitPet'>Submit Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePetSitter;
