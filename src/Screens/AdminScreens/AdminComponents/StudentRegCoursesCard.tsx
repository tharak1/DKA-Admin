import React, { useState } from 'react'
import { MyCourseModal, UserModel } from '../../../Models/UserModel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { arrayRemove, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase_config';
import useAddExtraDays from '../../../hooks/AddExtraDaysHook';


interface StudentRegCoursesCardProps{
    regCourse: MyCourseModal;
    index: number
    studentData: UserModel;
    setStudentData: React.Dispatch<React.SetStateAction<UserModel>>;
    getPerformances: (student: UserModel) => Promise<void>;
    refreshStudentData:() => void;
}

const StudentRegCoursesCard:React.FC<StudentRegCoursesCardProps> = ({regCourse, studentData, setStudentData, getPerformances,refreshStudentData, index}) => {
  const [removing, setRemoving] = useState<boolean>(false);

  const { addExtraDays, loading, error } = useAddExtraDays();

    const update = async(studentId: string, courseId: string,index:number) =>{
        await addExtraDays(studentId, courseId)
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        studentData.registeredCourses[index].endDate = currentDate.toISOString().split('T')[0];
        refreshStudentData();
    }

  const handleRemoveCourse = async (courseId: string) => {
    setRemoving(true);

    const newStudent = {
      ...studentData,
      registeredCourses: studentData.registeredCourses.filter((obj) => obj.courseId !== courseId)
    };

    await setDoc(doc(db, "students", studentData?.id!), { ...newStudent });

    const docSnap = await getDoc(doc(db, 'performances', courseId));
    const data = docSnap.data();
    const studentDatas = data?.students || [];


    const studentDataToRemove = studentDatas.find((stu: any) => stu.studentId === studentData.id);

    await updateDoc(doc(db, 'performances', courseId), {
      students: arrayRemove(studentDataToRemove)
    });

    await updateDoc(doc(db, "regStuByCourse", courseId), { studentDatas: arrayRemove(studentData.id) });

    setStudentData(newStudent);
    getPerformances(newStudent);
    setRemoving(false);
  }

  

  return (
    <div
    className='flex justify-between py-3 px-4 w-full bg-slate-100 dark:bg-slate-500 rounded-md my-1.5'
  >
    <div>
      <div>
        <p>
          <span className='text-gray-700 text-xs'>Paid for:</span>{' '}
          <span className='max-sm:text-xs max-sm:font-semibold'>{regCourse.courseName}</span>{' '}
        </p>
        <p>
          <span className='text-gray-700 text-xs'>Paid on:</span>{' '}
          <span className='max-sm:text-xs max-sm:font-semibold'>{regCourse.boughtDate}</span>{' '}
        </p>
      </div>
      <div>
        <p>
          <span className='text-gray-700 text-xs'>Payment Id:</span>{' '}
          <span className='max-sm:text-xs mr-3 max-sm:font-semibold'>{regCourse.paymentId}</span>{' '}
        </p>
        <p>
          <span className='text-gray-700 text-xs'>Status:</span>{' '}
          <span className='max-sm:text-xs max-sm:font-semibold'>{regCourse.status}</span>{' '}
        </p>
      </div>
    </div>
    <div className='flex flex-col items-end justify-between'>
      <p>
        <span className='text-gray-700 text-xs'>Ends on :</span>{' '}
        <span className='max-sm:text-xs max-sm:font-semibold'>{regCourse.endDate}</span>{' '}
      </p>
      <div className='flex justify-end items-center w-full '>

        { 
        
        new Date(regCourse.endDate) < new Date() &&
          <button 
              type="button" 
              className=" focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 dark:focus:ring-blue-900" 
              onClick={() => { update(studentData.id, regCourse.courseId,index) }}
          >
              
              {loading ? 
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>:"Add 3 Days"
              }
              {error && <p>Error: {error}</p>}
          </button>
        }

        <button
          type='button'
          className='ml-2 focus:outline-none text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 dark:focus:ring-yellow-900'
          onClick={() => { handleRemoveCourse(regCourse.courseId) }}
        >
          {removing ? (
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) : (
            <DeleteForeverIcon fontSize='medium' />
          )}
        </button>



      </div>

    </div>
  </div>
  )
}

export default StudentRegCoursesCard
