import { getDetailViewData } from '@/app/actions/AuctionActions'
import Heading from '@/app/components/Heading'
import React from 'react'
import CountdownTimer from '../../CountdownTimer'
import CarImage from '../../CarImage'
import DetailedSpecs from './DetailSpecs'
import { getCurrentUser } from '@/app/actions/AuthActions'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'

export default async function Details({params}: {params: {id: string}}) {
  
  const data = await getDetailViewData(params.id)
  const user = await getCurrentUser();

  return (
    <div>
      <div className='flex justify-between'>
        <Heading title={`${data.make} ${data.model}`}  />
        <div className='flex gap-3'>
          <h3 className='text-2xl font-semibold'>Time Remaining:</h3>
          <CountdownTimer auctionEnd={data.auctionEnd}/>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6 mt-3'>
        {/* Car Image Section */}
        <div className='w-full bg-yellow-200 aspect-h-8 aspect-w-16 rounded-lg overflow-hidden'>
          <CarImage imageUrl={data.imageUrl} />
        </div>
        {/* Text Area */}
        <div className='border-2 rounded-lg p-2 bg-gray-200'>
          <Heading title='Bids' />
        </div>
      </div>

      <div className='mt-3 grid grid-cols-1 rounded-lg'>
        <DetailedSpecs auction={data}/>
      </div>
      {user?.username === data.seller && (
        <div className='mt-5 mb-5 grid grid-cols-3'>
          <div className='flex justify-between'>
            <EditButton id={data.id} />
            <DeleteButton id={data.id} />
          </div>
        </div>
        )}
    </div>
  )
}
