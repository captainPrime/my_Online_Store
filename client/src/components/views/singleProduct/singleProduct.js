import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col } from 'antd'
import ProductImage from './sections/productImage'
import ProductInfo from './sections/productInfo'
import { addToCart } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'
import CommentPage from './sections/comments'



function SingleProduct(props) {

    const dispatch = useDispatch()

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
    const addToCartHandler = (productId) => {
        dispatch(addToCart(productId))
    }

    const handleComment = (comment, prodId) => {
        let variable = { comment, prodId }
        Axios.post(`/api/product/comment`, variable)
    }
    return (
        <div className="postPage" style={{ width: '100%', padding: '3em 4rem' }}>
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

            <CommentPage
                addComment={(comment, prodId) => handleComment(comment, prodId)}
                detail={Product}

            />
        </div>
    )
}

export default SingleProduct
