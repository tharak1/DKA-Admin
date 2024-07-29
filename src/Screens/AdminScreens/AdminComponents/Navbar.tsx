import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Theme, toggleTheme } from '../../../redux/ThemeSlice';
import { GetUser, logoutUser } from '../../../redux/UserSlice';
import { EmployeeModel } from '../../../Models/EmployeeModel';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { toggleDrawer } from '../../../redux/DrawerSlice';
import { IoMenu } from "react-icons/io5";

interface Navbarprops {
    name: string;
}

const Navbar: React.FC<Navbarprops> = ({ name }) => {
    const [openm, setOpenm] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const user = useSelector(GetUser) as EmployeeModel;
    const theme = useSelector(Theme);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const ordinalSuffix = (n: number) => {
            const s = ["th", "st", "nd", "rd"],
                v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        }

        return `${ordinalSuffix(day)} ${month} ${year}`;
    };

    const handleToggle = () => {
        dispatch(toggleDrawer());
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpenm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-row justify-between items-center space-x-2 sm:rounded-lg bg-white dark:bg-slate-700 px-4 py-1 max-sm:h-20 max-sm:fixed max-sm:w-full z-50">
            <div className='flex'>
                <div className="mr-4 flex justify-center items-center sm:hidden" onClick={handleToggle}>
                    <IoMenu size={28} />
                </div>
                <div>
                    <h1 className='dark:text-white'>{name}</h1>
                    <p className='dark:text-white'>{formatDate(new Date())}</p>
                </div>
            </div>
            <div className="flex flex-row dark:text-white space-x-5">
                <label className="inline-flex items-center cursor-pointer max-sm:hidden">
                    <input type="checkbox" value="" className="sr-only peer" checked={theme === 'dark'} onChange={handleToggleTheme} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-400">Dark Mode</span>
                </label>
                <div ref={buttonRef} className="relative flex justify-between items-center hover:cursor-pointer" onClick={() => { setOpenm(!openm) }}>
                    <img src={user.profileImage} alt="user image" className="h-10 w-10 rounded-full object-cover bg-slate-50 border-2 mr-2" />
                    <h1>{user.employeeName}</h1>
                    <div ref={dropdownRef} className={`absolute top-[65px] right-[-10px] ${openm ? "" : "hidden"} w-[300px] z-50 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-5`}>
                        <div className="w-full flex flex-col items-center justify-center pb-10">
                            <img className="w-24 h-24 object-cover mb-3 rounded-full shadow-lg" src={user.profileImage} alt="Bonnie image" />
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.employeeName}</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</span>
                            <div className="flex justify-center items-center mt-4 md:mt-6">
                                <button className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-400 rounded-lg border border-gray-200 hover:bg-red-600 hover:text-black-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-red-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700" onClick={() => { dispatch(logoutUser()); navigate('/') }}>LogOut</button>
                            </div>
                        </div>
                        <label className="inline-flex items-center cursor-pointer sm:hidden">
                            <input type="checkbox" value="" className="sr-only peer" checked={theme === 'dark'} onChange={handleToggleTheme} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-400">Dark Mode</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
