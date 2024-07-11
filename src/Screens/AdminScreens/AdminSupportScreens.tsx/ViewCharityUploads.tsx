import React, { useEffect, useState } from 'react'
import Navbar from '../AdminComponents/Navbar'

import CharityUploadModal from '../AdminComponents/AddCharityUploadModal';
import { CharityUploadModel } from '../../../Models/CharityModel';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase_config';

const ViewCharityUploads:React.FC = () => {

    const [charityUpload,setCharityUpload] = useState<CharityUploadModel[]>([]);
    const [loading,setLoading] = useState<boolean>(false);


    useEffect(()=>{
        getCharityUploads();
    },[]);

    const getCharityUploads = async()=>{
        setLoading(true);
        const querySnapshot = await getDocs(collection(db,"charityUpload"));
        const reviews: CharityUploadModel[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CharityUploadModel[];
        setCharityUpload(reviews);
        setLoading(false);
    }

  return (
    <div className="p-6 h-screen overflow-auto w-full items-start">
        <div className='w-full'>
            <Navbar name='Manage Categories'/>
        </div>
        <div className='mt-4 flex items-start'>
          <CharityUploadModal type='create'/>
        </div>

        {/* <div className='grid-span-3 w-full grid grid-cols-3 gap-3 mt-4'>
          {
            charityUpload.map((obj:CharityUploadModel)=>(              
              <CategoryCard CategorryData={obj} key={obj.id}/>
            ))
          }
        </div> */}

    </div>
  )
}

export default ViewCharityUploads
