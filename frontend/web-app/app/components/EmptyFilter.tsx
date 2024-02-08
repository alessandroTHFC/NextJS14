import React from 'react'
import Heading from './Heading'
import { useParamsStore } from '@/hooks/useParamsStore'
import { Button } from 'flowbite-react'

type Props = {
    title?: string
    subtitle?: string
    showReset: boolean
}

export default function EmptyFilter({
    title = 'No Matches For This Filter',
    subtitle = 'Try Changing or Resetting the Filter',
    showReset
    }: Props) {

    const reset = useParamsStore(state => state.reset);
  return (
    <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
        <Heading center={true} title={title} subtitle={subtitle}/>
        <div className='mt-2'>
          {showReset && (
            <Button outline onClick={reset}>
              Remove Filters
            </Button>
          )}
        </div>
    </div>
  )
}
