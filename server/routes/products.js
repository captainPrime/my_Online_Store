const express = require('express');
const router = express.Router();
const multer = require('multer')
const { auth } = require("../middleware/auth");
const { Products } = require('../models/product')

//=================================
//             Products
//=================================
//using multerjs to store the product images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
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
        if (err) /* return res.json({ success: false, err }) */ console.log(err)
        return res.json({
            success: true,
            image: res.req.file.path,
            fileName: res.req.file.filename
        })
    })
});

router.post("/uploadProduct", auth, (req, res, next) => {

    //save all the data from the client into the DB
    // the products are gotten from the client request
    const product = new Products(req.body)

    product.save(err => {
        if (err) return res.status(400).json({
            success: false,
            message: err
        })
        return res.status(200).json({
            success: true,
            data: req.body
        })
    })
});

router.post("/comment", auth, (req, res) => {
    const myComment = req.body.comment
    const productId = req.body.prodId
    const user = req.user.name

    Products.findOne({ _id: productId }, (err, ProductInfo) => {
        console.log(ProductInfo)
        if (myComment.length > 0) {
            Products.findOneAndUpdate(
                { _id: productId },
                {
                    $push: {
                        comments: {
                            user: user,
                            comment: myComment,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, ProductInfo) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json(ProductInfo.comment)
                }
            )
        }
    })
});

router.post('/getProduct', (req, res) => {
    //conditions
    const order = req.body.order ? req.body.order : 'desc'
    const sortBy = req.body.sortBy ? req.body.sortBy : '_id'
    const limit = req.body.limit ? parseInt(req.body.limit) : 100
    const skip = parseInt(req.body.skip)

    //console.log(req.body.filters)
    //{ categories: [ 2, 4, 3 ], price: [] }

    const findArg = {}
    let term = req.body.searchTerm

    console.log(term)
    for (let key in req.body.filters) {
        //console.log(key) //continent and price
        if (req.body.filters[key].length > 0) {

            if (key === 'price') {
                // greateThanEqual = $gte
                // lesserThanEqual = $lte
                findArg[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
                }
            }

            else {
                findArg[key] = req.body.filters[key]
                //(req.body.filters[key]) = [1,2,3,4,5]
                // findArg[key] === ( findArg[continent] = [1,2,3,4,5] )
                //console.log(findArg[key]) = { categories: [ 1,2,3,4,5 ] }
            }
        }
    }

    console.log(findArg)
    //findArg = { categories: [1] } --dummy
    //findArg = { categories: [ 3 ], price: { '$gte': 0, '$lte': 199 } } --dummy

    //find the products from the Products collection
    if (term) {
        Products.find(findArg)
            //$text is initiated in the schema file(product.js)
            .find({ $text: { $search: term } })
            //.find({ title: term })
            .populate('writer')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, Allproducts) => {
                if (err) return res.status(400).json({
                    success: false,
                    message: 'failed to fetch product'
                })

                return res.status(200).json({
                    success: true,
                    Allproducts,
                    postLength: Allproducts.length
                })
            })
    } else {
        Products.find(findArg)
            //these are recognized mongodb commands
            .populate('writer')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            //the products are avalaible already in the database..so you can call it whatever 
            //as the second variable 
            .exec((err, Allproducts) => {
                if (err) return res.status(400).json({
                    success: false,
                    message: 'failed to fetch product'
                })

                return res.status(200).json({
                    success: true,
                    Allproducts,
                    postLength: Allproducts.length
                })
            })
    }
})

//get single Product from databse
//?id=${productId}&type=single
router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productId = req.query.id

    //console.log(productIds)

    if (type === 'array') {

    }

    //we need to find the product info belonging to product id
    Products.find({ '_id': { $in: productId } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});

module.exports = router;