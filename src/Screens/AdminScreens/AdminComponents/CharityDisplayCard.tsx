import React, { useState } from 'react'
import { CharityModel } from '../../../Models/CharityModel';
import { deleteDoc, doc } from 'firebase/firestore';
import { databaseStorage, db } from '../../../firebase_config';
import { deleteObject, ref } from 'firebase/storage';


interface CharityDisplayCardProps{
    charityObj:CharityModel;
    onDelete: (deletedReviewId: string) => void;
}

const CharityDisplayCard:React.FC<CharityDisplayCardProps> = ({charityObj,onDelete}) => {


  const deleteImage = async(imgString:string) => {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";
    const filePath = decodeURIComponent(imgString.split(baseUrl)[1].split("?")[0]);
    const desertRef = ref(databaseStorage, filePath);
    console.log(filePath);
    
    await deleteObject(desertRef);
  }


  const[deleting ,setDeleting] = useState<boolean>(false);
  const deleteReview = async() => {
      setDeleting(true);
      await deleteImage(charityObj.photoUrl);
      await deleteDoc(doc(db,"Charity",charityObj.id));
      setDeleting(false);
      onDelete(charityObj.id);
  }
  return (
    <div>
          <div
    className='w-full grid grid-cols-6 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600'
  >
    <div className='col-span-1 max-sm:col-span-3 flex flex-col justify-start'>
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
    <div className={`col-span-1 flex flex-col justify-center items-center border-l-2 max-sm:hidden`}>
        <img src={charityObj.photoUrl} alt='max-h-full object-fit' className='h-40 w-30 rounded-md object-fill' />
    </div>
    <div className={`col-span-1 flex flex-col justify-center items-center border-l-2`}>
      <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 max-sm:px-2 max-sm:py-1 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={deleteReview}>
            {
                deleting?(
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                ):(
                    "Delete"
                )
            }
        </button>
    </div>

  </div>
    </div>
  )
}

export default CharityDisplayCard
