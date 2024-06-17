import React from 'react'
import { UserModel } from '../../../Models/UserModel';
import PerformanceCard from '../AdminComponents/PerformanceCard';
import { useLocation } from 'react-router-dom';



const AdminViewFullPerformance:React.FC= () => {
    const location = useLocation();
  const { student, performances } = location.state as { student: UserModel, performances: any };
  console.log(performances);
  
  return (
    <>
        <div className='pt-20 px-20 w-full h-screen bg-slate-100  overflow-auto '>
            <div className=' w-full flex flex-col items-start mb-4'>
                <h1 className='text-2xl font-bold '>{student.id}</h1>
                <p className='font-poppins'>{student.name}</p>
            </div>  

            {
                performances.map((obj:any,index:number)=>(
                  <PerformanceCard performance={obj} course={student.registeredCourses[index]} key={index}/>
                )) 
            }

        </div>

    </>
  )
}

export default AdminViewFullPerformance
