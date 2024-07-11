import React from 'react'
import CharityModel from '../../../Models/CharityModel'

interface CharityDisplayCardProps{
    charityObj:CharityModel;
}

const CharityDisplayCard:React.FC<CharityDisplayCardProps> = ({charityObj}) => {
  return (
    <div>
          <div
    className='w-full grid grid-cols-6 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600'
  >
    <div className='col-span-2 flex flex-col justify-start'>
        <div>
            {charityObj.name}
        </div>
        <div>
            {charityObj.cause}
        </div>
        <div>
            {charityObj.date}
        </div>
    </div>
    <div className='col-span-2 flex flex-col justify-center border-l-2 items-center'>
        {charityObj.description}
    </div>
    <div className='col-span-1 flex flex-col justify-center items-center border-l-2'>
        {charityObj.amount}
    </div>
    <div className={`col-span-1 flex flex-col justify-center items-center border-l-2`}>
        <img src={charityObj.photoUrl} alt='max-h-full object-fit' className='h-40 w-30 rounded-md object-fill' />
    </div>
  </div>
    </div>
  )
}

export default CharityDisplayCard
