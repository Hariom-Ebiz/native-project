export const TableSortingArrows = ({currentSort, checkKey}) => {    
    return <svg width="15" cursor={"pointer"} height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.45 6.71997L6.72998 3L3.01001 6.71997" stroke={currentSort.sortBy == checkKey && currentSort.order == "asc" ? "#3699FF" : "#C8EAFF"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.72998 21V3" stroke={currentSort.sortBy == checkKey && currentSort.order == "asc" ? "#3699FF" : "#C8EAFF"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.55 17.28L17.2701 21L20.9901 17.28" stroke={currentSort.sortBy == checkKey && currentSort.order == "desc" ? "#3699FF" : "#C8EAFF"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17.27 3V21" stroke={currentSort.sortBy == checkKey && currentSort.order == "desc" ? "#3699FF" : "#C8EAFF"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
}