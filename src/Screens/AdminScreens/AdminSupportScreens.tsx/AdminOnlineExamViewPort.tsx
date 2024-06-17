import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../AdminComponents/Navbar';

interface AdminOnlineExamViewPortProps{
    examDetails:ExamDetails;
    regStu:regStuByCourse;
}

const AdminOnlineExamViewPort:React.FC = () => {
    const location = useLocation();
    const { examDetails , regStu } = location.state as AdminOnlineExamViewPortProps;
    console.log( examDetails , regStu);
    const [loading,setLoading] = useState<boolean>(false);
    const [unattemptedStudents,setUnattemptedStudents] = useState<string[]>([]);

    useEffect(()=>{
        setLoading(true);
        let studentIds2: string[] = examDetails.students.map(student => student.studentId);
        let result: string[] = regStu.students.filter(studentId => !studentIds2.includes(studentId));
        setUnattemptedStudents(result);
        setLoading(false);
    },[])

    
  return (
    <div className='grid grid-cols-1 grid-rows-10 bg-slate-200 dark:bg-slate-900 w-full h-screen p-6'>
      <div className='col-span-1 row-span-1'>
        <Navbar name='Online Exam'/>
      </div>
      <div className='col-span-1 row-span-1 flex justify-start'>
        <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Alternative</button>
        <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Alternative</button>
      </div>

      <div className='col-span-1 row-span-8 bg-white dark:bg-slate-700 rounded-lg p-3 w-full h-full overflow-auto'>
        
      </div>

    </div>
  )
}

export default AdminOnlineExamViewPort
