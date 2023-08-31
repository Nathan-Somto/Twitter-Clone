import React from 'react'
import FilterBox from '../FilterBox'
import SuggestionBox from '../SuggestionBox'
import SearchBar from '@/components/form/SearchBar'
import {useRouter} from 'next/router';
type Props = {}

function Widgets({}: Props) {
  const router = useRouter();
  const isSearchPage = router.pathname.includes('search');
  const isHomePage = router.pathname === '/home'
  
  return (
    <div className=" hidden space-y-8 px-[10px] min-w-[310px] py-4 lg:flex flex-col h-screen overflow-auto">
       {!isSearchPage && (
         <SearchBar isSearchPage={false}/>
       ) 
        }
        {isHomePage && (
          <FilterBox/>
        )
        }
        <SuggestionBox/>
    </div>
  )
}

export default Widgets