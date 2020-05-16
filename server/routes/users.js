const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Products } = require("../models/product");
const { Payment } = require("../models/payment");
const { auth } = require("../middleware/auth");
const async = require('async')
const multer = require('multer')
const crypto = require('crypto')
require('dotenv').config();
const nodemailer = require('nodemailer')
//=================================
//             User
//=================================
//req.body is from the front end
//req.params is from the title link
//req.user is from the database (the user keyword is gotten from the auth.js (middleware))

router.get("/auth", auth, (req, res) => {
    //this is gotten from the register page
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastName,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
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




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profilePictures')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png file allowed'), false)
        }
        cb(null, true)
    }
})

const upload = multer({ storage }).single("file");

router.post("/uploadImage", auth, (req, res, next) => {
    //after getting image from server
    //save to node server
    upload(req, res, err => {
        if (err) return res.json({ success: false, err })  //console.log(err)
        return res.json({
            success: true,
            image: res.req.file.path,
            fileName: res.req.file.filename
        })
        console.log(image)
        console.log(res.req.file.filename)

    })
});

router.post("/uploadProfile", auth, (req, res) => {

    const image = req.body.profileImage
    console.log(req.user._id)

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                image: req.body.profileImage
            }
        },
        { new: true },
        (err) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true })

        }
    )

    User.findOne({ _id: req.user._id }, (err, UserInfo) => {
        console.log(UserInfo)
    })
});

//this fetches the profile picture
router.get('/getProfilePicture', auth, (req, res) => {
    User.findOne({ '_id': req.user._id }, (err, user) => {
        if (err) return res.status(400).json({
            success: false,
            message: 'failed to fetch product'
        })


        return res.status(200).json({
            success: true,
            profilepicture: user.image
        })

        console.log(profilepicture)
    })


})


//user function to remove item from cart list
router.get('/remove_from_cart', auth, (req, res) => {
    console.log(req.query._id)
    User.findOneAndUpdate(
        //delete product from user cart
        { _id: req.user._id },
        {
            '$pull': {
                //req.query means it is gotten from the params from the user_action
                //req.query = (..?_id=${productId})
                //note (query) not (user)
                'cart': { 'id': req.query._id }
            }
        },

        { new: true },

        (err, userInfo) => {
            let cart = userInfo.cart
            //console.log(cart)
            let array = cart.map(item => {
                return item.id
            })
            //console.log(array)

            Products.find({ '_id': { $in: array } })
                .populate('writer')
                //this would return the cart Item and the item with the id wanting to be deleted(cartDetail)
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                    //console.log(cartDetail)
                })
        }
    )
})

router.get('/productById', auth, (req, res) => {
    let type = req.query.type
    //console.log(req.query.id )
    if (type === 'increase') {

        User.findOneAndUpdate(

            { _id: req.user._id, "cart.id": req.query.id },
            { $inc: { "cart.$.quantity": 1 } },
            //this updates the database
            { new: true },

            (err, userInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true,
                    userInfo
                })
            }
        )
    }

    else {
        User.findOneAndUpdate(

            { _id: req.user._id, "cart.id": req.query.id },
            { $inc: { "cart.$.quantity": -1 } },
            //this updates the database
            { new: true },

            (err, userInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true,
                    userInfo
                })

            }
        )
    }



})

router.get('/userCartInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart
            //console.log(cart)
            let array = cart.map(item => {
                return item.id
            })

            //console.log(array)

            Products.find({ '_id': { $in: array } })
                .populate('writer')
                //this would return the cart Item and the item with the id wanting to be deleted(cartDetail)
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).json({ success: false, err })
                    return res.status(200).json({
                        success: true,
                        cartDetail,
                        cart
                    })
                })
        }
    )
})

router.post('/successfulPay', auth, (req, res) => {
    let history = [];
    let transactionData = {};

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history


    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                // calculate the amount sold
                async.eachSeries(products, (item, callback) => {
                    Products.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})

router.post("/updateProfile", auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                name: req.body.name,
                lastName: req.body.lastName,
                email: req.body.email
            }
        },
        { new: true },
        (err) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true })

        }
    )

});

router.post('/forgotPassword', (req, res) => {
    console.log(req.body.email)
    if (req.body.email === '') {
        res.status(400).send('email required')
    }

    User.findOne(
        { email: req.body.email })
        .then((user) => {
            //console.log(user)
            if (user === null) {
                res.send('email not in database').status(403)
                console.log('not found')
            }
            else {

                const token = crypto.randomBytes(20).toString('hex')
                User.findOneAndUpdate({ email: req.body.email }, { token: token, tokenExp: Date.now() + 360000 }, (err, doc) => {
                    if (err) return res.json({ success: false, err });
                    return res.status(200).send({
                        success: true
                    });
                });



                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${process.env.EMAIL_ADDRESS}`,
                        pass: `${process.env.EMAIL_PASSWORD}`
                    }
                })

                const mailOptions = {
                    from: 'taiwooyindamola732@gmail.com',
                    to: `${user.email}`,
                    subject: 'Reset Email',
                    text:
                        'your reset email'
                        + `http://localhost:5000/reset/${token} \n\n`

                }

                console.log('sending mail')

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.log('there was an error', err)
                    }
                    else {
                        console.log('here is the res', response)
                        res.status(200).json('recovery email sent')

                    }
                })
            }
        })

})

//Removing Profile Image

router.delete('/profilePicture', auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                image: ''
            }
        },
        { new: true },
        (err, user) => {
            if (err) res.status(400).send('error removing profile image')
            res.status(200).json({
                success: true
            })
        }
    )
})

//get history API
router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) res.status(400).send('error removing profile image')
            res.status(200).json({
                success: true,
                history
            })
        }
    )
})
module.exports = router;
