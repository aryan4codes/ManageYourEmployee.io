import { useParams,useNavigate } from "react-router-dom"
import { useAuth } from "./security/AuthContext";
import { createEmpApi, retrieveEmpApi,updateEmpApi } from "./api/EmpApiService";
import { useState,useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './EmployeeComponent.css'; 


const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    designation: Yup.string().required("Designation is required"),
});


export default function EmployeeComponent() {

    const {id} = useParams();
    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        name: "",
        email: "",
        designation: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (id !== "-1") {  // Only fetch details if id is not -1
            retrieveEmpDetails(username, id);
        } else {
            setIsLoading(false);  // Skip loading if it's a new employee
        }
    }, [id, username]);

    const retrieveEmpDetails = (username, id) => {
        setIsLoading(true);
        retrieveEmpApi(username, id)
            .then((response) => {
                setInitialValues({
                    name: response.data.name,
                    email: response.data.email,
                    designation: response.data.designation
                });
                setIsLoading(false);
            })
            .catch((error) => {
                setError("Failed to fetch employee details.");
                setIsLoading(false);
            });
    };

    const handleSubmit = (values, { setSubmitting }) => {

        if(id!==-1){
            
            createEmpApi(username, values)
            .then(() => {
                alert("Employee created successfully.");
                setSubmitting(false);
                navigate("/dashboard")
            })
            .catch((error) => {
                setError("Failed to create employee details.");
                setSubmitting(false);
            });
        }
        else {
            updateEmpApi(username, id, values)
            .then(() => {
                alert("Employee details updated successfully.");
                setSubmitting(false);
                navigate("/dashboard")
            })
            .catch((error) => {
                setError("Failed to update employee details.");
                setSubmitting(false);
            });
        }
        
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error && id !== "-1") {  // Show error only if not creating a new employee
        return <div>{error}</div>;
    }
    return (
        <div className="container">
            <h1>Enter Employee Details</h1>
            <div className="form-container">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <Field type="email" id="email" name="email" />
                                <ErrorMessage name="email" component="div" className="error-message" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="designation">Designation:</label>
                                <Field type="text" id="designation" name="designation" />
                                <ErrorMessage name="designation" component="div" className="error-message" />
                            </div>
                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                Update
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}