import {ErrorMessage, Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../helpers/AuthContext.jsx";
import * as Yup from "yup";
import axiosHttp from "../interceptors/api-interceptor.js";
import "../pages/Login.css"


const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
});

function Login() {
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    const onSubmit = (values) => {
        const data = { username: values.username, password: values.password };
        axiosHttp.post("/auth/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                sessionStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
                navigate("/");
            }
        })
    };

    return (
        <div>
           
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainerLogin">
                <h1>Login</h1>
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span"/>
                    <Field
                        id="inputCreateUsername"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        type="password"
                        id="inputCreatePassword"
                        name="password"
                        placeholder="Your Password..."
                    
                    />
                    <h3 className="forgotPassword">Ai uitat parola?</h3>
                    <button type="submit"> Login</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login;
