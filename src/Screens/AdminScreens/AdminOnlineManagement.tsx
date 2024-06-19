import React, { useState } from 'react'
import Navbar from './AdminComponents/Navbar'
import { useSelector } from 'react-redux';
import { GetUser } from '../../redux/UserSlice';
import { EmployeeModel } from '../../Models/EmployeeModel';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase_config';

const AdminOnlineManagement:React.FC = () => {

  const [loading,setLoading] = useState<boolean>(false);
  const [classLink,setClassLink] = useState<string>("");
  const user = useSelector(GetUser) as EmployeeModel;
  const [selectedCourse, setSelectedCourse] = useState("");
  
  const uploadClassLink = async() =>{
    setLoading(true);
    if (selectedCourse) {
      const courseSnapshot = await getDoc(doc(db, 'onlineClass', selectedCourse));

      if (courseSnapshot.exists()) {
        await setDoc(doc(db, 'onlineClass', selectedCourse), { courseName: selectedCourse, classLink: classLink });
      } else {
        await setDoc(doc(db, 'onlineClass', selectedCourse), { courseName: selectedCourse, classLink: classLink });
      }
    }

    setLoading(false)
  }
  return (
    <div className="grid grid-cols-3 grid-rows-10 p-6 h-screen">
      <div className="col-span-3 ">
        <Navbar name='Online Class Management'/>
      </div>

      <div className='col-span-1 p-5 bg-white row-span-4 dark:bg-slate-700 rounded-lg'>
      <form className="max-w-sm mx-auto ">
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Your course</label>
        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={selectedCourse}
        onChange={(e)=>{setSelectedCourse(e.target.value)}}
        >
          <option selected>Choose a course</option>
          {
            user.coursesTaught.map((obj,index)=>(
            <option value={obj} key={index}>{obj}</option>
            ))
          }
        </select>
      </form>
      

        <div className='w-full mb-4'>
            <label htmlFor="minutes" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 mt-5">Enter Link</label>
            <input
                id="minutes"
                type="text"
                value={classLink}
                onChange={(event)=>{setClassLink(event.target.value)}}
                className=" bg-gray-50  dark:bg-gray-700 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>

        <div className="flex justify-center items-center" id="mark_atten">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={uploadClassLink}
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        
      </div>

    </div>
  
  )
}

export default AdminOnlineManagement
