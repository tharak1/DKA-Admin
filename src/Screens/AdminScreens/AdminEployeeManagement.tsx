import React, { useEffect, useState } from 'react'
import Navbar from './AdminComponents/Navbar'
import { IoMdAdd } from "react-icons/io";
import EmployeeCard from './AdminComponents/EmployeeCard';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch} from '../../redux/PersistanceStorage';
import { GetEmployees, fetchEmployees } from '../../redux/EmployeeSlice';
import { EmployeeModel } from '../../Models/EmployeeModel';
import { useSelector } from 'react-redux';

const AdminEmployeeManagement:React.FC = () => {
  const dispatch = useAppDispatch();
  
  useEffect(()=>{
    dispatch(fetchEmployees());
  }, [dispatch]);

  const employees = useSelector(GetEmployees);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeModel[]>(employees);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilteredEmployees(
      employees.filter((employee:EmployeeModel) =>
        employee.employeeName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        employee.id!.toLowerCase().includes(e.target.value.toLowerCase()) ||
        employee.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (

    <>
      <div className='grid grid-cols-6 sm:grid-rows-10 h-screen overflow-auto w-full sm:p-6 gap-3'>
        <div className='sm:col-span-6 sm:row-span-1 sm:mb-4 max-sm:w-full z-10' >
          <Navbar name='Employee Management'/>
        </div>
        <div className='row-start-2 sm:row-span-1 col-span-4 max-sm:col-span-6 w-full max-sm:p-3 max-sm:mt-20' >
          <form className="flex items-center">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="search" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search Employee name, Employee ID, Employee Email..." 
                value={searchTerm} 
                onChange={handleSearchChange}
                required 
              />
            </div>
            <button type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>Search
            </button>
          </form>
        </div>

        <div className='row-start-2 max-sm:row-start-3 row-span-1 col-span-2 max-sm:col-span-4 w-full sm:h-full sm:flex pb-3'>
          <button
            type="button"
            onClick={() => navigate('/admin/add_employee')}
            className="inline-flex items-center py-2 px-3 ms-2 text-sm font-medium text-white bg-violet-700 rounded-lg border border-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800">
            <IoMdAdd fontSize={20}/>Add Employee
          </button>
        </div>

        <div className='col-span-6 row-span-8 grid sm:grid-cols-4 max-sm:grid-cols-1 grid-rows-auto gap-3 sm:overflow-auto max-sm:p-3'>
          {filteredEmployees.map((obj: EmployeeModel) => (
            <EmployeeCard employee={obj} key={obj.id}/>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminEmployeeManagement;
