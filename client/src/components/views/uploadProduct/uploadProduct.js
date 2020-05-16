import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon, Popconfirm } from 'antd'
import FileUpload from '../../utils/fileUpload'
import Axios from '../../../../node_modules/axios';

const { Title } = Typography
const { TextArea } = Input
const categories = [
    { key: 1, value: "Phones" },
    { key: 2, value: "Accessories" },
    { key: 3, value: "Wears" },
    { key: 4, value: "Bags" },
    { key: 5, value: "Shoes" },
    { key: 6, value: "laptops" },
    { key: 7, value: "Baby wears" }
]

function UploadProduct(props) {

    const [titleValue, setTitleValue] = useState("")
    const [descriptionValue, setDescriptionValue] = useState("")
    const [priceValue, setPriceValue] = useState(0)
    const [categoryValue, setCategoryValue] = useState(1)
    // Managing the product image information
    const [Images, setImages] = useState([])

    //changing value of input----------------------------------------------
    const productTitle = (event) => {
        setTitleValue(event.currentTarget.value)
    }
    const descriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const priceChange = (event) => {
        setPriceValue(event.currentTarget.value)
    }

    const categorySelect = (event) => {
        setCategoryValue(event.currentTarget.value)
    }

    //----------------------------------------------------------------------
    const updateImages = (newImage) => {
        setImages(newImage)
    }

    //-----------------------------------------------------------------------
    //saving the inputed data onSubmit
    const onSubmit = (event) => {
        event.preventDefault()

        if (!titleValue || !descriptionValue || !priceValue || !Images) {
            message.error("please fill up all field")
        }
        else {
            // these are the request body
            const variables = {
                //this can be found in the redux extension
                writer: props.user.userData._id,
                //---------------------------------------------------------------
                title: titleValue,
                description: descriptionValue,
                price: priceValue,
                images: Images,
                categories: categoryValue
            }

            // sending the data to the backend
            Axios.post('/api/product/uploadProduct', variables)
                .then(response => {
                    if (response.data.success) {
                        console.log(response.data)
                        message.success('Product successfully uploaded');
                        props.history.push('/');
                    }
                    else {
                        message.error('Failed to Save Product')
                    }
                })
        }
    }

    //-------------------------------------------------------------------------------
    return (
        <div style={{ maxWidth: '700px', margin: '2em auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2em' }}>
                <Title level={2}> Upload Product</Title>
            </div>

            <Form onSubmit={onSubmit}>
                {/* Dropzone */}
                <FileUpload required refreshFunction={updateImages} />

                <br />
                <br />
                <label htmlFor="title">Name of Product</label>
                <Input required onChange={productTitle} value={titleValue} />
                <br />
                <br />

                <label htmlFor="title">Description</label>
                <TextArea required onChange={descriptionChange} value={descriptionValue} />
                <br />
                <br />

                <label htmlFor="title">Price(#)</label>
                <Input required onChange={priceChange} value={priceValue} type="number" />
                <br />
                <br />

                {/* populating a select tag */}
                <select required onChange={categorySelect}>
                    {categories.map(item => (
                        <option key={item.key} value={item.key}>
                            {item.value}
                        </option>
                    ))}

                </select>
            </Form>
            <br />
            {/* create onSubmit function for Button */}
            <Button onClick={onSubmit}>
                Upload Product
            </Button>
        </div >
    )
}

export default UploadProduct
