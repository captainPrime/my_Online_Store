import React, { useState } from 'react'
import { Checkbox, Collapse } from 'antd'
import { price, categories } from './datas'
const { Panel } = Collapse


function Filter(props) {

    const [checked, setChecked] = useState([])
    const handleToggle = (name) => {

        const currentIndex = checked.indexOf(name)
        const newChecked = [...checked]

        //check the state Of CHECKED if a value is absent(-1) push it to array
        if (currentIndex === -1) {
            newChecked.push(name)
        }
        else {
            //else remove from array if clicked and the name was avalaible in the array before
            newChecked.splice(currentIndex, 1)
        }
        //update state
        setChecked(newChecked)
        //updating the values into our parent component using props
        props.handleFilters(newChecked)
        //console.log(newChecked)
    }
    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel style={{ textAlign: 'left' }} header="Categories" key='1'>
                    {categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <Checkbox
                                onChange={() => handleToggle(category.id)}
                                checked={checked.indexOf(category.id) === -1 ? false : true}
                                type="checkbox"

                            >
                                <span>{category.value}</span>
                            </Checkbox>
                        </React.Fragment>
                    ))}
                </Panel>
            </Collapse>
        </div>
    )
}

export default Filter
