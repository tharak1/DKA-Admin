import React, { useState } from 'react';
import Navbar from './AdminComponents/Navbar';
import { CourseModel } from '../../Models/CourceModel';
import { useSelector } from 'react-redux';
import { GetCourses } from '../../redux/CourcesSlice';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase_config';
import MarksEntryCard from './AdminComponents/MarksEntryCard';
import { GetUser } from '../../redux/UserSlice';
import { EmployeeModel } from '../../Models/EmployeeModel';

const AdminMarksScreen: React.FC = () => {
  const [courseName, setCourseName] = useState<string>("");
  const [fetched, setFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [studentPerformances, setStudentPerformances] = useState<any[]>([]);
  const [updateValues, setUpdateValues] = useState({
    startDate: '',
    endDate: '',
    totalNoOfClasses: '',
    totalMarks:''
  });

  const user = useSelector(GetUser) as EmployeeModel;

  const allCourses = useSelector(GetCourses);
  const userCourses = user.coursesTaught;
  const courses = user.isAdmin ? allCourses : allCourses.filter((course:CourseModel) => userCourses.includes(course.courseName!));
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, 'performances', courseName);
      const fetchedData = await getDoc(docRef);

      console.log('====================================');
      console.log(fetchedData.data()!);
      console.log('====================================');

      if (fetchedData.exists()) {
        setStudentPerformances(fetchedData.data()!.students);
        setFetched(true);
      } else {
        setStudentPerformances([]);
        setFetched(false);
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      setStudentPerformances([]);
      setFetched(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPerformances = studentPerformances.map(performance => ({
      ...performance,
      startDate: updateValues.startDate,
      endDate: updateValues.endDate,
      TotalClassesTaken: updateValues.totalNoOfClasses,
      totalMarks:updateValues.totalMarks
    }));

    setLoading(true);
    try {
      const docRef = doc(db, 'performances', courseName);
      await updateDoc(docRef, { students: updatedPerformances });
      setStudentPerformances(updatedPerformances);
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='h-screen w-full grid grid-cols-3 grid-rows-10 overflow-auto sm:p-6'>
      <div className='col-span-3 row-span-1 w-full h-full'>
        <Navbar name='Marks Entry' />
      </div>

      <div className='col-span-3 row-span-1 w-full max-sm:p-3'>
        <form className='flex flex-row' onSubmit={handleSubmit}>
          <select
            id='courseName'
            name='courseName'
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:outline-none'
          >
            <option value=''>Select Course</option>
            {courses.map((obj: CourseModel) => (
              <option value={obj.id} key={obj.id}>
                {obj.courseName}
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

        {fetched && (
          <div className='col-span-3 row-span-1 max-sm:row-span-2  w-full max-sm:p-3'>
            <form onSubmit={handleUpdate} className='flex flex-row max-sm:flex-col justify-between dark:text-white'>
            <div className='flex flex-row justify-between'>
              <div className='flex flex-col'>
                <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date: </label>
                <input
                  type="date"
                  value={updateValues.startDate}
                  onChange={(event) => setUpdateValues({ ...updateValues, startDate: event.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
              <div className='flex flex-col'>
                <label className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date: </label>
                <input
                  type="date"
                  value={updateValues.endDate}
                  onChange={(event) => setUpdateValues({ ...updateValues, endDate: event.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
            </div>
            <div className='flex flex-row justify-between space-x-2'>
              <div>
                <label htmlFor="totalNoOfClasses" className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Total classes</label>
                <input
                  id="totalNoOfClasses"
                  type="number"
                  value={updateValues.totalNoOfClasses}
                  onChange={(event) => setUpdateValues({ ...updateValues, totalNoOfClasses: event.target.value.toString() })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label htmlFor="totalNoOfClasses" className="block mt-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Marks</label>
                <input
                  id="totalNoOfClasses"
                  type="number"
                  value={updateValues.totalMarks}
                  onChange={(event) => setUpdateValues({ ...updateValues, totalMarks: event.target.value.toString() })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className='flex justify-center items-end mb-1'>
                <button type="submit" className="h-10 bg-blue-400 hover:bg-blue-500 rounded-lg py-2 px-4">Update</button>
              </div>
            </div>

            </form>
          </div>
        )}
      </div>

      <div className='col-span-3 row-start-5 row-span-6 w-full h-full bg-white dark:bg-slate-700 rounded-lg p-3 overflow-auto space-y-5 '>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <div>
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
          </div>
        ) : fetched ? (
          studentPerformances.length === 0 ? (
            <div className='w-full h-full flex justify-center items-center'>
              <div>
                <h2>No data</h2>
              </div>
            </div>
          ) : (
            studentPerformances.map((performance, index) => (
              <MarksEntryCard performance={performance} index={index} studentPerformances={studentPerformances} setStudentPerformances={setStudentPerformances}/>
            ))
          )
        ) : (
          <div className='w-full h-full flex justify-center items-center'>
            <div>
              <h2>No data</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMarksScreen;

