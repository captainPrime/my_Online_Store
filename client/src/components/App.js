import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadProduct from "./views/uploadProduct/uploadProduct"
import ProfilePage from './views/ProfilePage/profile'
import SingleProduct from './views/singleProduct/singleProduct'
import CartPage from './views/cartPage/cartPage'
import ResetUser from './views/reset_user/resetUser'

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)} >
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          {/* only admin can get to this page */}
          <Route exact path="/product/upload" component={Auth(UploadProduct, true)} />
          <Route exact path="/profile" component={Auth(ProfilePage, true)} />
          <Route exact path="/product/:productId" component={Auth(SingleProduct, true)} />
          <Route exact path="/user/cart/" component={Auth(CartPage, true)} />
          <Route exact path="/reset_user" component={Auth(ResetUser, false)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
