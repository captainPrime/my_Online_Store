const price = [
    {
        id: 1,
        name: 'Any',
        array: []
    },

    {
        id: 2,
        name: '$0 to $199',
        array: [0, 199]
    },
    {
        id: 3,
        name: '$250 to $279',
        array: [250, 279]
    },
    {
        id: 4,
        name: '$280 to $299',
        array: [280, 299]
    },
    {
        id: 5,
        name: 'More than $300',
        array: [300, 15000000]
    },
]

const categories = [
    { id: 1, value: "Phones" },
    { id: 2, value: "Accessories" },
    { id: 3, value: "Wears" },
    { id: 4, value: "Bags" },
    { id: 5, value: "Shoes" },
    { id: 6, value: "laptops" },
    { id: 7, value: "Baby wears" }
]

export {
    price, categories
}