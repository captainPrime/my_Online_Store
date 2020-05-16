import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM_USER,
    ON_SUCCESS_BUY_USER
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(_id) {
    const request = axios.post(`${USER_SERVER}/addToCart?productId=${_id}`)
        .then(response => response.data);

    return {
        type: ADD_TO_CART_USER,
        payload: request
    }
}



export function getCartItem(cartItemId, userCart) {
    const request = axios.get(`/api/product/products_by_id?id=${cartItemId}&type=array`)
        .then(response => {

            //make cartDetail inside Redux store
            //we need to add cart qauntity to product information

            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, i) => {
                    //console.log(cartItem.id)
                    if (cartItem.id === productDetail._id) {
                        //console.log(productDetail._id)
                        response.data[i].quantity = cartItem.quantity;

                    }
                })
            })
            //console.log(response.data)
            return response.data
        })
    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

//redux function to remove item from list
export function removeCartItem(productId) {
    const request = axios.get(`/api/users/remove_from_cart?_id=${productId}`)
        .then(response => {
            response.data.cart.forEach(cartItem => {
                response.data.cartDetail.forEach((cartDetailItem, i) => {
                    //if cart id = cartItem id
                    if (cartItem.id === cartDetailItem._id) {
                        response.data.cartDetail[i].quantity = cartItem.quantity
                    }
                })
            })

            return response.data

        })
    return {
        type: REMOVE_CART_ITEM_USER,
        payload: request
    }
}


export function onSuccessBuy(data) {

    const request = axios.post(`${USER_SERVER}/successfulPay`, data)
        .then(response => response.data);

    return {
        type: ON_SUCCESS_BUY_USER,
        payload: request
    }
}