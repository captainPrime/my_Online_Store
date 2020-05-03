import React, { useState } from 'react'
import { Radio, Collapse } from 'antd'
import { price, categories } from './datas'
const { Panel } = Collapse

function PriceFilter(props) {

    const [Value, setValue] = useState('1')

    const handleChange = (event) => {
        setValue(event.target.value)
        //console.log(Value)

        //updating the values into our parent component using props
        props.handleFilters(event.target.value)
    }
    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel style={{ textAlign: 'left' }} header="Price" key='1'>
                    {
                        price.map((name, index) => (

                            <Radio.Group
                                onChange={handleChange}
                                value={Value}

                            >
                                <Radio key={name.id} value={`${name.id}`}>
                                    {name.name}
                                </Radio>
                            </Radio.Group>

                        ))
                    }

                </Panel>
            </Collapse>
        </div>
    )
}

export default PriceFilter
