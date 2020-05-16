import React, { useEffect, useState } from 'react'
import Axios from "axios";
import { Card, Alert, message, Descriptions, Button, notification, Icon } from 'antd'
import { SmileOutline } from '@ant-design/icons';
import FileUpload from './sections/profilePicture.js'
import EditProfile from './sections/editProfile'
import HistoryPage from './sections/HistoryPage' 

export default function ProfilePage(props) {
    //save profile image
    const [Image, setImage] = useState()

    const [Profile, setProfile] = useState([])

    //this saves an instance of the image in the parent component
    const updateImage = (newImage) => {
        setImage(newImage)

    }

    useEffect(() => {
        Axios.post('/api/users/getProfile')
            .then(response => {
                setProfile(response.data.user)
            })
    })

    useEffect(() => {
        if (Profile) {
            notification.open({
                message: `WELCOME TO TAIWO'S ONLINE SHOP`,
                description:
                    'Select the box to choose a profile picture and you can also update your profile information here'
            });

        }
    }, [!Profile])

    const onSubmit = (profileImage) => {

        let variable = { profileImage: Image }

        console.log(profileImage)
        if (!Image) {
            message.error("please upload an image of yourself")
        }

        else {

            // this savses the image to the database
            Axios.post('/api/users/uploadProfile', variable)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data)
                        message.success('Profile Image successfully uploaded');
                        props.history.push('/profile');
                    }
                    else {
                        message.error('Failed to Save Product')
                    }
                })
        }
    }

    //Delete Profile Picture function

    const deleteProfilePicture = () => {
        Axios.delete('/api/users/profilePicture')
            .then(response => {
                if (response.data.success) { message.success('profile image removed')} 
                else{
                message.error('failed to remove profile image')
                }
            })
    }



return (
    <div style={{ width: '75%', margin: '3em auto' }}>


        {Profile.map((user, index) => {
            return (
                <div>
                    <FileUpload refreshFunction={updateImage} />
                    <br />

                    <Button
                        type="primary"
                        onClick={onSubmit}
                    >
                        Save Profile Image
                        </Button>

                    <Button
                        type="danger"
                        style={{ marginLeft: '7px' }}
                        onClick={deleteProfilePicture}
                    >
                        <Icon type="delete" ></Icon>
                    </Button>
                    <br />
                    <br />
                    <Alert message={`You are logged in as ${user.name}`} type="success" />
                    <br /><br />
                    <div style={{ border: 'solid 1px lightgrey', padding: '20px' }}>
                        <Descriptions title='User Info'>
                            <Descriptions.Item label='FirstName'><span style={{ fontWeight: 'bold' }}>{user.name}</span></Descriptions.Item>
                            <Descriptions.Item label='LastName'><span style={{ fontWeight: 'bold' }}>{user.lastName}</span></Descriptions.Item>
                            <Descriptions.Item label='Email'><span style={{ fontWeight: 'bold' }}>{user.email}</span></Descriptions.Item>

                        </Descriptions>
                    </div>
                    <br />
                    <EditProfile
                        name={user.name}
                        lastname={user.lastName}
                        email={user.email}
                    />

                </div>
            )
        })}

        <HistoryPage/>
    </div>
)
}
