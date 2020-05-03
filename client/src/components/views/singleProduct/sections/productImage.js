import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {

    const [Images, setimages] = useState([])

    useEffect(() => {
        // getting the images from the Product in singleProduct.js using props
        //if we have more than one images
        if (props.detail.images && props.detail.images.length > 0) {
            let images = []

            /* props.detail.images &&  */props.detail.images.map(item => {
                // this is from the (react-image-gallery) module
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })

            setimages(images)
        }
        //we use the use effect here because we only want to trigger the useeffec
        //if only product.detail is present
    }, [props.detail])

    //-------------------------------------------------------------------------------
    /* useEffect(() => {
        if (props.detail && props.detail.length > 0) {
            let images = []
              props.detail.map(item => {                
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setimages(images)
        }
    }, [props.detail]) */
    //-----------------------------------------------------------------------------------

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
