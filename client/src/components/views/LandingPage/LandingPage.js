import React, { useEffect, useState } from 'react'
import Axios from "axios";
import Filter from './Sections/filter'
import PriceFilter from './Sections/price_filter'
import ImageSlider from '../../utils/ImageSlider'
import { price, categories } from './Sections/datas'
import SearchComponent from './Sections/search_filter'
import {
    Button,
    Icon,
    Row,
    Col,
    Card,
    Steps,
    Typography
} from 'antd'

import { LoadingOutline } from '@ant-design/icons'

const { Meta } = Card
const { Step } = Steps
const { Text } = Typography

function LandingPage() {

    const [Products, setProducts] = useState([])
    //setting the amount of product to show on the landing page
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [postEnd, setPostEnd] = useState(0)
    const [loading, setloading] = useState(true)
    const [Filters, setFilters] = useState({
        categories: [],
        price: []
    })
    const [searchTerms, setSearchTerms] = useState('')

    //loader function
    const loader = () => {
        {
            setTimeout(() => {
                setloading(false)
            }, 2000
            )
        }
    }

    useEffect(() => {
        const variable = {
            //initial Skip of 0 
            skip: Skip,
            limit: Limit
        }

        getProduct(variable)

    }, [])
    //fetching all the added products from the backend
    const getProduct = (variable) => {
        Axios.post('/api/product/getProduct', variable)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.Allproducts)
                    setPostEnd(response.data.postLength)
                    //setProducts([...Products, response.data.Allproducts])
                    //console.log(response.data.Allproducts)
                }
                else {
                    alert('failed to fetch added products')
                }

            })
    }


    //get the remaining data after the first eight
    const onLoadMore = () => {
        let limit = Limit + Limit;
        setLimit(limit)
        const variable = {
            //skip of 8
            skip: Skip,
            limit: limit
        }
        getProduct(variable)
    }

    //render the products 
    const renderProduct = Products.map((product, index) => {
        return <Col lg={6} md={8} sm={12} xs={24}>
            <Card
                loading={loading}
                hoverable={true}
                
                //clicking the image would direct us to its singular form using its id
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}

            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}

                >

                </Meta>
            </Card>
        </Col>
    })

    const ShowFilteredResult = (filters) => {
        //we have to call the getProduct again

        const variable = {
            //skip of 8
            skip: Skip,
            limit: Limit,
            filters: filters
        }
        getProduct(variable)


    }
    const updateSearchTerms = (newSearchItem) => {

        //console.log(searchTerms)
        const variable = {
            //skip of 8
            skip: Skip,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchItem
        }
        setSearchTerms(newSearchItem)
        getProduct(variable)
    }

    //------------------------------------------------------------------------
    //this function helps to save the filter value in this parent function
    //and also to determine the if its filtetred by category or by price
    const handleFiltersFunction = (filters, category) => {

        //Filters is a state above
        const newFilter = { ...Filters }

        //meaning newFilter[categories] = [1,3,5,2,7] --dummy
        newFilter[category] = filters

        if (category === 'price') {
            //remember filters value of the selected radio button according to ID
            let pricevalue = handlePrice(filters)
            //price value = [200, 50000] --dummy ... i.e it is the price range
            newFilter[category] = pricevalue
        }

        //console.log(newFilter) = (categories: (1) [wears] ,price: (2) [250, 279]) --dummy
        ShowFilteredResult(newFilter)
        setFilters(newFilter)
    }

    //handle price function to filter by price
    //the aim is to get the price range of the product
    const handlePrice = (value) => {
        //data equals to the price array from (data.js)
        //value is a prameter representing filters in handleFilterFunction
        const data = price
        let array = []

        for (let key in data) {
            //console.log('key', key)
            //where key = number of values in array 1-4
            if (data[key].id === parseInt(value, 10)) {
                array = data[key].array
            }
        }
        //console.log(array)
        return array;

    }


    //-----------------------------------------------------------------------------------

    return (

        <div style={{ width: '75%', margin: '3em auto' }}>
            {loader()}

            <div style={{ textAlign: 'center' }}>
                <h2>Available Products <Icon type="rocket" /></h2>
            </div>
            <br />
            {/* filter */}
            {/* placing it in a row to make it have a flex direction */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    <Filter handleFilters={filters => handleFiltersFunction(filters, "categories")} />

                </Col>

                <Col lg={12} xs={24}>
                    <PriceFilter handleFilters={filters => handleFiltersFunction(filters, "price")} />
                </Col>
            </Row>

            {/* search */}

            <Row gutter={[16, 16]}>
                <Col lg={6} xs={24} style={{ float: 'right' }}>
                    <SearchComponent refreshFunction={updateSearchTerms} />
                </Col>
            </Row>

            <br />
            {Products.length === 0 ?
                <div style={{ dispaly: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No Product yet...</h2>
                </div> :
                <div>
                    {/* this is to make the page responsive */}
                    <Row gutter={[16, 16]}>
                        {renderProduct}
                    </Row>
                </div>
            }
            <br /><br />
            {postEnd >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={onLoadMore}>Load More</Button>
                </div>
            }
        </div>


    )
}

export default LandingPage
