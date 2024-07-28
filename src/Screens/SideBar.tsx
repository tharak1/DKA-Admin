import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded';
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import CategoryIcon from '@mui/icons-material/Category';
import { useSelector } from 'react-redux';
import { Theme } from '../redux/ThemeSlice';
import { RootState, useAppDispatch } from '../redux/PersistanceStorage';
import { fetchCourses } from '../redux/CourcesSlice';
import { GetUser } from '../redux/UserSlice';
import { EmployeeModel } from '../Models/EmployeeModel';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import { toggleDrawer } from '../redux/DrawerSlice';
import { IoMdClose } from "react-icons/io";

const SideBar:React.FC = () => {
    const theme = useSelector(Theme);

    const dispatch = useAppDispatch();

    useEffect(()=>{
      dispatch(fetchCourses());
    },[]);

    const user = useSelector(GetUser) as EmployeeModel;

    const isOpen = useSelector((state: RootState) => state.drawer.isOpen);
  
    const handleToggle = () => {
      dispatch(toggleDrawer());
    };


    return (
        <div className={theme}>
            <div className="sm:grid sm:grid-cols-5 sm:grid-rows-1 sm:h-screen overflow-auto dark:text-white font-poppins">

                <div className={`overflow-y-auto py-5 px-3 h-screen bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 col-span-1 row-start-1 row-span-1 ${isOpen?"":"max-sm:hidden"}`} >
                    <div className="w-full flex flex-row justify-start items-center mb-4 dark:text-white">
                    <div className="mr-10 ml-1 mt-2 flex justify-center items-center sm:hidden" onClick={handleToggle}>
                    <IoMdClose size={28}/>

        </div>
                        <span className="sans text-2xl font-bold">Divya Kala Academy</span>
                    </div>

                    {

                        user.isAdmin &&(
                            <>
                            <ul className="space-y-2 pb-5 ">
                            <li>
                                <Link to="/admin/dashboard" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group " onClick={handleToggle}>
                                    <SpaceDashboardRoundedIcon />
                                    <span className="ml-3">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/manage_categories" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleToggle}>
                                    <CategoryIcon />
                                    <span className="ml-3">Manage Categories</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/manage_courses" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleToggle}>
                                    <ImportContactsIcon />
                                    <span className="ml-3">Manage Courses</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/students" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleToggle}>
                                    <FolderSharedRoundedIcon />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Students data</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/payments" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleToggle}>
                                    <CurrencyRupeeIcon />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Payments</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/employee_management" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                    <ManageAccountsRoundedIcon />
                                    <span className="ml-3">Employee Management</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/other" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                    <ManageAccountsRoundedIcon />
                                    <span className="ml-3">Other</span>
                                </Link>
                            </li>
                        </ul>
                    <span className="block w-full h-1 border-t border-gray-300 "></span>

                        </>
                        )
                    }

                    <ul className="pt-5  space-y-2 ">
                        <li>
                            <Link to="/admin/manage_questionPaper" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                <ContentPasteIcon />
                                <span className="ml-3">Online Exams</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/exam_reports" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                <DescriptionIcon />
                                <span className="ml-3">Exam reports</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/online_class_management" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                <SchoolIcon />
                                <span className="ml-3">Online Class Management</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/pending_payments" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                <FaMoneyBillTransfer size={24} />
                                <span className="ml-3">Pending Payments</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/marks_entry" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group" onClick={handleToggle}>
                                <BsFileEarmarkSpreadsheet size={24} />
                                <span className="ml-3">Marks Entry</span>
                            </Link>
                        </li>

                    </ul>
                    
                </div>
                <div className={`${isOpen?"max-sm:hidden":""} bg-slate-200 dark:bg-slate-900 dark:text-white col-span-4 max-sm:col-span-5 row-start-1 row-span-1 overflow-auto`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default SideBar
