import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Categories } from '../../../redux/CategorySlice';
import { GetCourses } from '../../../redux/CourcesSlice';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { CourseModel } from '../../../Models/CourceModel';
import CategoryModel from '../../../Models/CategoryModel';
import { UserModel } from '../../../Models/UserModel';
import AddCashCourseCard from './AddCashCourseCard';

interface AddCashCourseProps {
    user: UserModel;
    isOpen:boolean;
    closeModal:()=>void;
}

const AddCashCourse: React.FC<AddCashCourseProps> = ({ user,isOpen ,closeModal}) => {
    const categories = useSelector(Categories);
    const [filter, setFilter] = useState<string>("");
    const courses = useSelector(GetCourses);




    const filteredCourses = courses.filter((course: CourseModel) => 
        course.category === filter
    );



    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2 text-left align-middle shadow-xl transition-all bg-gray-50">
                                    <section>
                                        <div className="flex flex-col items-center justify-center py-8 mx-auto lg:py-0">
                                            <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                                    <div>
                                                        <label htmlFor="courseType" className="block mb-2 text-sm font-medium text-gray-900">Select a category</label>
                                                        <select
                                                            id="courseType"
                                                            value={filter}
                                                            onChange={(event) => setFilter(event.target.value)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        >
                                                            <option value="">-- Select category --</option>
                                                            {categories.map((category: CategoryModel) => (
                                                                <option value={category.name} key={category.id}>{category.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className='h-[580px] overflow-auto w-full p-2'>
                                                        {filteredCourses.map((course: CourseModel) => (
                                                            <AddCashCourseCard course={course} user={user} key={course.id}/>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default AddCashCourse;
