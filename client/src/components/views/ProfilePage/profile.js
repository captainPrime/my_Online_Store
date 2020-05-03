import React, { useEffect, useState } from 'react'
import Axios from "axios";
import { Card, Alert, message, Descriptions } from 'antd'

export default function ProfilePage() {
    const [Profile, setProfile] = useState([])
    useEffect(() => {
        Axios.post('/api/users/getProfile')
            .then(response => {
                setProfile(response.data.user)
            })
    })
    return (
        <div style={{ width: '75%', margin: '3em auto' }}>
            {Profile.map((user, index) => {
                return (
                    <div>

                        <Alert message={`You are logged in as ${user.name}`} type="success" />
                        <br /><br />
                        <div style={{ border: 'solid 1px lightgrey', padding: '20px' }}>
                            <Descriptions title='User Info'>
                                <Descriptions.Item label='FirstName'><span style={{ fontWeight: 'bold' }}>{user.name}</span></Descriptions.Item>
                                <Descriptions.Item label='LastName'><span style={{ fontWeight: 'bold' }}>{user.lastName}</span></Descriptions.Item>
                                <Descriptions.Item label='Email'><span style={{ fontWeight: 'bold' }}>{user.email}</span></Descriptions.Item>

                            </Descriptions>
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
