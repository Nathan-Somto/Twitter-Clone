import React from 'react'
import {Filters} from '@/pages/notifications/[userId]';
type Props = {
    selectedOption: Filters;
    handleSelect: (str:Filters) => void;
}

function NotificationsFilter({selectedOption,handleSelect}: Props) {
    const filters:Filters[] = ['All','Verified', 'Mentions'];
  return (
    <div className="flex items-center justify-between mt-4 mx-auto w-full px-[10%] border-b dark:border-b-dark4">
    {filters.map((filter) => (
      <button
        key={filter}
        onClick={() => handleSelect(filter === 'All' ? '' : filter)}
        className={`text-light2 border-b-2 py-3 ${
          selectedOption === filter || (filter === 'All' && selectedOption === '')
            ? "border-b-primaryBlue text-primaryBlue "
            : "border-b-transparent hover:border-b-light2 text-light2"
        } base-bold `}
      >
        {filter}
      </button>
    ))}
  </div>
  )
}

export default NotificationsFilter