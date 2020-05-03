import React, { useState } from 'react'
import { Input } from 'antd'
const { Search } = Input

function SearchComponent(props) {

    const [searchItem, setSearchItem] = useState('')

    const onSearchChange = (event) => {
        setSearchItem(event.target.value)
        props.refreshFunction(event.target.value)
    }
    return (
        <div>
            <Search
                placeholder="Search"
                value={searchItem}
                onChange={onSearchChange}
            />
        </div>
    )
}

export default SearchComponent
