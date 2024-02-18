'use client'
import { Button, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/AuctionActions';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Auction } from '@/Types';

type Props = {
    auction?: Auction
}

export default function AuctionForm({auction}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const {control, 
        reset,
        handleSubmit, 
        setFocus, 
        formState: {isSubmitting, isValid, isDirty, errors}} = useForm({
            mode: 'onTouched'
        });
    
    useEffect(() =>{
        if (auction) {
            const {make, model, color, mileage, year} = auction
            reset({make, model, color, mileage, year})
        }
        setFocus('make')
    },[setFocus])

    async function onSubmit (data: FieldValues) {
        try {
            let id = '';
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data)
                id = res.id
            } else {
                if (auction) {
                    res = await updateAuction(data, auction.id)
                    id = auction.id;
                }
            }
            if (res.error) {
                throw res.error
            }
            router.push(`/auctions/details/${id}`)
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message) as string
        }
    }
  return (
    <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>

        <Input label='Make' name='make' control={control} rules={{required: 'Make is Required'}}/>
        <Input label='Model' name='model' control={control} rules={{required: 'Model is Required'}}/>
        <Input label='Colour' name='color' control={control} rules={{required: 'Colour is Required'}}/>
        <div className='grid grid-cols-2 gap-3'>
            <Input label='Year' name='year' control={control} type='number' rules={{required: 'Year is Required'}}/>
            <Input label='Mileage' name='mileage' control={control} type='number' rules={{required: 'Mileage is Required'}}/>
        </div>
        
        {pathname === '/auctions/create' && 
        <>
            <Input label='Image URL' name='imageUrl' control={control} rules={{required: 'Image Url is Required'}}/>
            <div className='grid grid-cols-2 gap-3'>
                <Input label='Reserve Price (Enter 0 If No Reserve)' name='reservePrice' control={control} type='number' rules={{required: 'Reserve Price is Required'}}/>
                <DateInput label='Auction End Date' name='auctionEnd' control={control} dateFormat='dd MMMM yyyy h:mm a' showTimeSelect rules={{required: 'Auction End Date is Required'}} />
            </div> 
        </>}
        

        <div className='flex justify-between'>
            <Button outline className='border-red-700 text-red' color='gray'>Cancel</Button>
            <Button 
            type='submit'
            isProcessing={isSubmitting} 
            disabled={!isValid}
            color='success'
            >
                Submit
            </Button>
        </div>
    </form>
  )
}
