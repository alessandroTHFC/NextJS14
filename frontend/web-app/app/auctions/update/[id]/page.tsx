import Heading from '@/app/components/Heading'
import React from 'react'
import AuctionForm from '../../AuctionForm'
import { getDetailViewData } from '@/app/actions/AuctionActions'

export default async function Update({params}: {params: {id: string}}) {

  const data = await getDetailViewData(params.id)
  return (
    <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
      <Heading title='Update Your Auction'/>
      <AuctionForm auction={data}/>
    </div>
  )
}
