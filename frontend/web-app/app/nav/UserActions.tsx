'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import { Dropdown } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi'

type Props = {
  user: User
}

// This component is the Dropdown in the Nav Bar that appears only when a user is logged in. 

export default function UserActions({user}: Props) {

  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams)


  // These Functions will put into state the user's username as either seller or winner.
  // They are onClick functions, upon clicking the My Auctions or Auctions Won tab in the Dropdown..
  // They will set the params, which will fire the useEffect in Listings.tsx and call the backend Search Service. 
  // By doing so, it will then add either seller or winner to the params and return either the auctions won by the user
  // Or the Auctions the user currently has in progress. These are also responsible for re-directing the user back to the listings page.

  function setWinner () {
    setParams({winner: user.username, seller: undefined})
    if (pathname !== '/') router.push('/');
  }

  function setSeller () {
    setParams({seller: user.username, winner: undefined})
    if (pathname !== '/') router.push('/');
  }

  return (
    <Dropdown label={`Welcome ${user.name}`} inline>
      <Dropdown.Item icon={HiUser} onClick={setSeller}>
          My Auctions
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy} onClick={setWinner}>
          Auctions Won
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillCar}>
        <Link href='/auctions/create'>
          Sell My Car
        </Link>
      </Dropdown.Item>
      <Dropdown.Item icon={HiCog}>
        <Link href='/session'>
          My Session
        </Link>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
        Log Out
      </Dropdown.Item>
    </Dropdown>
  )
}
