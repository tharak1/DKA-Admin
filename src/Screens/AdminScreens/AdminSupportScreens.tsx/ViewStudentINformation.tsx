import React, { useEffect, useState } from 'react';
import { UserModel } from '../../../Models/UserModel';
import { useLocation, useNavigate } from 'react-router-dom';
import { arrayRemove, doc, DocumentData, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase_config';
import Navbar from '../AdminComponents/Navbar';

interface Student {
  studentData: UserModel;
}

const ViewStudentDataInformation: React.FC = () => {
  const location = useLocation();
  const { studentData } = location.state as Student;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [performanceLoading, setPerformanceLoading] = useState<boolean>(false);
  const [performances, setPerformances] = useState<any[]>([]);

  useEffect(() => {
    if (studentData) {
      getPerformances(studentData);
    }
  }, [studentData]);

  const goToDetail = () => {
    console.log('====================================');
    console.log(studentData);
    console.log('====================================');
    navigate('/admin/detailPerformance', { state: { student: studentData, performances } });
  };

  const handleRemoveCourse = async (courseId: string) => {
    setRemoving(true);
    setLoading(true);

    const newStudent = {
      ...studentData,
      registeredCourses: studentData.registeredCourses.filter((obj) => obj.courseId !== courseId)
    };

    await setDoc(doc(db, "studentDatas", studentData?.id!), { ...newStudent });

    const docSnap = await getDoc(doc(db, 'performances', courseId));
    const data = docSnap.data();
    const studentDatas = data?.studentDatas || [];

    const studentDataToRemove = studentDatas.find((stu: any) => stu.studentDataId === studentData.id);

    await updateDoc(doc(db, 'performances', courseId), {
      studentDatas: arrayRemove(studentDataToRemove)
    });

    await updateDoc(doc(db, "regStuByCourse", courseId), { studentDatas: arrayRemove(studentData.id) });
    getPerformances(newStudent);
    setRemoving(false);
    setLoading(false);
  }

  const getFilteredValue = async (docu: DocumentData, stu: UserModel) => {
    const foundObj = docu.students.find((obj: any) => obj.studentId === stu.id);
    return foundObj;
  };

  const getPerformances = async (student: UserModel) => {
    setPerformanceLoading(true);
    const performancePromises = student.registeredCourses.map(async (obj) => {
      const performanceDoc = await getDoc(doc(db, 'performances', obj.courseId));
      return performanceDoc.exists() ? await getFilteredValue(performanceDoc.data() as DocumentData, student) : null;
    });

    const performances = await Promise.all(performancePromises);
    const validPerformances = performances.filter((performance) => performance !== null);
    setPerformances(validPerformances);
    setPerformanceLoading(false);
  };

  return (
    <>
    {
        loading?<div className='grid grid-cols-3 grid-rows-7 h-screen w-full justify-center items-center'>
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
        </div>:
    <div className='grid grid-cols-3 max-sm:flex max-sm:flex-col grid-rows-8 gap-9 h-screen w-full sm:p-6 max-sm:overflow-auto '>
              <div className='col-span-3 row-span-1 z-10'>
        <Navbar name={'Students Data'} />
      </div>
      <div className='col-span-2 max-sm:col-span-1 row-span-3 bg-white dark:bg-slate-700 rounded-lg p-3 flex items-center max-sm:flex-col max-sm:mt-16'>
        <div>
          <img src={studentData.imageUrl} alt='max-h-full object-fit' className='h-40 w-30 rounded-md object-fill' />
        </div>
        <div className='flex flex-row max-sm:flex-col pl-7 items-start'>
          <div className='flex flex-col dark:text-white'>
            <p>Name: {studentData.name}</p>
            <p>Id: {studentData.id}</p>
            <p>Gender: {studentData.gender}</p>
            <p>DOB: {studentData.dob}</p>
            <p>Contact No: {studentData.contactNo}</p>
            <p>Email: {studentData.email}</p>
            <p>Father Name: {studentData.fatherName}</p>
          </div>
          <div className='flex flex-col dark:text-white sm:pl-10 '>
            <p>Mother Name: {studentData.motherName}</p>
            <p>Class: {studentData.class}</p>
            <p>School: {studentData.schoolName}</p>
            <p>HearAbout: {studentData.hearAbout}</p>
            <p>Password: {studentData.password}</p>
          </div>
        </div>
      </div>

      <div className='relative col-span-1 row-span-3 bg-white dark:bg-slate-700 rounded-lg p-3 flex items-center dark:text-white'>
        <div className='absolute top-[-30px] left-1'>
          <h2>Parent feedback:</h2>
        </div>
      </div>

      <div className='relative col-span-1 row-span-4 bg-white dark:bg-slate-700 rounded-lg p-3 dark:text-white'>
        <div className='absolute top-[-30px] left-1 flex justify-between w-full px-3'>
          <h2 className='mb-4'>Performance:</h2>
          <p className='text-blue-600 hover:text-blue-400 cursor-pointer' onClick={goToDetail}>
            Tap to show more
          </p>
        </div>

        <div className='h-full w-full overflow-auto'>
          {performanceLoading ? (
            <div className='h-full w-full justify-center items-center'>
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
          ) : performances.length > 0 ? (
            performances.map((obj: any, index) => (
              <div
                key={index}
                className='flex justify-between py-3 px-4 w-full bg-slate-100 dark:bg-slate-500 rounded-md my-1.5'
              >
                <div>{studentData.registeredCourses[index].courseName}</div>
                <div>{obj.Grade}</div>
              </div>
            ))
          ) : (
            <div className='h-full w-full justify-center items-center'>
              <p>No performance data</p>
            </div>
          )}
        </div>
      </div>

      <div className='relative col-span-2 max-sm:col-span-1 row-span-4 bg-white dark:bg-slate-700 rounded-lg p-3 dark:text-white'>
        <div className='absolute top-[-30px] left-1 flex justify-between w-full px-3'>
          <h2 className='mb-4'>Courses Registered:</h2>
          <p className='text-blue-600 hover:text-blue-400 cursor-pointer' onClick={() => { navigate(`/admin/view_all_payments?studentDataId=${studentData.id}`, { state: { user: studentData } }) }}>
            Tap to show full payment history
          </p>
        </div>

        <div className='h-full w-full overflow-auto'>
          {studentData.registeredCourses.map((obj) => (
            <div
              key={obj.paymentId}
              className='flex justify-between py-3 px-4 w-full bg-slate-100 dark:bg-slate-500 rounded-md my-1.5'
            >
              <div>
                <div>
                  <p>
                    <span className='text-gray-700 text-xs'>Paid for:</span>{' '}
                    <span className=''>{obj.courseName}</span>{' '}
                  </p>
                  <p>
                    <span className='text-gray-700 text-xs'>Paid on:</span>{' '}
                    <span className=''>{obj.boughtDate}</span>{' '}
                  </p>
                </div>
                <div>
                  <p>
                    <span className='text-gray-700 text-xs'>Payment Id:</span>{' '}
                    <span className=''>{obj.paymentId}</span>{' '}
                  </p>
                  <p>
                    <span className='text-gray-700 text-xs'>Status:</span>{' '}
                    <span className=''>{obj.status}</span>{' '}
                  </p>
                </div>
              </div>
              <div className='flex flex-col items-end justify-between'>
                <p>
                  <span className='text-gray-700 text-xs'>Ends on :</span>{' '}
                  <span className=''>{obj.endDate}</span>{' '}
                </p>
                <button
                  type='button'
                  className='focus:outline-none text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'
                  onClick={() => { handleRemoveCourse(obj.courseId) }}
                >
                  {removing ? (
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                  ) : (
                    "Remove Course"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
}
    </>
  );
};

export default ViewStudentDataInformation;
