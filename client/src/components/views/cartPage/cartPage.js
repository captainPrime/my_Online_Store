import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Axios from 'axios'
import { getCartItem, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions'
import { Typography, Result, Empty, message } from 'antd'
import CartBlock from './sections/CartBlock.js'
import Paypal from '../../utils/paypal'
import Paystack from '../../utils/paystack'

//------------NOTE-------------------------
// items can be drawn from the redux state at anywhere
//eg props.user.userData
//eg props.user.cartItems


const { Text } = Typography

function CartPage(props) {

    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [Showtotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    //----------------------------------------------------------
    // CART TOTAL
    const cartTotal = (cartDetail) => {
        let total = 0
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })
        setTotal(total)

        setShowTotal(true)
    }

    //this calculates the total amount of product in the cart
    useEffect(() => {
        if (props.user.cartDetail && props.user.cartDetail.length > 0) {
            cartTotal(props.user.cartDetail)

        }
    })
    //-----------------------------------------------------------------------------------


    //this creates the cartdetails in redux 

    useEffect(() => {
        //userData is gotten from user reducer
        let cartItemProductId = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                //push each of the IDs  of the cart item into an empty array [cartItemProductId]
                //this selects the product Id that are present in the cart
                props.user.userData.cart.forEach(item => {
                    cartItemProductId.push(item.id)
                })
                //console.log(props.user.userData.cart)
                // where props.user.userData.cart === all cart information
                dispatch(getCartItem(cartItemProductId, props.user.userData.cart))

            }
        }

    }, [props.user.userData])



    // ON INCREASE AND DECREASE QAUNTITY OF ITEMS 
    const onIncrease = (itemId) => {
        Axios.get(`/api/users/productById?id=${itemId}&type=increase`)

        window.location.reload(true)

    }

    const onDecrease = (itemId) => {
        Axios.get(`/api/users/productById?id=${itemId}&type=decrease`)

        window.location.reload(true)

    }



    //using redux to remove item
    const deleteFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(() => {
                Axios.get('/api/users/userCartInfo')
                    .then(response => {
                        if (response.data.success) {
                            if (response.data.cartDetail.length <= 0) {
                                setShowTotal(false)
                            }
                            else {
                                cartTotal(response.data.cartDetail)
                            }

                        }
                        else {
                            alert('failed to get cart info')
                        }
                    })
            })
        message.success("Successfully deleted Item")
    }

    //--------------------------PAYAPAL FUNCTIONS---------------------
    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            cartDetail: props.user.cartDetail,
            paymentData: data
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowSuccess(true)
                    setShowTotal(false)
                    message
                        .loading('loading payment', 2.5)
                        .then(() => message.success('Your purchase is successful', 2.5))
                        .then(() => message.info('Check profile page to see payment history', 5));
                }

                else {
                    if (props.user.cartDetail.length > 1) message.error('Failed to but buy products')
                    message.error('Failed to but buy product')
                }
            })
    }
    const transactionError = () => {
        message.error('Transaction Error')
    }
    const transactionCancelled = () => {
        message.error('Transaction Cancelled ')

    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>

            <h2 style={{ textAlign: 'center' }}>My Cart</h2>
            <div>
                <CartBlock
                    products={props.user.cartDetail}
                    removeItem={deleteFromCart}
                    Increase={onIncrease}
                    Decrease={onDecrease}

                //---------TEST-------------------
                /*     ItemQuantity={ItemQuantity}
                    id={ItemId} */
                //---------------------------------
                />
            </div>

            {/* if product is purchased */}

            {Showtotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total amount: ${Total} </h2>
                </div>
                :
                ShowSuccess ?
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    /> :
                    <div style={{
                        width: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <br />
                        <Empty description={false} />
                        <p>No Items In the Cart</p>

                    </div>
            }
            {/* paypal payment button */}

            {Showtotal &&
                <div>
                    <Paypal
                        totalPrice={Total}
                        onSuccess={transactionSuccess}
                        transactionError={transactionError}
                        transactionCancelled={transactionCancelled}

                    />

                    <Paystack
                        totalPrice={Total}
                    />
                </div>
            }

        </div>
    )
}

export default CartPage;
