import React, { useEffect, useState } from 'react'

const usePagination = (defaultPerPage = 12) => {    
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(+defaultPerPage)
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [totalPages, setTotalPages] = useState(0);
    const [pagesArray, setPagesArray] = useState([])

    useEffect(() => {
        setTotalPages(Math.ceil(totalDocuments/perPage));        
    }, [totalDocuments])

    useEffect(()=>{
        let arr = []
        for(let i = 1; i <= totalPages; i++){
            arr.push(i)
        }
        setPagesArray(arr)
    }, [totalPages])

    const setPage = (val) => {
        if(pagesArray.includes(val)){
            setCurrentPage(val)
        }
    }

  return {
    page : currentPage, 
    perPage,
    setPage,
    setTotalDocuments,
    totalPages,
    setPerPage,
    pagesArray,
    totalDocuments
  }
}

export default usePagination;