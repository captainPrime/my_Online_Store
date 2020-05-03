import React from 'react'
import { Carousel } from 'antd'

function ImageSlider(props) {
    return (
        <div>

            <Carousel autoplay>
                {props.images.map((image, index) => (

                    < div >
                        <img
                            style={{ width: '100%', height: '150px' }}
                            src={`http://localhost:5000/${image}`}
                            alt='productImage'
                        />
                    </div>

                ))}
            </Carousel>

        </div>
    )
}

export default ImageSlider;
