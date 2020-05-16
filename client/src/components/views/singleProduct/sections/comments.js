import React, { useState, useEffect, createElement } from 'react'
import { Input, Button, Descriptions, Row, Col, Form } from 'antd'

import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import { DislikeOutline, LikeOutline, DislikeFill, LikeFill } from '@ant-design/icons';
import Axios from 'axios'

const { TextArea } = Input

function CommentPage(props) {

    const [myComment, setMyComment] = useState('')
    const [Product, setProduct] = useState([])
    const [valueShown, setValue] = useState(5)

    //console.log(props.detail[0])


    useEffect(() => {
        // very important
        if (props.detail.comments) {
            let comment = []; let comment2;
            props.detail.comments.map(item => {
                comment.push(item)
                comment2 = comment.reverse()
            })
            setProduct(comment2)
        }

    }, [props.detail]
    )

    const showMore = (event) => {
        setValue(valueShown + Product.length);
        event.target.className = "hide"
    }

    //console.log(Product)

    const handleChange = (event) => {
        setMyComment(event.target.value)

    }

    const onSubmit = (event) => {
        event.preventDefault()
        props.addComment(myComment, props.detail._id)
        setMyComment('')
    }
    return (
        <div style={{ justifyContent: 'center' }}>
            <Form onSubmit={onSubmit}>
                <TextArea
                    style={{ height: '100px' }}
                    placeholder="Leave a Comment"
                    type="text"
                    value={myComment}
                    onChange={handleChange}
                    required
                />
                <Button onClick={onSubmit}>Comment</Button>
            </Form>

            {Product ?
                Product.slice(0, valueShown).map((item) => (
                    <div>
                        <Comment
                            author={item.user}
                            avatar={
                                <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    alt="Han Solo"
                                />
                            }
                            content={
                                <p>
                                    {item.comment}
                                </p>
                            }
                            datetime={
                                <Tooltip title={moment(item.date).fromNow()}>
                                    <span>{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</span>
                                </Tooltip>
                            }
                        />


                    </div>


                )) :
                <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>No Comment on this product</h2>
            }
            {Product && Product.length > 5 ? <Button onClick={showMore}>Show All</Button> : <h1></h1>


            }



        </div>
    )
}


export default CommentPage;

