import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../AdminComponents/Navbar';
import DisplayOnlineExamMarks from '../AdminComponents/DisplayOnlineExamMarks';

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
    const [filterQuery, setFilterQuery] = useState<string>('');

    const [selectedIndex,setSelectdIndex] = useState<number>(0);

    useEffect(()=>{
        setLoading(true);
        let studentIds2: string[] = examDetails.students.map(student => student.studentId);
        let result: string[] = regStu.students.filter(studentId => !studentIds2.includes(studentId));
        setUnattemptedStudents(result);
        setLoading(false);
    },[])
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterQuery(event.target.value);
    };
  
    const filteredStudents = examDetails.students.filter(student =>
      student.studentName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(filterQuery.toLowerCase())
    );



    
  return (
    <div className='grid grid-cols-1 grid-rows-10 bg-slate-200 dark:bg-slate-900 w-full h-screen p-6'>
      <div className='col-span-1 row-span-1'>
        <Navbar name='Online Exam'/>
      </div>
      <div className='col-span-1 row-span-1 flex justify-start'>
        <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{setSelectdIndex(0)}}>Attempted</button>
        <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{setSelectdIndex(1)}}>Unattempted</button>
        
        <div>
        <form className="w-80 " >   
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" onChange={handleFilterChange} value={filterQuery} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Student Name, Id..." required />
            </div>
        </form>
        </div>

      </div>

      {   
        selectedIndex === 0?(        
          <div className='col-span-1 row-span-8 bg-white dark:bg-slate-700 rounded-lg p-3 w-full h-full overflow-auto dark:text-white'>
            {
              loading?(
                <div className='w-full h-full flex justify-center items-center'>
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              ):(
                <>

                {
                  examDetails.examType === 'upload question Paper'?(
                    <div className='w-full border-b-2 grid grid-cols-6 pb-4 px-3'>
                      <div className='flex flex-col items-start col-span-2'>
                        <h2>Student Details</h2>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Evaluated</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Marks Obtained</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>No of Pages</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Action</p>
                      </div>
                    </div>
                  ):(
                    <div className='w-full border-b-2 grid grid-cols-6 pb-4 px-3'>
                      <div className='flex flex-col items-start col-span-2'>
                        <h2>Student Details</h2>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Answered correctly</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Answered Incorrectly</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Not Answered</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p>Marks Obtained</p>
                      </div>
                    </div>
                  )
                }

                {
                  filteredStudents.map((obj,index)=>(
                    <DisplayOnlineExamMarks stuMarks={obj} key={index} QpId={examDetails.id} noOfQuestions={examDetails.noOfQuestions}/>
                  ))
                }
                </>
              )
            }
          </div>
        ):(
          <div className='col-span-1 row-span-8 bg-white dark:bg-slate-700 rounded-lg p-3 w-full h-full overflow-auto'>
            {
              loading?(
                <div className='w-full h-full flex justify-center items-center'>
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                </div>
              ):(
                <>
                <div className='w-full border-b-2 flex justify-between items-center'>
                  <div className='flex flex-col items-start'>
                    <h2>Student Id</h2>
                  </div>
                  <div className='flex flex-col items-center'>
                    <p>Action</p>
                  </div>
                </div>
                {
                  unattemptedStudents.map((obj,index)=>(
                    <div className='w-full border-b-2 flex justify-between items-center' key={index}>
                      <div className='flex flex-col items-start'>
                        <h2>{obj}</h2>
                      </div>
                      <div className='flex flex-col items-center'>
                        <p>Action</p>
                      </div>
                    </div>
                  ))
                }
                </>
              )
            }
          </div>
        )
      }

    </div>
  )
}

export default AdminOnlineExamViewPort
