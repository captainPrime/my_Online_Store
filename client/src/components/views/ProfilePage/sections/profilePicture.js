import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import Axios from 'axios'


function FileUpload(props) {
    //React dropZone documantation
    //this creates a box to upload files
    // state for images
    const [Image, setImage] = useState([])
    const [ProfilePicture, setProfilePicture] = useState()
    useEffect(() => {
        Axios.get('/api/users/getProfilePicture')
            .then(response => {
                if (response.data.success) {
                    setProfilePicture(response.data.profilepicture)

                }

            })
    })
    //---------------------------------------------------
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        //save the image inside the node server
        Axios.post('/api/users/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImage(response.data.image)
                    props.refreshFunction(response.data.image)
                }
                else {
                    alert('Failed to save Add Image')
                }
                console.log(response.data.image)
            })

            .catch(err => console.log(err))
    }
    //----------------------------------------------------------

    return (
        <div style={{ display: "flex", justifyContent: 'space-between' }}>
            <Dropzone style={{ width: '100%' }} className="dropzone"
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >

                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '200px', height: '200px', border: '1px solid lightgrey', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                        {...getRootProps()}
                    >
                        <input{...getInputProps()} />


                        {ProfilePicture === '' ? 
                        <div style={{textAlign: 'center'}}>
                            <Icon
                                type="plus"
                                style={{ fontSize: '3rem' }}
                            /> 
                            <div>Upload Image</div>
                        </div>
                         :
                            <img style={{ minWidth: '200px', width: '200px', height: '200px' }} src={`https://prime-online-store.herokuapp.com/${ProfilePicture}`} alt={`product-img`} />
                        }


                    </div>
                )}
            </Dropzone>
            <br />
            <br />

        </div>
    )
}

export default FileUpload
