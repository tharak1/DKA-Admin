import React, { useEffect } from 'react'
import Navbar from './AdminComponents/Navbar'
import ExamDraftCard from './AdminComponents/ExamDraftCard';
import AddExamModal from './AdminComponents/AddExamModal';
import { useSelector } from 'react-redux';
import { GetQP, GetTempQP, fetchQuestionPapers } from '../../redux/QuestionPaperSlice';
import { QuestionPaper } from '../../Models/ExamModel';
import { useAppDispatch } from '../../redux/PersistanceStorage';

const AdminManageQuestionPaper:React.FC = () => {
    const draftQP = useSelector(GetTempQP);
    const Qp = useSelector(GetQP);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(fetchQuestionPapers());
    },[])
    

  return (
    <div className='bg-slate-200 h-full overflow-auto dark:bg-slate-900 p-6'>
        <Navbar name='Manage Question Paper'/>


        <div className='col-span-1 mt-4 mb-5 flex flex-row'>
            <AddExamModal/>
        </div>
        <h1 className='dark:text-white mb-4'>Drafted Question Papers</h1>
        <div className='w-full grid grid-cols-4 items-start gap-3'>
            {
                draftQP.length===0?(
                    <div className='w-full h-full flex justify-center items-center text-center rounded-lg p-10 bg-white'>
                        <h2>No Draft question Papers</h2>
                    </div>
                ):(        
                    draftQP.slice().reverse().map((obj:QuestionPaper)=>(
                        <ExamDraftCard QP={obj} key={obj.id}/>
                    ))     
                )
            }
        </div>


        <h1 className=' my-4'>Uploaded Question Papers</h1>
        <div className='w-full grid grid-cols-4 items-start gap-3'>
            {
                Qp.length===0?(
                    <div className='w-full h-full flex justify-center items-center text-center rounded-lg p-10 bg-white'>
                        <h2>No Draft question Papers</h2>
                    </div>
                ):(   
                    Qp.slice().reverse().map((obj:QuestionPaper)=>(
                        <ExamDraftCard QP={obj} key={obj.id}/>
                    ))
                )
            }
        </div>

        <div className='w-full grid grid-cols-4 items-start gap-3'>




        </div>

        

    

    </div>
  )
}

export default AdminManageQuestionPaper
