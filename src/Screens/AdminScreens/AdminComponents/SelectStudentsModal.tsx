import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase_config';
import { QuestionPaper } from '../../../Models/ExamModel';

interface SelectStudentsModalProps{
    questionPaper:QuestionPaper;
    setQuestionPaper: React.Dispatch<React.SetStateAction<QuestionPaper>>;
}

const SelectStudentsModal:React.FC<SelectStudentsModalProps> = ({questionPaper,setQuestionPaper}) => {


    const [regStu , setRegStu] = React.useState<string[]>([]);
    const [filteredStudent , setFilteredStudent] = React.useState<string[]>([]);
    const [filteredStudent1 , setFilteredStudent1] = React.useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchKey, setSearchKey] = useState<string>("");
    const [searchKey1, setSearchKey1] = useState<string>("");

    const getRegStu = async () => {
        setLoading(true);
        
        try {

            const querySnapshot = await getDocs(
                query(collection(db, "regStuByCourse"), where("couseName", "==", questionPaper.course))
            );

            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                
                 const filteredStudents = docData.students.filter(
                    (student: string) => !questionPaper.selectedStudents?.includes(student)
                );

                setRegStu(filteredStudents);
            });
            
        } catch (error) {
            console.error("Error fetching students: ", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        getRegStu();
    },[])

    useEffect(() =>{
        let x = regStu.filter(stu =>(
            stu.toLowerCase().includes(searchKey.toLowerCase())
        ))
        setFilteredStudent(x);
    },[searchKey,regStu])

    useEffect(() =>{
        let x = questionPaper.selectedStudents!.filter(stu =>(
            stu.toLowerCase().includes(searchKey.toLowerCase())
        ))
        setFilteredStudent1(x);
    },[searchKey1,questionPaper])


    const addFunction = (newStudent: string) => {
        setQuestionPaper({
            ...questionPaper, 
            selectedStudents: [...questionPaper.selectedStudents!, newStudent]
        });

        setRegStu(prevRegStu => prevRegStu.filter(student => student !== newStudent));
    }

    const removeFunction = (studentToRemove: string) => {
        setQuestionPaper({
            ...questionPaper,
            selectedStudents: questionPaper.selectedStudents!.filter(student => student !== studentToRemove)
        });
    
        setRegStu(prevRegStu => [...prevRegStu, studentToRemove]);
    }
    



    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    

  return (
    <>
        <div className="text-center rounded-lg text-white font-bold">
            <button  className="bg-slate-500 px-4 py-1 rounded-md ml-4 mt-4" 
            type="button"
            onClick={openModal}
            >
                Select Students
            </button>
        </div>

        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={closeModal}>
                <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    <DialogPanel className="w-[60vw] h-[80vh] transform overflow-hidden rounded-2xl p-2 text-left align-middle shadow-xl transition-all bg-gray-50">
                        <section className='h-full'>
                            <div className='w-full h-full p-8 flex flex-row'>

                            {
                                    loading?(
                                        <h1>Loading..</h1>
                                    ):(
                                        <div className='w-1/2 h-full m-1 overflow-auto'>
                                                    
                                            <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
                                                Search
                                            </label>
                                            <div className='relative z-10'>
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
                                                    setSearchKey1(e.target.value);
                                                }}
                                                />
                                                
                                            </div>
                                                        
                                        {
                                            filteredStudent1.map((stu)=>(
                                                <div className='m-3' key={stu}>
                                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center justify-between p-3 my-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' key={stu}>
                                                        <div className='flex flex-row justify-start items-center'>
                                                            <h2 className='ml-2 dark:text-white'>{stu}</h2>
                                                        </div>
                                                        <div>
                                                                <button className='py-1 px-4 bg-rose-500 hover:bg-rose-400 rounded-md' onClick={() => {removeFunction(stu)}}>Remove</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))
                                        }
                                        </div>
                                    )
                                }

                                {
                                    loading?(
                                        <h1>Loading..</h1>
                                    ):(
                                        <div className='w-1/2 h-full m-1 overflow-auto'>
                                                    
                                            <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
                                                Search
                                            </label>
                                            <div className='relative z-10'>
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

                                            </div>
                                                        
                                        {
                                            filteredStudent.map((stu)=>(
                                                <div className='m-3' key={stu}>
                                                    <div className='w-full rounded-md bg-slate-200 dark:bg-slate-700 flex flex-row items-center justify-between p-3 my-2 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500' key={stu}>
                                                        <div className='flex flex-row justify-start items-center'>
                                                            <h2 className='ml-2 dark:text-white'>{stu}</h2>
                                                        </div>
                                                        <div>
                                                                <button className='py-1 px-4 bg-green-500 hover:bg-green-400 rounded-md' onClick={()=>{addFunction(stu)}}>ADD</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))
                                        }
                                        </div>
                                    )
                                }


                            </div>
                        </section>
                    </DialogPanel>
                    </TransitionChild>
                </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default SelectStudentsModal
