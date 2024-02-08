'use client'
import React, { useEffect, useState } from 'react'
import AuctionCards from './AuctionCards';
import AppPagination from '../components/AppPagination';
import { getData } from '../actions/AuctionActions';
import { Auction, PagedResult } from '@/Types';
import Filters from './Filters';
import { useParamsStore } from '@/hooks/useParamsStore';
import { shallow } from 'zustand/shallow';
import queryString from 'query-string';
import EmptyFilter from '../components/EmptyFilter';

export default function Listings() {
  //Below is set up if using Local State
  // const [auctions, setAuctions] = useState<Auction[]>([])
  // const [pageCount, setPageCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [pageSize, setPageSize] = useState(12);

  // Here we will use State Management using Zustand
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useParamsStore(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy
  }), shallow)

  const setParams = useParamsStore(state => state.setParams);
  const url = queryString.stringifyUrl({url: '', query: params})

  function setPageNumber(pageNumber: number) {
    setParams({pageNumber})
  }

  //This use effect will only come into effect when the url changes
  //i.e when we change a page number
  useEffect(() => {
    getData(url)
    .then(data => {
      setData(data);
    })
  }, [url])
  
  if (!data) return <h3>Loading...</h3>

  return (
    <>
    <Filters />
    {data.totalCount === 0 ? (
      <EmptyFilter showReset />
    ) : (
      <>
      <div className='grid grid-cols-4 gap-6'>
        {data.results.map(auction => (
          <AuctionCards auction={auction} key={auction.id}/>
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} />
      </div>
      </>
    )}
    </>
  )
}
