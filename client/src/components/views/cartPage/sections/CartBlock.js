import React, { useState } from 'react'
import { Button, Icon } from 'antd'
import { LeftOutline, RightOutline } from '@ant-design/icons'
function CartBlock(props) {


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove From Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        //products = props.user.cartDetails from cartPage.js
                        props.products && props.products.map(item => (
                            <tr key={item._id}>
                                <td>
                                    <img style={{ width: '70px' }} alt="product" src={`http://localhost:5000/${item.images[0]}`} />
                                </td>
                                <td>
                                    <div>
                                        <div style={{ marginTop: '10px' }}>{item.quantity}</div>
                                        <div style={{ marginLeft: '30%', marginTop: '-28px' }} >
                                            <Icon type='caret-left' style={{ fontSize: 30 }} onClick={() => props.Decrease(item._id)} />
                                            <Icon type='caret-right' style={{ fontSize: 30 }} onClick={() => props.Increase(item._id)} />
                                        </div>
                                    </div>

                                </td>
                                <td>{item.price}</td>

                                <td>
                                    <Button
                                        type="danger"
                                        onClick={() => props.removeItem(item._id)}
                                    >remove
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CartBlock
 
////////////////////////////////////////////////////////TEST///////////////////////////////////////////////////////////
/* 
import React, { useState, useEffect } from 'react'
import { Button, Icon } from 'antd'
import { LeftOutline, RightOutline } from '@ant-design/icons'
import Axios from 'axios'
function CartBlock(props) {

    const [thisValue, setvalue] = useState()

    const renderQuantity = (productId, productQuantity, quantityvalue) => {
        if (props.id === productId) {
            return props.ItemQuantity
        }
        else {
            return (productQuantity)
             
        }
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove From Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        //products = props.user.cartDetails from cartPage.js
                        props.products && props.products.map(item => (
                            <tr key={item._id}>
                                <td>
                                    <img style={{ width: '70px' }} alt="product" src={`http://localhost:5000/${item.images[0]}`} />
                                </td>
                                <td>
                                    <div>
                                        <div style={{ marginTop: '10px' }}>{renderQuantity(item._id, item.quantity)}</div>
                                        <div style={{ marginLeft: '30%', marginTop: '-28px' }} >
                                            <Icon type='caret-left' style={{ fontSize: 30 }} onClick={() => props.Decrease(item._id)} />
                                            <Icon type='caret-right' style={{ fontSize: 30 }} onClick={() => props.Increase(item._id)} />
                                        </div>
                                    </div>

                                </td>
                                <td>{item.price}</td>

                                <td>
                                    <Button
                                        type="danger"
                                        onClick={() => props.removeItem(item._id)}
                                    >remove
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CartBlock
 */