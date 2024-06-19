import React from 'react'
import { useLocation } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import SideBarForEvaluation from './AdminComponents/SideBarForEvaluation';

interface AdminEvaluationScreenProps{
    stuSubmission:UploadQuestionPaperPerformance;
    QpId:string;
    noOfQuestions:number;
}

const AdminEvaluationScreen:React.FC = () => {
    const location = useLocation();
    const {stuSubmission,QpId,noOfQuestions} = location.state as AdminEvaluationScreenProps;

  return (
    <div className='w-full h-screen grid grid-cols-4 grid-rows-10 ' >
      <div className='col-span-3 row-span-10 overflow-auto h-full w-full flex flex-col space-y-5 justify-center items-center'>
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

      <div className='col-span-1 row-span-10 w-full h-full'>
        <SideBarForEvaluation stuSubmission={stuSubmission} QpId={QpId} noOfQuestions={noOfQuestions}/>
      </div>
    </div>
  )
}

export default AdminEvaluationScreen
