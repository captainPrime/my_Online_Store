import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItem } from '../../../_actions/user_actions'

function CartPage(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        //userData is gotten from user reducer
        let cartItemProductId = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItemProductId.push(item.id)
                })
                // where props.user.userData.cart === all cart information
                dispatch(getCartItem(cartItemProductId), props.user.userData.cart)
            }
        }

    })
    return (
        <div>

        </div>
    )
}

export default CartPage;
