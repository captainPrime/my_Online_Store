import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import Axios from 'axios'
import './styles/style.css';

function FileUpload(props) {
    //React dropZone documantation
    //this creates a box to upload files
    // state for images
    const [Images, setImages] = useState([])

    //---------------------------------------------------
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        //save the image inside the node server
        Axios.post('/api/product/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...Images, response.data.image])

                    props.refreshFunction([...Images, response.data.image])
                }
                else {
                    alert('Failed to save Add Image')
                }
                console.log(response.data.image)

                console.log("yeah")

            })

            .catch(err => console.log(err))
    }
    //----------------------------------------------------------

    // this would go to the array of the state Images and search fro 
    // the index of the current image and delete it
    const onDelete = (image) => {
        const currentImageIndex = Images.indexOf(image)
        let newImages = [...Images]
        // deleting the current image from the Images Array
        newImages.splice(currentImageIndex, 1)

        setImages(newImages)
        // Updatating the Parent component
        props.refreshFunction(newImages)
    }

    console.log(Images)
    return (
        <div style={{ display: "flex", justifyContent: 'space-between' }}>
            <Dropzone style={{ width: '100%' }} className="dropzone"
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
            >

                {({ getRootProps, getInputProps }) => (
                    <div style={{
                        width: '300px', height: '240px', border: '1px solid lightgrey', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                        {...getRootProps()}
                    >
                        <input{...getInputProps()} />
                        <Icon
                            type="plus"
                            style={{ fontSize: '3rem' }}
                        />
                    </div>
                )}
            </Dropzone>
            <br />
            <br />

            <div className="image-space" style={{ display: 'flex', width: '300px', height: '240px', overflowX: 'scroll' }} >

                {/* the images are stored in the IMAGES state ARRAY, so we map them to populate the page */}
                {Images.map((image, index) => (
                    <div onClick={() => onDelete(image)}>
                        <img style={{ minWidth: '300px', width: '300px', height: '220px' }} src={`http://localhost:5000/${image}`} alt={`product-img${index}`} />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default FileUpload
