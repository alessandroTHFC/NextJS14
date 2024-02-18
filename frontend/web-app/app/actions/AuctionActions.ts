'use server'
import { Auction, PagedResult } from "@/Types";
import { getTokenWorkAround } from "./AuthActions";
import { fetchWrapper } from "../lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

export async function getData(query: string): Promise<PagedResult<Auction>>{
    return await fetchWrapper.get(`search${query}`)
}

export async function updateAuctionTest() {

    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }
    
    return await fetchWrapper.put('auctions/7f8794ab-1736-4eb6-8e19-87c9bd42143b', data);

}

export async function createAuction(data: FieldValues) {
    return await fetchWrapper.post('auctions', data)
}

export async function updateAuction(data: FieldValues, id: string) {
    return await fetchWrapper.put(`auctions/${id}`, data)
}

export async function deleteAuction(id: string) {
    return await fetchWrapper.del(`auctions/${id}`)
}

export async function getDetailViewData(id: string): Promise<Auction> {
   const res = await fetchWrapper.get(`auctions/${id}`)
   revalidatePath(`/auctions/${id}`)
   return res
}