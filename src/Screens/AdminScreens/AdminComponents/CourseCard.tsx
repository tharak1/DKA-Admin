import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { CourseModel } from '../../../Models/CourceModel';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { deleteCourse } from '../../../redux/CourcesSlice';
import { useNavigate } from 'react-router-dom';
;

interface CourseCardProps {
    courseDetails: CourseModel;
    showActions?: boolean;
}



const CourseCard: React.FC<CourseCardProps> = ({ courseDetails, showActions = false }) => {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const courseDelete = async()=>{
        await dispatch(deleteCourse(courseDetails.id!));
    }

    
    let imageUrl: string;

    if (typeof courseDetails.image === 'string') {
        // If it's a string, use it directly as the URL
        imageUrl = courseDetails.image;
    } else {
        // If it's a File, create an object URL for it
        imageUrl = courseDetails.image!;

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
                        <button className="sm:m-4 max-sm:mb-12 ml-6 sm:mt-0 p-3 bg-slate-300 hover:bg-slate-200 rounded-full dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500" onClick={courseDelete}><DeleteForeverIcon fontSize='large' /></button>
                        <button className="sm:m-4 max-sm:mb-12 ml-6 p-3  bg-slate-300 hover:bg-slate-200 rounded-full dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500" onClick={()=>{navigate(`/admin/add_courses?type=edit&Id=${courseDetails.id}`)}}><EditIcon fontSize='large' /></button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseCard;



{/* <h2 className="text-2xl font-bold">{courseDetails.courseName}</h2>
<p className="text-gray-700 dark:text-white mt-2 w-full overflow-auto ">{courseDetails.description}</p>
<p className="mt-4"><strong>Classes availability :</strong>{courseDetails.offline && courseDetails.online ? "Online & Offline" : courseDetails.online ? "Online" : courseDetails.offline ? "Offline" : "online & offlline"}</p>
<p className="mt-1"><strong>Class Timings :</strong> {courseDetails.sessions?.length! > 0 ? courseDetails.sessions?.map((session) => (<span>{session} &nbsp;</span>)) : "session 1 : 7am - 8am"}</p> */}