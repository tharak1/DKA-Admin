import React, { useEffect, useState } from 'react'
import StatsCard from './AdminComponents/StatsCard'
import Navbar from './AdminComponents/Navbar';
import { useSelector } from 'react-redux';
import { GetEmployees, fetchEmployees } from '../../redux/EmployeeSlice';
import { useAppDispatch } from '../../redux/PersistanceStorage';
import { Categories, fetchCategories } from '../../redux/CategorySlice';
import { GetCourses, fetchCourses } from '../../redux/CourcesSlice';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase_config';




const AdminDashboard:React.FC = () => {
    const dispatch = useAppDispatch();
    const [loading,setloading] = useState<boolean>(false);
    const [info,setInfo] = useState({
        noOfStudents:0,
        payments:0
    })

    const getInfo=async()=>{
        const querySnapshot1 = await getDocs(collection(db, 'students'));
        const querySnapshot2 = await getDocs(collection(db, 'payments'));
        setInfo({
            noOfStudents:querySnapshot1.size,
            payments:querySnapshot2.size
        })
    }

    useEffect(()=>{
        setloading(true);
        getInfo();
        dispatch(fetchEmployees());
        dispatch(fetchCategories());
        dispatch(fetchCourses());
        setloading(false);
    },[])

    const employees = useSelector(GetEmployees);
    const courses = useSelector(GetCourses);
    const categories = useSelector(Categories);
    



  return (
    <div>

        {
            !loading?(
                <div className="grid grid-cols-12 grid-rows-10 gap-5 h-screen w-full p-6 ">
                {/* col-span-12 */}
                <div className='col-span-12 row-span-1'>
                    <Navbar name='Dashboard'/>
                </div>
        
                    <StatsCard name= {"Total students"} count = {info.noOfStudents} />
                    <StatsCard name= {"courses sold"} count = {info.payments}/>
                    <StatsCard name= {"Total Categories"} count = {categories.length}/>
                    <StatsCard name= {"Total courses"} count = {courses.length}/>
                    <StatsCard name= {"Total Visits"} count = {20}/>
                    <StatsCard name= {"Total Feedbacks"} count = {20}/>
                    <StatsCard name= {"Total Employees"} count = {employees.length}/>
                    <StatsCard name= {"Total Branches"} count = {20}/>
        
        
        
        
        
                    <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800 col-span-8 row-start-6 row-span-6 overflow-auto scrollbar-rounded">
                        <h1 className="mt-4 ml-4">Sales Last 6 months</h1>
                        {/* <MyResponsiveBar/> */}
                    </div>
        
        
                    <div className="bg-white overflow-hidden shadow sm:rounded-lg dark:bg-gray-800 col-start-9 col-span-4 row-start-2 row-span-7">
                        <h1 className="mt-4 ml-4">Students-Courses Contribution :</h1>
                        {/* <MyResponsivePie/> */}
                    </div>
                </div>
            ):(
                <div className="grid grid-cols-12 grid-rows-12 gap-5 h-screen justify-center items-center w-full p-6 bg-slate-100 dark:bg-gray-900">
                    <div className='col-span-12 row-span-12 w-full h-full flex justify-center items-center'>
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                </div>
            )
        }

    </div>
  )
}

export default AdminDashboard
