'use client'
import { useParamsStore } from '@/hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Search() {
const setParams = useParamsStore(state => state.setParams);
const setSearchValue = useParamsStore(state => state.setSearchValue);
const searchValue = useParamsStore(state => state.searchValue);
const router = useRouter();
const pathname = usePathname();
function onChange(e: any) {
    if (pathname !== '/') router.push('/');
    setSearchValue(e.target.value);
}
// When this function is called it will update the searchTerm in our Params
// This is in the store, upon this changing the value URL in the listings will change to contain the updated params
// The use Effect will then come into action as it is dependant on URL causing the page to re-render
function search() {
    setParams({searchTerm: searchValue})
}
  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-md'>
        <input
            onKeyDown={(e:any) => {
                if(e.key === 'Enter') search();
            }}
            value={searchValue}
            type="text" 
            onChange={onChange}
            placeholder='Search for Cars by Make, Model or Colour'
            className='flex-grow 
            rounded-full pl-5 bg-transparent 
            focus:outline-none border-transparent
            focus:border-transparent focus:ring-0
            text-sm text-gray-400 font-normal placeholder:opacity-65'
        />
        <button onClick={search}>
            <FaSearch size={34} className='bg-red-400 text-white rounded-full cursor-pointer py-2 px-1 mx-2'/>
        </button>
    </div>
  )
}
