import React, { useState } from 'react';
import Navbar from './AdminComponents/Navbar';
import { UserModel } from '../../Models/UserModel';
import { DocumentData, arrayRemove, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase_config';
import { useNavigate } from 'react-router-dom';

const AdminShowStudents: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [student, setStudent] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [removing,setRemoving] = useState<boolean>(false);
  const [performanceLoading, setPerformanceLoading] = useState<boolean>(false);
  const [performances, setPerformances] = useState<any[]>([]);

  const navigate = useNavigate();

  const getFilteredValue = async (docu: DocumentData,stu:UserModel) => {
    const foundObj = docu.students.find((obj: any) => obj.studentId === stu!.id);
    return foundObj;
  };

  const getPerformances = async (student: UserModel) => {
    setPerformanceLoading(true);
    const performancePromises = student.registeredCourses.map(async (obj) => {
      const performanceDoc = await getDoc(doc(db, 'performances', obj.courseId));
      return performanceDoc.exists() ? await getFilteredValue(performanceDoc.data() as DocumentData,student) : null;
    });

    const performances = await Promise.all(performancePromises);
    const validPerformances = performances.filter((performance) => performance !== null);
    setPerformances(validPerformances);
    setPerformanceLoading(false);
  };

  const findStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPerformances([]);
    setLoading(true);

    try {
      let studentsQuery;
      const idPattern = /^DKA\d{5}$/;

      if (idPattern.test(searchKey)) {
        // Search by ID if searchKey matches the ID pattern
        studentsQuery = query(
          collection(db, 'students'),
          where('id', '==', searchKey)
        );
      } else {
        // Search by name for non-ID pattern searchKey
        studentsQuery = query(
          collection(db, 'students'),
          where('name', '>=', searchKey),
          where('name', '<=', searchKey + '\uf8ff')
        );
      }
  
      const querySnapshot = await getDocs(studentsQuery);

      // console.log(querySnapshot);
      

      const studentsList: UserModel[] = [];

      querySnapshot.forEach((doc) => {
        studentsList.push(doc.data() as UserModel);
      });
      if(studentsList.length>0){
        setStudent(studentsList[0] as UserModel);
        getPerformances(studentsList[0]);
      }
      console.log(searchKey);
      
      console.log(studentsList.length);
      
  
      // setStudent(studentsList[0]);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setStudent(null);
      setPerformances([]);
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   if (student) {
  //     getPerformances(student);
  //   }
  // }, [student]);

  const goToDetail = () => {
    navigate('/admin/detailPerformance', { state: { student, performances } });
  };


  const handleRemoveCourse = async(courseId:string)=>{
    setRemoving(true);
    setLoading(true);

    const newstu = {
      ...student!,
      registeredCourses: student!.registeredCourses.filter((obj) => {
          return obj.courseId !== courseId;
      })
    }
    setStudent(newstu);
    await setDoc(doc(db,"students",student?.id!),{...newstu});

    const docSnap = await getDoc(doc(db,'performances',courseId));
    const data = docSnap.data();
    const students = data?.students || [];

    const studentToRemove = students.find((stu: any) => stu.studentId === student!.id);
  
    await updateDoc(doc(db,'performances',courseId), {
      students: arrayRemove(studentToRemove)
    }); 

    await updateDoc(doc(db, "regStuByCourse", courseId), { students: arrayRemove(student!.id) });
    getPerformances(newstu);
    setRemoving(false);
    setLoading(false);
  }

  return (
    <div className='grid grid-cols-3 grid-rows-10 gap-y-10 gap-x-3 overflow-auto p-6'>
      <div className='col-span-3 row-span-1'>
        <Navbar name={'Students Data'} />
      </div>

      <div className='col-span-3 row-span-1'>
        <form className='max-w-md' onSubmit={findStudent}>
          <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search Student ID'
              required
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            />
            <button
              type='submit'
              className='text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className='col-span-3 row-span-5 flex items-center justify-center dark:text-white'>
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
      ) : student !== null ? (
        <>
          <div className='col-span-2 row-span-3 bg-white dark:bg-slate-700 rounded-lg p-3 flex items-center'>
            <div>
              <img src={student.imageUrl} alt='max-h-full object-fit' className='h-40 w-30 rounded-md object-fill' />
            </div>
            <div className='flex flex-row pl-7 items-start'>
              <div className='flex flex-col dark:text-white'>
                <p>Name: {student.name}</p>
                <p>Id: {student.id}</p>
                <p>Gender: {student.gender}</p>
                <p>DOB: {student.dob}</p>
                <p>Contact No: {student.contactNo}</p>
                <p>Email: {student.email}</p>
                <p>Father Name: {student.fatherName}</p>
              </div>
              <div className='flex flex-col dark:text-white pl-10'>
                <p>Mother Name: {student.motherName}</p>
                <p>Class: {student.class}</p>
                <p>School: {student.schoolName}</p>
                <p>HearAbout: {student.hearAbout}</p>
                <p>Password: {student.password}</p>
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
              ) : performances !== null ? (
                performances.map((obj: any, index) => (
                  <div
                    key={index}
                    className='flex justify-between py-3 px-4 w-full bg-slate-100 dark:bg-slate-500 rounded-md my-1.5'
                  >
                    <div>{student.registeredCourses[index].courseName}</div>
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

          <div className='relative col-span-2 row-span-4 bg-white dark:bg-slate-700 rounded-lg p-3 dark:text-white'>
            <div className='absolute top-[-30px] left-1 flex justify-between w-full px-3'>
              <h2 className='mb-4'>Courses Registered:</h2>
              <p className='text-blue-600 hover:text-blue-400 cursor-pointer' onClick={()=>{navigate(`/admin/view_all_payments?studentId=${student.id}`,{state:{user:student}})}}>
                Tap to show full payment history
              </p>
            </div>

            <div className='h-full w-full overflow-auto'>
              {student.registeredCourses.map((obj) => (
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
                      onClick={()=>{handleRemoveCourse(obj.courseId)}}
                    >
                      {
                        removing?(
                          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                        ):(
                          "Remove Course"
                        )
                      }

          
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className='col-span-3 row-span-5 flex items-center justify-center dark:text-white'>
          Search to get results
        </div>
      )}
    </div>
  );
};

export default AdminShowStudents;


