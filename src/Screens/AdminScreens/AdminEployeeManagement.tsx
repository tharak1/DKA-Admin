import React, { useEffect } from 'react'
import Navbar from './AdminComponents/Navbar'
import StatsCard from '../../Components/StatsCard'
import { IoMdAdd } from "react-icons/io";
import EmployeeCard from '../../Components/EmployeeCard';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/PersistanceStorage';
import { GetEmployees, fetchEmployees } from '../../redux/EmployeeSlice';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../Components/LoadingScreen';
import { EmployeeModel } from '../../Models/EmployeeModel';

const AdminEployeeManagement:React.FC = () => {
const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(fetchEmployees());
  },[])

  const employees = useSelector(GetEmployees);
  const navigate = useNavigate();
  return (

    employees.length===0?<LoadingScreen/>:
    <>
          <div className='grid grid-cols-6 grid-rows-10 h-screen overflow-auto w-full p-6 gap-3 bg-slate-100'>
        <div className="col-span-6 mb-5 row-span-1">
            <Navbar name='Employee Management'/>
        </div>
        
        <div className='row-span-2 col-span-1'>
        <StatsCard name='Toatal employees' count={employees.length} />
        </div>

        <div className='row-start-4 row-span-1 col-span-4 w-full'>
          <form className="flex items-center ">   
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                  </div>
                  <input type="text" id="search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Employee name, Employee ID,Employee Email..." required />

              </div>
              <button type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>Search
              </button>
          </form>
        </div>

        <div className='row-start-4 row-span-1 col-span-2 w-full h-full flex pb-3'>
          <button
            type="button"
            onClick={()=>(navigate('/admin/add_employee'))}
            className="inline-flex items-center py-2 px-3 ms-2 text-sm font-medium text-white bg-violet-700 rounded-lg border border-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800 ">
            <IoMdAdd fontSize={20}/>Add Employee
          </button>
        </div>

        <div className='col-span-6 row-span-6 grid grid-cols-4 grid-rows-auto gap-3 overflow-auto'>
            {
              employees.map((obj:EmployeeModel)=>(
                <EmployeeCard employee={obj} key={obj.id}/>
              ))
            }
        </div>
      
    </div>
    </>

  )
}

export default AdminEployeeManagement
