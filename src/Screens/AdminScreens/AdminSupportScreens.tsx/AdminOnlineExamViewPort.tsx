import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../AdminComponents/Navbar';
import DisplayOnlineExamMarks from '../AdminComponents/DisplayOnlineExamMarks';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase_config';
import { UserModel } from '../../../Models/UserModel';
import NotificationModal from '../AdminComponents/NotificationModal';

interface AdminOnlineExamViewPortProps{
    examDetails:ExamDetails;
    regStu:regStuByCourse;
}
interface NotificationModel{
  heading:string;
  body:string;
}

const AdminOnlineExamViewPort:React.FC = () => { 
    const location = useLocation();
    const { examDetails , regStu } = location.state as AdminOnlineExamViewPortProps;
    const [loading,setLoading] = useState<boolean>(false);
    const [unattemptedStudents,setUnattemptedStudents] = useState<string[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [selectedIndex,setSelectdIndex] = useState<number>(0);
    const [notification,setNotification] = useState<NotificationModel>({
      heading:"",
      body:"",
    });
    const [isOpen,setIsOpen] = useState<boolean>(false);


    const open = () =>{
      setIsOpen(true);
    }

    const close = () =>{
      setIsOpen(false);
    }

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


    const handleFilter1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterQuery(event.target.value);
    };
  
    const filteredStudents1 = unattemptedStudents.filter(student =>
      student.toLowerCase().includes(filterQuery.toLowerCase())
    );






    
  return (
    <div className='grid grid-cols-1 grid-rows-10 w-full h-screen sm:p-6'>
      <div className='col-span-1 row-span-1'>
        <Navbar name='Online Exam'/>
      </div>
      <div className='col-span-1 row-span-1 max-sm:row-span-2 max-sm:flex-col flex justify-start max-sm:px-3'>
        <div className='flex max-sm:mt-3'>
          <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{setSelectdIndex(0)}}>Attempted</button>
          <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{setSelectdIndex(1)}}>Unattempted</button>
        </div>
        
        <div>
        <form className="w-80 max-sm:mt-6 " >   
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" onChange={selectedIndex===0 ? handleFilterChange:handleFilter1Change} value={filterQuery} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Student Name, Id..." required />
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
                        <h2 className='max-sm:text-xs' >Student Details</h2>
                      </div>
                      <div className='flex flex-col items-start col-span-1'>
                        <p className='max-sm:text-xs' >Evaluated</p>
                      </div>
                      <div className='flex flex-col items-end col-span-1'>
                        <p className='max-sm:text-xs' >Marks Obtained</p>
                      </div>
                      <div className='flex flex-col items-end col-span-1'>
                        <p className='max-sm:text-xs' >No of Pages</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p className='max-sm:text-xs' >Action</p>
                      </div>
                    </div>
                  ):(
                    <div className='w-full border-b-2 grid grid-cols-6 pb-4 px-3'>
                      <div className='flex flex-col items-start col-span-2'>
                        <h2  className='max-sm:text-xs' >Student Details</h2>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p className='max-sm:text-xs'>Answered correctly</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p className='max-sm:text-xs'>Answered Incorrectly</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p className='max-sm:text-xs'>Not Answered</p>
                      </div>
                      <div className='flex flex-col items-center col-span-1'>
                        <p className='max-sm:text-xs'>Marks Obtained</p>
                      </div>
                    </div>
                  )
                }

                {
                  filteredStudents.map((obj,index)=>(
                    <DisplayOnlineExamMarks stuMarks={obj} key={index} QpId={examDetails.id} noOfQuestions={examDetails.noOfQuestions} course={examDetails.course}/>
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
                  filteredStudents1.map((obj)=>(
                      <ExemptComponent examDetails={examDetails} studentId={obj} OpenFunction={open} setNotification={setNotification}/>
                  ))
                }
                </>
              )
            }
          </div>
        )
      }
      <NotificationModal isOpen={isOpen} body={notification.body} heading={notification.heading} type="none" onClose={close}/>
    </div>
  )
}

interface ExemptComponentProps{
  examDetails:ExamDetails;
  studentId:string
  OpenFunction: ()=>void;
  setNotification: React.Dispatch<React.SetStateAction<NotificationModel>>;
  CloseFunction?: ()=>void;
}


const ExemptComponent:React.FC<ExemptComponentProps> = ({examDetails,studentId,OpenFunction,setNotification})=>{

  const [setting,setSetting] = useState<boolean>(false);


  const exempt = async () => {
    setSetting(true);
    try {
      const docRef = doc(db, "Question-Paper", examDetails.id);
  
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const studentDocRef = doc(db, "students", studentId);
        const studentDocSnap = await getDoc(studentDocRef);
        const studentData = studentDocSnap.data() as UserModel;
        const courseIndex = studentData.registeredCourses.findIndex(course => course.courseName === examDetails.course);

        if (courseIndex === -1) {
          console.log("No such course found in the registered courses!");
          setNotification({heading:"Error",body:"No such course found in the registered courses!"});
          OpenFunction();
          setSetting(false);

        }

        studentData.registeredCourses[courseIndex] = {...studentData.registeredCourses[courseIndex],onlineExamExempt:true};
        await updateDoc(studentDocRef, { registeredCourses: studentData.registeredCourses });
        console.log("Course onlineExamExempt updated successfully!");
        setNotification({heading:"Success",body:"Course onlineExamExempt updated successfully!"});
        OpenFunction();
        setSetting(false);
        
        
      } else {
        console.log("No such document!");
        setNotification({heading:"Error",body:"Question paper is not active!"});
        OpenFunction();
        setSetting(false);

      }
    } catch (error) {
      console.error("Error getting document:", error);
      setNotification({heading:"Error",body:"Something went wrong!"});
      OpenFunction();
      setSetting(false);

    }
  };

  return (
    <>
      <div className='w-full border-b-2 flex justify-between items-center' >
        <div className='flex flex-col items-start'>
          <h2>{studentId}</h2>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <button onClick={exempt} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            {
              setting?
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              :"Exempt"
            }</button>
        </div>
      </div>
    </>
  )
}

export default AdminOnlineExamViewPort
