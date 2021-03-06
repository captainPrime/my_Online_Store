import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Button, Descriptions, message } from 'antd'

function ProductInfo(props) {

    const [Product, setProduct] = useState([])


    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail]
    )

    const addToCartHandler =() =>{
        //onclick, we want to send the details of the product to the parent component (singleProduct.js)
        props.addToCart(props.detail._id)
        message.success("product added to cart")
    }
    return (
        <div>
            <Descriptions title="Product Info">
                <Descriptions.Item label="Price">{`$${Product.price}`}</Descriptions.Item>
                <Descriptions.Item label="Sold">{Product.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{Product.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{Product.description}</Descriptions.Item>
            </Descriptions>
            <br />
            <br />
            <br />


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="primary" 
                onClick={addToCartHandler}
                >
                    Add to Cart
                </Button>
            </div>

        </div>
    )
}

export default ProductInfo
