'use server'
import { Auction, PagedResult } from "@/Types";
import { getTokenWorkAround } from "./AuthActions";

export async function getData(query: string): Promise<PagedResult<Auction>>{
    const res = await fetch(`http://localhost:6001/search${query}`);

    if (!res.ok) throw new Error('failed to fetch data');
    return res.json();
}

export async function UpdateAuctionTest() {

    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }

    const token = await getTokenWorkAround()

    const res = await fetch('http://localhost:6001/auctions/7f8794ab-1736-4eb6-8e19-87c9bd42143b', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token?.access_token,
        },
        body: JSON.stringify(data)

    })

    if (!res.ok) return {status: res.status, message: res.statusText}

    return res.statusText;

}