import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { MdOutlineMenuOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import SideBarForEvaluation from '../AdminComponents/SideBarForEvaluation';

interface AdminEvaluationScreenProps{
    stuSubmission:UploadQuestionPaperPerformance;
    QpId:string;
    noOfQuestions:number;
    course:string;
}

const AdminEvaluationScreen:React.FC = () => {
    const [drawer, setDrawer] = useState<boolean>(false);
    const location = useLocation();
    const {stuSubmission,QpId,noOfQuestions,course} = location.state as AdminEvaluationScreenProps;

  return (
    <div className='w-full h-screen grid grid-cols-4 grid-rows-10 ' >
      <div className='relative col-span-3 max-sm:col-span-4 row-span-10 overflow-auto h-full w-full flex flex-col space-y-5 justify-center items-center'>
        {
            stuSubmission.uploadedPagesUrl.map((image,index)=>(
                <div className='w-1/2 flex flex-col'>
                <Zoom key={index}>
                    
                        <img src={image} alt={`uploadedImage - ${index}`} />
                </Zoom>
                </div>

            ))
        }

      </div>

      <div className='col-span-1 max-sm:hidden row-span-10 w-full h-full'>
        <SideBarForEvaluation stuSubmission={stuSubmission} QpId={QpId} noOfQuestions={noOfQuestions} course={course}/>
      </div>

      <div className= {`${drawer?"sm:hidden":"max-sm:hidden sm:hidden"} z-10  max-sm:w-full max-sm:h-screen max-sm:flex col-span-4 row-span-8 justify-end bg-white`} style={{ backgroundColor: 'rgba(255, 255, 255, 255 )' }}>
        <div className='w-full h-full bg-white  dark:bg-slate-700'>
          <SideBarForEvaluation stuSubmission={stuSubmission} QpId={QpId} noOfQuestions={noOfQuestions} course={course}/>
        </div>
      </div>
      <div className={`sm:hidden absolute ${drawer?"top-5 left-5 z-20":"top-5 right-5 "} `}>
          <button type="button" onClick={()=>{setDrawer(!drawer)}} className={`text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}>{drawer?<IoMdClose size={28}/>:<MdOutlineMenuOpen size={28}/>}</button>
        </div>
    </div>
  )
}

export default AdminEvaluationScreen
