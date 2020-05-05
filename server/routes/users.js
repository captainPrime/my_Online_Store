const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================
//req.body is from the front end
//req.params is from the title link
//req.user is from the database (the user keyword is gotten from the auth.js (middleware))

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastName,
        role: req.user.role,
        image: req.user.image
    });
});



router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post('/getProfile', auth, (req, res) => {
    User.findOne({ email: req.user.email })
        .exec((err, user) => {
            if (err) return res.status(400).json({
                success: false,
                message: 'failed to fetch user'
            })

            return res.status(200).json({
                success: true,
                user: [user]
            })
        })

})

router.post('/addToCart', auth, (req, res) => {
    //first of all find the user
    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        // this is to know if a product already exist
        let duplicate = false;
        //console.log(userInfo.email)

        userInfo.cart.forEach((item) => {
            if (item.id === req.query.productId) {
                duplicate = true
            }
        });
        //---------------------------------------------------------------------------------
        if (duplicate) {
            //these are mongodb syntax
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                //this updates the database
                { new: true },

                () => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json(userInfo.cart)
                }
            )
        }
        //------------------------------------------------------------------------------------
        else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                //push a cart attribute and give it a quantity of 1
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
})

module.exports = router;
