import React, { useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { CourseModel } from '../../../Models/CourceModel';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { deleteCourse } from '../../../redux/CourcesSlice';
import { useNavigate } from 'react-router-dom';
import NotificationModal from './NotificationModal';
;

interface CourseCardProps {
    courseDetails: CourseModel;
    showActions?: boolean;
}



const CourseCard: React.FC<CourseCardProps> = ({ courseDetails, showActions = false }) => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [delet, setDelete] = useState<boolean>(false);


    const courseDelete = async()=>{
        close()
        setDelete(true);
        await dispatch(deleteCourse(courseDetails.id!));
        setDelete(false);
    }

    let [isOpen, setIsOpen] = useState(false) 

    function open() {
      setIsOpen(true)
    }
  
    function close() {
      setIsOpen(false)
    }

    return (
        // <div className="flex flex-row w-full">
        //     <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex w-full dark:bg-slate-700 dark:text-white">
        //         <img src={imageUrl} alt="Kuchipudi" className="w-48 h-48 object-cover rounded-lg" />

        //         <div className="ml-6 flex flex-col justify-between dark:text-white w-full">
        //             <div className='dark:text-white w-fit'>
        //                 <h2 className="text-2xl font-bold">{courseDetails.courseName}</h2>

        //                 <div className='w-full'>
        //                     <p className="text-gray-700 dark:text-white mt-2 ">{courseDetails.description}</p>
        //                 </div>
        //                 <p className="mt-4"><strong>Classes availability :</strong>{courseDetails.offline && courseDetails.online ? "Online & Offline" : courseDetails.online ? "Online" : courseDetails.offline ? "Offline" : "online & offlline"}</p>
        //                 <p className="mt-1"><strong>Class Timings :</strong> {courseDetails.sessions?.length! > 0 ? courseDetails.sessions?.map((session,index) => (<span>{`${index+1}) ${session}`} &nbsp;</span>)) : "session 1 : 7am - 8am"}</p>
        //             </div>

        //             <div className="flex justify-between items-center mt-4 w-full">
        //                 <div>
        //                     <p className="text-xl font-bold">Price : <span className="text-green-500">₹ {courseDetails.price} / month</span></p>
        //                 </div>
        //             </div>
        //         </div>


        //     </div>
        <div className="flex flex-row max-sm:flex-col w-full ">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex max-sm:flex-col w-full dark:bg-slate-700 dark:text-white">
  <div className='max-sm:w-full max-sm:flex max-sm:flex-row max-sm:justify-center max-sm:items-center'>
  <img src={courseDetails.image} alt={courseDetails.courseName} loading="lazy" className="w-48 h-48 object-cover rounded-lg" />
  </div>

                <div className="ml-6 max-sm:ml-0 flex flex-col justify-between dark:text-white w-full">
                    <div className='dark:text-white w-fit'>
                        <h2 className="text-2xl font-bold">{courseDetails.courseName}</h2>
                        <div className='w-full'>
                            <p className="text-gray-700 dark:text-white mt-2 ">{courseDetails.description}</p>
                        </div>
                        <p className="mt-4">
                            <strong>Classes availability :</strong> {courseDetails.offline && courseDetails.online ? "Online & Offline" : courseDetails.online ? "Online" : courseDetails.offline ? "Offline" : "Online & Offline"}
                        </p>
                        <p className="mt-1">
                            <strong>Class Timings :</strong> {courseDetails.sessions?.length ? courseDetails.sessions.map((session, index) => (
                                <span key={index}>{session} &nbsp;</span>
                            )) : "Session 1: 7am - 8am"}
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 w-full">
                        <div>
                            <p className="text-xl font-bold">Price : <span className="text-green-500">₹ {courseDetails.price} / month</span></p>
                        </div>
                    </div>
                </div> 
            </div>
        


            {showActions && (
                <div className="flex flex-col sm:items-start max-sm:flex-row">
                    <div className="flex flex-col max-sm:flex-row">
                        <button className="sm:m-4 max-sm:mb-12 ml-6 sm:mt-0 p-3 bg-slate-300 hover:bg-slate-200 rounded-full dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500" onClick={open}>{ delet ?
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            :<DeleteForeverIcon fontSize='large' />}
                        </button>
                        <button className="sm:m-4 max-sm:mb-12 ml-6 p-3  bg-slate-300 hover:bg-slate-200 rounded-full dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500" onClick={()=>{navigate(`/admin/add_courses?type=edit&Id=${courseDetails.id}`)}}><EditIcon fontSize='large' /></button>
                    </div>
                </div>
            )}

            <NotificationModal isOpen={isOpen} onClose={close} heading='Category' body='Do You want to delete category permanently !' type='delete'  ActionFunction={courseDelete}/>
        </div>
    )
}

export default CourseCard;



{/* <h2 className="text-2xl font-bold">{courseDetails.courseName}</h2>
<p className="text-gray-700 dark:text-white mt-2 w-full overflow-auto ">{courseDetails.description}</p>
<p className="mt-4"><strong>Classes availability :</strong>{courseDetails.offline && courseDetails.online ? "Online & Offline" : courseDetails.online ? "Online" : courseDetails.offline ? "Offline" : "online & offlline"}</p>
<p className="mt-1"><strong>Class Timings :</strong> {courseDetails.sessions?.length! > 0 ? courseDetails.sessions?.map((session) => (<span>{session} &nbsp;</span>)) : "session 1 : 7am - 8am"}</p> */}