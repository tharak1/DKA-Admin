import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase_config';
import Navbar from './AdminComponents/Navbar';
import { useNavigate } from 'react-router-dom';
import { GetUser } from '../../redux/UserSlice';
import { EmployeeModel } from '../../Models/EmployeeModel';
import { GetCourses } from '../../redux/CourcesSlice';
import { CourseModel } from '../../Models/CourceModel';

const AdminExamReports:React.FC = () => {
  const [courseName, setCourseName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [examDetailsList, setExamDetailsList] = useState<ExamDetails[]>([]);
  const [regStuCourse,setRegStuCourse] = useState<regStuByCourse>();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const querySnapshot = await getDocs(query(collection(db, "Online-exam-results"),where("course","==",courseName)));
      
      const regStuCourseSnapshot = await getDocs(query(collection(db, "regStuByCourse"),where("courseName","==",courseName)));


      // Extract the document data
      const regStuByCourse = regStuCourseSnapshot.docs.map((doc: any) => ({
        courseName: doc.data().courseName,
        students: doc.data().students
      }));
    
      setRegStuCourse(regStuByCourse[0]);

      const fetchedExamDetails: ExamDetails[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const students: StudentPerformance[] = data.students.map((studentData: any) => {
          if (data.examType === "create question paper") {
            return {
              correctAnswers: studentData.correctAnswers,
              incorrectAnswers: studentData.incorrectAnswers,
              marksObtained: studentData.marksObtained,
              studentId: studentData.studentId,
              studentName: studentData.studentName,
              unanswered: studentData.unanswered
            } as CreateQuestionPaperPerformance;
          } else if (data.examType === "upload question Paper") {
            console.log(studentData);
            
            return {
              evaluated: studentData.evaluated,
              marksObtained: studentData.marksObtained,
              studentId: studentData.studentId,
              studentName: studentData.studentName,
              uploadedPagesUrl: studentData.uploadedPagesUrl
            } as UploadQuestionPaperPerformance;
          }
          return {} as StudentPerformance;
        });

        const examDetails: ExamDetails = {
          id:doc.id,
          course: data.course,
          startDate: data.startDate,
          startTime: data.startTime,
          endDate: data.endDate,
          endTime: data.endTime,
          duration: data.duration,
          totalMarks: data.totalMarks,
          examType: data.examType,
          noOfQuestions: data.noOfQuestions,
          students: students
        };

        fetchedExamDetails.push(examDetails);
      });
      console.log(fetchedExamDetails);

      setExamDetailsList(fetchedExamDetails);
      

    } catch (error) {
      console.error("Error fetching documents: ", error);
      setError(error as string);
     
    } finally {
      setLoading(false);
    }
  };

  const user = useSelector(GetUser) as EmployeeModel;
  const courses = user.isAdmin? useSelector(GetCourses).map((obj:CourseModel)=>obj.courseName!) : user.coursesTaught;





  return (
    <div className='grid grid-cols-2 grid-rows-10 sm:p-6 w-full h-screen'>
      <div className='col-span-2 row-span-1 w-full h-full'>
        <Navbar name='Exam Reports'/>
      </div>
      <div className='row-span-1 col-span-2 w-full h-full max-sm:mt-2 max-sm:p-3'>
        <form className='flex flex-row' onSubmit={handleSubmit}>
          <select
            id='courseName'
            name='courseName'
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:outline-none'
          >
            <option value=''>Select Course</option>
            {courses.map((obj:string) => (
              <option value={obj} key={obj}>
                {obj}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </form>
      </div>

      <div className='col-span-2 row-span-8 w-full h-full overflow-auto rounded-lg bg-white dark:bg-slate-700'>
      {loading ? (
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
          <div>
            <svg
              aria-hidden='true'
              className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
          </div>
        </div>
      ) : examDetailsList.length !== 0 ? (
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto p-3 space-y-5'>
          <div className='w-full grid grid-cols-6 py-5 max-sm:hidden'>
            <div className='col-span-2 flex flex-col justify-start'>
              <div>Question Paper Details</div>
            </div>
            <div className='col-span-2 flex flex-col justify-center items-center'>
              <div>Conducted between</div>
            </div>
            <div className='col-span-1 flex flex-col justify-center items-center'>
              <div>Total marks</div>
            </div>
            <div className='col-span-1 flex flex-col justify-center items-center'>
              <div>Status</div>
            </div>
          </div>
          {examDetailsList.map((obj,index) => (
            <div
              className='w-full grid grid-cols-6 max-sm:grid-cols-1 max-sm:grid-rows-4 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600 hover:cursor-pointer' onClick={()=>{
                navigate('/admin/online_exam_viewport', { state: { examDetails:examDetailsList[index],regStu:regStuCourse } });
              }}
              key={obj.id} 
            >
              <div className='col-span-2 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-start'>
                <h2>ID : {obj.id}</h2>
                <h2>Course : {obj.course}</h2>
                <h2>Duration : {obj.duration} min</h2>
              </div>
              <div className='col-span-2 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center  sm:border-l-2 border-gray-500 dark:border-gray-300 items-center max-sm:items-start'>
                <h2>Start : {new Date(obj.startDate).toLocaleDateString('en-IN')}-{obj.startTime}</h2>
                <h2>End : {new Date(obj.endDate).toLocaleDateString('en-IN')}-{obj.endTime}</h2>
                
              </div>
              <div className='col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-center sm:border-l-2 border-gray-500 dark:border-gray-300 max-sm:items-start'>
                <h2>
                  <span className='text-xl text-gray-600 dark:text-gray-400'>Total Marks : {obj.totalMarks}</span> 
                </h2>
              </div>
              <div className={`col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-start sm:border-l-2  border-gray-500 dark:border-gray-300 sm:px-3 max-sm:items-start`}>
                <h2>
                  <span className='text-md text-gray-600 dark:text-gray-400'>Total Students : </span>{regStuCourse!.students.length}
                </h2>
                <h2>
                  <span className='text-md text-gray-600 dark:text-gray-400'>Attended : </span>{obj.students.length}
                </h2>
                <h2>
                  <span className='text-md text-gray-600 dark:text-gray-400'>Not Atteded : </span>{regStuCourse!.students.length - obj.students.length}
                </h2>
              </div>
            </div>
          ))}
        </div>
      ) :error==="" ?(
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
          <div>
            <h2>No data</h2>
          </div>
        </div>
      ):(
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
          <div>
            <h2>No data</h2>
          </div>
        </div>
      )
    }
      </div>
    </div>
  )
}

export default AdminExamReports
