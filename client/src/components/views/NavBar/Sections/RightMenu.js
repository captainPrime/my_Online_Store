/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Menu, Icon, Badge, Avatar } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import Axios from 'axios'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const [ProfilePicture, setProfilePicture] = useState()
  const [CartBadge, setCartBadge] = useState(0)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };


  useEffect(() => {
    Axios.get('/api/users/getProfilePicture')
      .then(response => {
        if (response.data.success) {
          setProfilePicture(response.data.profilepicture)
        }

      })
  })

  useEffect(() => {
    Axios.get('/api/users/userCartInfo')
      .then(response => {
        if (response.data.success) {
          setCartBadge(response.data.cart.length)
        }

      })
  })

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/">Home</a>
        </Menu.Item>
        <SubMenu title={<span>Blogs</span>}>
          <MenuItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key="mail2">
          <a href="/login">Signin</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/product/upload"><Icon type="upload" style={{ fontSize: '28px' }}></Icon></a>
        </Menu.Item>

        <Menu.Item key="mail">
          <a href="/">Home</a>
        </Menu.Item>
        <SubMenu title={<span>Blogs</span>}>
          <MenuItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>


        <Menu.Item key="cart" >
          <Badge count={CartBadge} style={{ marginTop: '10px' }}>
            <a href="/user/cart" style={{ marginRigth: -22, color: '#667777' }}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 4, marginTop: '10px' }} />
            </a>
          </Badge>
        </Menu.Item>




        <SubMenu title={<span>
          <a href="/profile">
            <Avatar
            
              src={ProfilePicture === '' ?
              `https://prime-online-store.herokuapp.com/uploads/profilePictures/1589640704206_Profile_avatar_placeholder_large.PNG`
                :
                `https://prime-online-store.herokuapp.com/${ProfilePicture}` 
              }
              alt="Han Solo"
            />
          </a>
        </span>}>
          <Menu.Item style={{ textAlign: 'center' }} key="logout">
            <a onClick={logoutHandler}>logout</a>
          </Menu.Item>


        </SubMenu>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

