import React from 'react';
import { UserModel } from '../../../Models/UserModel';
import PerformanceCard from '../AdminComponents/PerformanceCard';
import { useLocation } from 'react-router-dom';

interface SomeModel {
  student: UserModel;
  performances: any;
}

const AdminViewFullPerformance: React.FC = () => {
  const location = useLocation();
  const state = location.state as SomeModel;

  if (!state) {
    console.error('No state found in location.');
    return <div>Error: No data found.</div>;
  }

  const { student, performances } = state;

  if (!student || !performances) {
    console.error('Student or performances data is missing.');
    return <div>Error: Invalid data.</div>;
  }

  console.log(student);
  console.log(performances);

  return (
    <>
      <div className='pt-20 sm:px-20 max-sm:px-4 w-full h-screen overflow-auto '>
        <div className=' w-full flex flex-col items-start mb-4'>
          <h1 className='text-2xl font-bold '>{student.id}</h1>
          <p className='font-poppins'>{student.name}</p>
        </div>

        <div className='space-y-5 mb-7'>
          {performances.map((obj: any, index: number) => (
            <PerformanceCard performance={obj} course={student.registeredCourses[index]} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminViewFullPerformance;
