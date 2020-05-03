import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col } from 'antd'
import ProductImage from './sections/productImage'
import ProductInfo from './sections/productInfo'
import {addToCart} from '../../../_actions/user_actions'

function SingleProduct(props) {

    //getting the productId from the link
    const productId = props.match.params.productId
    const [Product, setProduct] = useState([])
    //fetch product from database
    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])

            })
    })
    //console.log(Product)

    //-----------------------------------------------------------------------------------------------------
    const addToCartHandler =(productId) =>{

    }
    return (
        <div classname="postPage" style={{ width: '100%', padding: '3em 4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} style={{ padding: '20px' }}>
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} xs={24} style={{ padding: '20px' }}>
                    <ProductInfo
                        addToCart={addToCartHandler}
                        detail={Product}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default SingleProduct
