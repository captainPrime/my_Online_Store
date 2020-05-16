import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, message, Form } from 'antd';
import Axios from 'axios'
import { Formik } from 'formik';
import * as Yup from 'yup';

function EditProfile(props) {
    const [visible, setvisible] = useState(false)
    const [Name, setName] = useState(props.name)
    const [Lastname, setlastname] = useState(props.lastname)

    const handleFirstname = event => {
        setName(event.target.value)
        //console.log(this.name)
    }
    const handleLastname = event => {
        setlastname(event.target.value)
        //console.log(this.name)
    }

    const showModal = () => {
        setvisible(true)
    };



    const handleCancel = e => {
        console.log(e);
        setvisible(false)
    };


    return (
        <Formik
            initialValues={{
                email: props.email
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
            })}
            onSubmit={(values, { setSubmitting }) => {

                let variables = {
                    name: Name,
                    lastName: Lastname,
                    email: values.email,
                }

                Axios.post('/api/users/updateprofile', variables)
                    .then(response => {
                        if (response.data.success) {
                            message.success('Profile details Successfully updated', 10)
                            //window.location.reload(true)
                        }
                    })
                setvisible(false)
            }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleSubmit,
                    handleBlur
                } = props;

                return (
                    <div>
                        <Button type="primary" onClick={showModal}>
                            Edit Profile
                       </Button>
                        <Modal
                            title="Edit Profile"
                            visible={visible}
                            onOk={handleSubmit}
                            onCancel={handleCancel}
                        >
                         
                            <Input type="text" placeholder="firstname" style={{ marginTop: '20px' }} onChange={handleFirstname} value={Name} />
                            <Input type="text" placeholder="lastname" style={{ marginTop: '20px' }} value="hey" onChange={handleLastname} value={Lastname} />
                            
                                <Input id="email" onBlur={handleBlur} type="email" placeholder="email" style={{ marginTop: '20px', marginBottom: '20px' }} onChange={handleChange} value={values.email}
                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                                
                                 {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                 )}
                    
                            {/*     <Input.Password type="text" placeholder="new password" style={{ marginTop: '20px' }} />
                                   <Input.Password type="text" placeholder="confirm new password" style={{ marginTop: '20px' }} /> */}
                        
                        </Modal>
                    </div>
                )
            }}

        </Formik>
    )


}

export default EditProfile
