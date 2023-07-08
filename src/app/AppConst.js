const listCategories = [
    // {
    //     label: 'Tin tức',
    //     value: 'NEWS'
    // },
    {
        label: 'Hoạt động',
        value: 'TRAINING'
    },
]

export default Object.freeze({
    LIST_CATEGORIES: listCategories
})
export const appConst = {
    KEY: {
        ENTER: "Enter"
    },
    CODE : {
        SUCCESS : 200,
    },
    ROWS_PER_PAGE_OPTIONS: {
        POPUP: [5, 10, 20, 30],
        TABLE: [10, 25, 50, 75, 100],
    },
    isNumberFloat : ["e", "E", "+", "-"],
    isNumberInt : ["e", "E", "+", "-", "."]
}
