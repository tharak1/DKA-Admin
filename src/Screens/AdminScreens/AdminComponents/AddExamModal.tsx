import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import React, { Fragment, useState } from 'react'
import { QuestionPaper } from '../../../Models/ExamModel';
import { GetCourses } from '../../../redux/CourcesSlice';
import { CourseModel } from '../../../Models/CourceModel';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { addTempQuestionPaper } from '../../../redux/QuestionPaperSlice';
import { useSelector } from 'react-redux';
const AddExamModal:React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [questionPaper,setQuestionPaper] = useState<QuestionPaper>({
        id:uuidv4(),
        course:"",
        examType:'',
        for:"",
        date:"",
        time:"00:00",
        duration:"",
        totalMarks:0,
        questions : [],
        questionsImages:[],

    })
    const courses = useSelector(GetCourses);
    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const toCreatePaperPage = () => {

        navigate(`/admin/create_question_paper?type=new&id=${questionPaper.id}`);
    }

  return (
    <>
            <div className="text-center rounded-lg text-white font-bold">
                <button
                    type="button"
                    onClick={openModal}
                    className="px-3 bg-violet-600 py-2 text-center rounded-lg text-white font-bold p-2"
                >
                    
                Add paper
                </button>
            </div>

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
                                                    <form className="space-y-4 md:space-y-6" action="#">
                                                        <div>
                                                        <label htmlFor="courseType" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 ">Select a course</label>
                                                            <select id="courseType" value={questionPaper.course} onChange={(event)=>{setQuestionPaper({...questionPaper,course: event.target.value})}} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                                            <option value="">-- Select course --</option>
                                                                {
                                                                    courses.map((obj:CourseModel)=>(
                                                                        <option value={obj.courseName} key={obj.id}>{obj.courseName}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="publishType" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 ">Select publish for</label>
                                                            <select id="publishType" value={questionPaper.for} onChange={(event)=>{setQuestionPaper({...questionPaper,for: event.target.value})}} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                                            <option value="">-- Select course --</option>
                                                                
                                                                <option value="All Students">All Students</option>
                                                                <option value="Online Students">Online Students</option>
                                                                <option value="Offline Students">Offline Students</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="ExamType" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 ">Select exam type</label>
                                                            <select id="ExamType" value={questionPaper.examType} onChange={(event)=>{setQuestionPaper({...questionPaper,examType: event.target.value})}} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                                            <option value="">-- Select Type --</option>
                                                                
                                                                <option value="create question paper">Create question paper</option>
                                                                <option value="upload question Paper">Upload question Paper</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="minutes" className="max-w-xs block mb-2 text-sm font-medium text-gray-900">Enter number of minutes</label>
                                                            <input
                                                                id="minutes"
                                                                type="number"
                                                                value={questionPaper.duration}
                                                                onChange={(event)=>{setQuestionPaper({...questionPaper,duration : event.target.value})}}
                                                                className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">Date: </label>
                                                            <input
                                                            type="date"
                                                            value={questionPaper.date}
                                                            onChange={(event)=>{setQuestionPaper({...questionPaper,date : event.target.value})}}
                                                            className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            />

                                                        
                                                            <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">Time: </label>
                                                            <input
                                                            type="time"
                                                            value={questionPaper.time}
                                                            onChange={(event)=>{setQuestionPaper({...questionPaper,time : event.target.value})}}
                                                            className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            />
                                                        </div>






                                                    </form>



                                                    <button
                                                        onClick={()=>{
                                                            dispatch(addTempQuestionPaper(questionPaper));
                                                        
                                                            toCreatePaperPage()
                                                        }}
                                                        type="button"
                                                        className={`focus:outline-none w-full text-white bg-violet-600 hover:bg-violet-800 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 `}
                                                    >
                                                        Create Paper
                                                    </button>

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
  )
}

export default AddExamModal
