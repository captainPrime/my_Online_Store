import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Typography, Input, Form, Button } from 'antd'
import { Formik } from 'formik';
import * as Yup from 'yup';
const Title = Typography


function ResetUser(props) {

    const [ShowError, setShowError] = useState(false)
    const [MessageFromServer, setMessageFromServer] = useState('')

    /*  const handleEmailChange = event => {
         setEmail(event.target.value)
     }
 
     const sendEmail = event => {
         event.preventDefault()
         if (Email === '') {
             setShowError(false)
             setMessageFromServer('')
         }
 
         else {
             Axios.post('/api/users/forgotPassword', Email)
                 .then(response => {
                     if (response.data === 'email not in database') {
                         setShowError(true)
                         setMessageFromServer('')
                     }
                     else if (response.data === 'recovery email sent') {
                         setShowError(true)
                         setMessageFromServer('recovery email sent')
                     }
                 })
 
                 .catch(error => {
                     console.log(error.data)
                 })
         }
     } */
    return (
        <Formik
            initialValues={{
                email: props.email
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                let variables = {
                    email: values.email
                }

                if (variables.email === '') {
                    setShowError(false)
                    setMessageFromServer('')
                }

                else {
                    Axios.post('/api/users/forgotPassword', variables)
                        .then(response => {
                            console.log(response.data)
                            if (response.data === 'email not in database') {

                                setShowError(true)
                                console.log(ShowError)
                                setMessageFromServer('')
                            }
                            else if (response.data === 'recovery email sent') {
                                setShowError(true)
                                setMessageFromServer('recovery email sent')
                            }
                        })

                        .catch(error => {
                            //console.log(error.data)
                        })
                }

            }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    isSubmitting,
                } = props;

                return (
                    <div className="app" style={{marginTop: '-50px'}}>
                    <h2>Reset Password</h2>
                        <form onSubmit={handleSubmit} style={{ width: '350px' }}>
                            <Form.Item required>
                                <Input id="email"
                                    onBlur={handleBlur}
                                    type="email"
                                    placeholder="enter your reset email"
                                    style={{ marginTop: '20px', marginBottom: '20px' }}
                                    onChange={handleChange}
                                    value={values.email}

                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                )}

                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                                    Send Password Reset Email
                                </Button>

                                Or <a href="/register">register now!</a>

                                
                                {ShowError && (
                                    <div className="input-feedback">Tha email address isn't recognized.
                                Please try again or register for a new account</div> 
                                )}

                                {MessageFromServer === 'recovery email sent' &&
                                    <div>
                                        <h3> Password Reset Email Successfully Sent</h3>
                                    </div>
                                }
                            </Form.Item>
                        </form>
                    </div>
                )
            }}

        </Formik>
    )

}

export default ResetUser
