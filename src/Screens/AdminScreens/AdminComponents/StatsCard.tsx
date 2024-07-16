import React from 'react'

interface StatsCardProps{
    name:string;
    count:number;
}

const StatsCard:React.FC<StatsCardProps> = ({name,count}) => {
  return (
    <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-800 col-span-1 sm:col-span-2 sm:row-span-2 max-sm:row-span-1">
        <div className="px-4 py-5 sm:p-6">
            <dl>
                <dt className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">{name}</dt>
                <dd className="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">{count}</dd>
            </dl>
        </div>
    </div>
  )
}

export default StatsCard
