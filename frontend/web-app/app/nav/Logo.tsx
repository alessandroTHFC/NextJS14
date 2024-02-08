'use client'
import { useParamsStore } from '@/hooks/useParamsStore';
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai'

export default function Logo() {
    const reset = useParamsStore(state => state.reset);
  return (
    <div onClick={reset} className='cursor-pointer flex items-center gap-2 text-3xl font-sans font-semibold text-red-500'>
        <AiOutlineCar size={40}/>
        <div >AutoAuctions</div>
    </div>
  )
}
