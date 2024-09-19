import React, { useEffect, useState } from 'react';
import Navbar from './AdminComponents/Navbar';
import { FilteredCourse, UserModel } from '../../Models/UserModel';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase_config';
import useAddExtraDays from '../../hooks/AddExtraDaysHook';
import { formatDate } from '../../hooks/DateFormater';


const AdminShowPendingPayments: React.FC = () => {
    const [PendingStudents, setPendingStudents] = useState<FilteredCourse[] | null>(null);
    const [filteredStudents, setFilteredStudents] = useState<FilteredCourse[] | null>(null);
    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const { addExtraDays, loading, error } = useAddExtraDays();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const getAllUsersData = async () => {
        setDataLoading(true);
        try {
            const userssnap = await getDocs(collection(db, "students"));
            const students: UserModel[] = userssnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as UserModel[];
            const filteredData = filterAndTransformUserData(students);
            setPendingStudents(filteredData);
            setFilteredStudents(filteredData); // Initialize filteredStudents
        } catch (error) {
            console.error("Error fetching data:", error);
            setPendingStudents(null); // Handle error state
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        getAllUsersData();
    }, []);

    useEffect(() => {
        if (PendingStudents) {
            
            const filtered = PendingStudents.filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.id.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setFilteredStudents(filtered);
        }
    }, [searchQuery, PendingStudents]);

    function filterAndTransformUserData(users: UserModel[]): FilteredCourse[] {
        const result: FilteredCourse[] = [];

        users.forEach(user => {
            if (user.registeredCourses && Array.isArray(user.registeredCourses)) {
                user.registeredCourses.forEach(course => {
                    if (new Date(course.endDate) < new Date()) {
                        result.push({
                            id: user.id,
                            name: user.name,
                            ...course
                        });
                    }
                });
            }
        });

        return result;
    }

    const update = (studentId: string, courseId: string,index:number) =>{
        addExtraDays(studentId, courseId)
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        filteredStudents![index].endDate = formatDate(currentDate);
    }

    return (
        <div className='w-full h-screen grid grid-cols-2 grid-rows-10 gap-3 sm:p-6 '>
            <div className='col-span-2 row-span-1'>
                <Navbar name='Pending Payments' />
            </div>

            <div className='w-full h-full row-span-1 col-span-2 '>
                <form className="max-w-md" onSubmit={e => e.preventDefault()}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Search Name, Student Id..." 
                            required 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>
            </div>

            {dataLoading ? (
                <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
                    <div>
                        <svg
                            aria-hidden='true'
                            className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
                            viewBox='0 0 100 101'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
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
                </div>
            ) : filteredStudents !== null ? (
                <div className='col-span-2 row-span-8 h-full w-full bg-white dark:bg-slate-700 rounded-lg p-3'>
                    <div className='w-full grid grid-cols-6 py-5'>
                        <div className='col-span-2 flex flex-col justify-start'>
                            <div>Purchase</div>
                        </div>
                        <div className='col-span-1 flex flex-col justify-center items-center'>
                            <div>Details</div>
                        </div>
                        <div className='col-span-2 flex flex-col justify-center items-center'>
                            <div>Payment Date</div>
                        </div>
                        <div className='col-span-1 flex flex-col justify-center items-center'>
                            <div>Action</div>
                        </div>
                    </div>
                    {filteredStudents.map((obj,index) => (
                        <div
                            className='w-full grid grid-cols-6 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600'
                            key={obj.paymentId}
                        >
                            <div className='col-span-2 flex flex-col justify-start'>
                                <h2>{obj.courseName}</h2>
                                <h2>{obj.name}</h2>
                                <h2>{obj.id}</h2>
                            </div>
                            <div className='col-span-1 flex flex-col justify-center border-l-2 items-center'>
                                <h2>{obj.courseSession}</h2>
                                <h2>{obj.branch}</h2>
                                <h2>{obj.courseType}</h2>

                            </div>
                            <div className='col-span-2 flex flex-col justify-center items-center border-l-2'>
                                <h2>
                                    <span className='text-xs text-gray-600 dark:text-gray-400'>Payment ID :</span>{' '}
                                    {obj.paymentId}
                                </h2>
                                <h2>
                                    <span className='text-xs text-gray-600 dark:text-gray-400'>Payment Date :</span>{' '}
                                    {obj.boughtDate}
                                </h2>
                                <h2>
                                    <span className='text-xs text-gray-600 dark:text-gray-400'>Deadline Date :</span>{' '}
                                    {obj.endDate}
                                </h2>
                            </div>
                            <div className={`col-span-1 flex flex-col justify-center items-center border-l-2`}>
                                <button 
                                    type="button" 
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                                    onClick={() => { update(obj.id, obj.courseId,index) }}
                                >
                                    Add 3 Days
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error: {error}</p>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
                    <div>
                        <h2>No data</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShowPendingPayments;
