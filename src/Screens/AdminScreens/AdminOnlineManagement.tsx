import React, { useState } from 'react'
import Navbar from './AdminComponents/Navbar'

const AdminOnlineManagement:React.FC = () => {

  const [loading,setLoading] = useState<boolean>(false);
  const [classLink,setClassLink] = useState<string>("");


  const uploadClassLink = () =>{
    setLoading(true);
    setTimeout(() => {
      
    }, 1000);
    setLoading(false)
  }
  return (
    <div className="grid grid-cols-3">
      <div className="sm:hidden max-sm:col-span-3 sm:col-span-2 ">
        <Navbar name='Online Class Management'/>
      </div>


      <div className="max-sm:col-span-3 col-span-1 m-4 h-fit bg-slate-200 dark:bg-slate-700 dark:text-white rounded-md p-4 flex flex-col items-start">
        <h1>Online class link:</h1>

        <div className='w-full px-4 my-2 py-2 rounded-md bg-blue-600 flex justify-center'>
          Your Subject 
        </div>

        <div className='w-full mb-4'>
            <label htmlFor="minutes" className="max-w-xs block mb-2 text-sm font-medium text-gray-200">Enter Link</label>
            <input
                id="minutes"
                type="text"
                value={classLink}
                onChange={(event)=>{setClassLink(event.target.value)}}
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
        </div>

        <div className="flex justify-center items-center h-full" id="mark_atten">
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
