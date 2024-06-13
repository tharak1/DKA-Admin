import React from 'react'
import { QuestionPaper } from '../../../Models/ExamModel'
import { useAppDispatch } from '../../../redux/PersistanceStorage'
import { deleteTempQuestionPaperById, editFetchedPaper } from '../../../redux/QuestionPaperSlice'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface ExamDraftCardProps{
    QP:QuestionPaper
}

const ExamDraftCard:React.FC<ExamDraftCardProps> = ({QP}) => {
    const naviate = useNavigate();
    const dispatch = useAppDispatch();
    console.log(QP);
    

    const deleteQP = () =>{
        dispatch(deleteTempQuestionPaperById(QP))
    }

    const openEdit = () =>{
        if(QP.uploaded === true && (QP.editing === false || QP.editing == null)){
            dispatch(editFetchedPaper(QP));
        }
        else{
            naviate(`/admin/create_question_paper?type=edit&id=${QP.id}`)
        }
    }
  return (
    <div className='relative'>
        <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <h5 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">{QP.course}</h5>
                <p>Date: {QP.startDate}</p>
                <p>Time: {QP.startTime} (IST)</p>
                <p>Total marks : {QP.totalMarks}</p>
                <p>Published for : {QP.for}</p>
                <p className='text-red-300'>{QP.examType}</p>
            
            <div className='flex flex-row justify-between'> 
                <button className="inline-flex  items-center mt-2 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={openEdit}>
                    Edit 
                    <div className='ml-2'>
                        <EditIcon/>
                    </div>
                </button>
                <button className="inline-flex items-center mt-2 px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={deleteQP} >
                    Delete
                    <DeleteIcon/>

                </button>

            </div>
        </div>

        {
            QP.uploaded && QP.editing?(
                <button className='absolute top-2 right-2 py-2 px-2 bg-green-300 rounded-lg 'disabled={true}>
                </button>
            ):(
                <span></span>
            )
        }

    </div>
  )
}

export default ExamDraftCard
